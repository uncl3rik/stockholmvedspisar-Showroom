import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

// Load the same pure TypeScript modules without browser or WebGL dependencies.
const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file);
  const testModule = { exports: {} };
  const js = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(js, { URLSearchParams, module: testModule, exports: testModule.exports, require: name => load(path.resolve(path.dirname(file), name + '.ts')) });
  cache.set(file, testModule.exports);
  return testModule.exports;
}
const { kariConstruction } = load('src/data/kari-construction.ts');
const { calculateGeometry, defaultDimensions, dimensionLimits } = load('src/lib/eldstad/geometry.ts');
const { readEnclosure, visualPreferences } = load('src/lib/eldstad/configuration.ts');
const { faceRepeats, splitShell, hollowInsert } = load('src/lib/eldstad/surfaces.ts');
const { encodeDraft, decodeDraft, draftContactHref } = load('src/lib/design-draft.ts');
const { roomLayout, powerGuidance } = load('src/lib/eldstad/room.ts');
const { conturaConstruction, conturaModel, conturaVariant } = load('src/data/contura-i8.ts');
const { designHref, resolveDesign, designPreferences } = load('src/lib/fireplace-design.ts');
const normal = kariConstruction['variant-retailer-5080'];
const options = data => ({ ...defaultDimensions(data), shelf: false, wood: 'none' });
const plain = value => JSON.parse(JSON.stringify(value));

test('Contura i8 uses manufacturer millimetres and works through all guide steps and contact', () => {
  assert.equal(conturaModel.brand, 'Contura');
  assert.deepEqual(plain(conturaConstruction.dimensionsMm), {width:735,height:530,depth:365});
  assert.equal(conturaConstruction.dimensionsStatus, 'verified');
  const config=readEnclosure(conturaConstruction, {});
  assert.equal(calculateGeometry(conturaConstruction, config).tooSmall,false);
  const prefs={...visualPreferences(config),placering:'vagg',anslutning:'vet-ej',kvm:'25'};
  for (const step of ['insats','utforande','rum']) {
    const query=Object.fromEntries(new URL(designHref(step,conturaModel.slug,conturaVariant.id,prefs),'https://example.com').searchParams);
    assert.equal(resolveDesign(query,[conturaModel],[conturaVariant]).step,step);
  }
  const contact=new URL(draftContactHref(conturaModel.slug,conturaVariant.id,prefs),'https://example.com');
  const restored=resolveDesign(decodeDraft(contact.searchParams.get('utkast')),[conturaModel],[conturaVariant]);
  assert.equal(restored.design.insert.variantId,'variant-contura-i8');
  assert.equal(restored.design.room.areaM2,25);
});

test('whole draft survives contact handoff with placement, flue and product configuration', () => {
  const prefs = { dim:'1400.2400.650.200',mat:'kakel',kul:'gra',hy:'1',ved:'left',placering:'horn',anslutning:'ny',kvm:'35.5',konfiguration:'finish-1' };
  const href = draftContactHref('kari','v',prefs);
  const query = new URL(href,'https://example.com').searchParams;
  assert.equal(query.get('konfiguration'),'finish-1');
  const decoded = decodeDraft(query.get('utkast'));
  const restored = resolveDesign({...decoded,steg:'rum'},[{id:'kari',slug:'kari',variantIds:['v']}],[{id:'v',modelId:'kari',configurations:[{id:'finish-1'}]}]);
  assert.equal(restored.design.room.placementKind,'horn');
  assert.equal(restored.design.enclosure.flueConnection,'ny');
  const actual=plain(designPreferences(restored.design));
  assert.deepEqual(actual,prefs);
  assert.equal(decodeDraft(encodeDraft('kari','v',prefs)).variant,'v');
});
test('broken, excessive or unknown-version compact drafts are rejected', () => {
  for (const value of ['', 'no-json', '{}', '[2]', 'x'.repeat(3000), ['bad']]) assert.equal(decodeDraft(value),null);
});
test('placement without an area survives and unknown placements stay unselected', () => {
  const model=[{id:'kari',slug:'kari',variantIds:['v']}], variant=[{id:'v',modelId:'kari'}];
  const result=resolveDesign({modell:'kari',variant:'v',steg:'rum',placering:'mitt',anslutning:'vet-ej'},model,variant);
  assert.equal(result.design.room.placementKind,'mitt');
  assert.equal(result.design.room.areaM2,null);
  assert.equal(result.design.enclosure.flueConnection,'vet-ej');
  assert.equal(resolveDesign({modell:'kari',variant:'v',placering:'ceiling'},model,variant).design.room,null);
});
test('room plan uses area, moves walls and rotates only a corner placement', () => {
  const wall=roomLayout(25,'vagg',1400,600), corner=roomLayout(25,'horn',1400,600), middle=roomLayout(25,'mitt',1400,600);
  assert.equal(wall.side,5);
  assert.equal(corner.rotation,Math.PI/4);
  assert.equal(middle.rear,-2.5);
  assert.ok(wall.rear>middle.rear);
  assert.ok(corner.left>wall.left);
  assert.equal(roomLayout(0.1,'vagg',1400,600).illustrationTooSmall,true);
  assert.equal(roomLayout(null,undefined,1400,600).side,5);
});
test('power guidance handles high, low, unknown and missing-area cases without approvals', () => {
  assert.match(powerGuidance(25,'8 kW'),/320 W\/m²/);
  assert.match(powerGuidance(25,'8 kW'),/övervärme/);
  assert.match(powerGuidance(500,'8 kW'),/låg/);
  assert.match(powerGuidance(null,'8 kW'),/Ange rumsyta/);
  assert.match(powerGuidance(25,'6–12 kW'),/inte entydig/);
});

test('physical texture repeats retain tile size on all six box faces', () => {
  assert.deepEqual(plain(faceRepeats([2.4, 1.2, 0.6], [0.6, 0.6])), [[1,2],[1,2],[4,1],[4,1],[4,2],[4,2]]);
});
test('inspection split preserves shell volume and cuts exactly at the middle', () => {
  const part = { id: 'top', kind: 'shell', size: [2,1,0.6], position: [0.2,2,0] };
  const halves = splitShell(part);
  assert.equal(halves.length, 2);
  assert.equal(halves.reduce((sum, p) => sum + p.size[0], 0), 2);
  assert.equal(halves[0].position[0] + halves[0].size[0] / 2, 0);
  assert.equal(halves[1].position[0] - halves[1].size[0] / 2, 0);
  assert.equal(splitShell({ ...part, position: [2,2,0] }).length, 1);
});
test('schematic fire chamber is hollow and tunnel has no opaque back', () => {
  const parts = calculateGeometry(normal, options(normal)).parts;
  const body = parts.find(p => p.id === 'insert');
  const glass = parts.find(p => p.id === 'glass-front');
  assert.equal(hollowInsert(body, glass, false).length, 5);
  assert.equal(hollowInsert(body, glass, true).length, 4);
  assert.ok(hollowInsert(body, glass, false).every(p => p.size.every(n => n > 0)));
});

test('all seven measured variants fit their defaults; missing dimensions create no invented model', () => {
  for (const data of Object.values(kariConstruction)) {
    assert.equal(data.minimumEnclosureMm, null);
    assert.equal(data.glbPath, null);
    if (!data.dimensionsMm) {
      assert.equal(defaultDimensions(data), null);
      assert.equal(readEnclosure(data, {}), null);
      const geometry = calculateGeometry(data, options(normal));
      assert.equal(geometry.missing, true);
      assert.equal(geometry.parts.length, 0);
    } else {
      assert.equal(data.dimensionsStatus, 'unverified');
      assert.equal(calculateGeometry(data, options(data)).tooSmall, false);
    }
  }
});
test('every known insert keeps its own physical size when enclosure dimensions change', () => {
  for (const data of [...Object.values(kariConstruction),conturaConstruction].filter(d=>d.dimensionsMm)) {
    const normalGeometry=calculateGeometry(data,options(data));
    const expanded=calculateGeometry(data,{...options(data),width:2400,height:2700,depth:800});
    const body=normalGeometry.parts.find(p=>p.id==='insert');
    assert.deepEqual(plain(body.size),[data.dimensionsMm.width/1000,data.dimensionsMm.height/1000,data.dimensionsMm.depth/1000]);
    assert.deepEqual(plain(expanded.parts.find(p=>p.id==='insert').size),plain(body.size));
  }
});
test('W sketch uses the corresponding firebox proportions above its wood compartment', () => {
  for(const [baseId,wId] of [['5080','5067'],['5047','5033'],['5020','5006']]) {
    const base=kariConstruction['variant-retailer-'+baseId], w=kariConstruction['variant-retailer-'+wId];
    const a=calculateGeometry(base,options(base)).parts.find(p=>p.id==='glass-front');
    const parts=calculateGeometry(w,options(w)).parts;
    const b=parts.find(p=>p.id==='glass-front');
    const wood=parts.find(p=>p.id==='integrated-wood');
    assert.deepEqual(plain(a.size),plain(b.size));
    assert.ok(wood.position[1]+wood.size[1]/2 < b.position[1]-b.size[1]/2);
  }
});
test('50 mm boards surround the measured opening and emitted sizes are in metres', () => {
  const result = calculateGeometry(normal, options(normal));
  const part = id => result.parts.find(p => p.id === id);
  assert.deepEqual(plain(part('insert').size), [0.68, 0.574, 0.5]);
  assert.equal(part('board-left').size[0], 0.05);
  assert.equal(part('board-bottom').size[1], 0.05);
  assert.equal(result.requiredMm.width, 780);
  assert.equal(result.requiredMm.depth, 562);
  assert.equal(part('board-back').size[2], 0.05);
  assert.equal(calculateGeometry({ ...normal, fireboard: { thicknessMm: 80, verified: true } }, options(normal)).requiredMm.width, 840);
});
test('too-small dimensions warn on every axis and never emit negative or nonfinite boxes', () => {
  const large = kariConstruction['variant-retailer-5006'];
  const result = calculateGeometry(large, { width: 900, height: 1200, depth: 450, plinth: 600, wood: 'left', shelf: true });
  assert.equal(result.warnings.length, 3);
  assert.equal(result.tooSmall, true);
  for (const data of Object.values(kariConstruction).filter(d => d.dimensionsMm)) {
    for (let mask = 0; mask < 16; mask++) {
      const dimensions = Object.fromEntries(Object.entries(dimensionLimits).map(([key, limits], i) => [key, mask & (1 << i) ? limits.min : limits.max]));
      for (const wood of ['none', 'left', 'right']) {
        const geometry = calculateGeometry(data, { ...dimensions, wood, shelf: true });
        for (const part of geometry.parts) {
          assert.ok(part.size.every(n => Number.isFinite(n) && n > 0));
          assert.ok(part.position.every(Number.isFinite));
        }
      }
    }
  }
});
test('manufacturer minima take precedence over visual fit', () => {
  const data = { ...normal, minimumEnclosureMm: { width: 1500, height: 2500, depth: 700 } };
  assert.equal(calculateGeometry(data, options(normal)).warnings.length, 3);
});
test('wood niches mirror; W variants suppress extra niches; only tunnels have rear glass', () => {
  const left = calculateGeometry(normal, { ...options(normal), wood: 'left', shelf: true });
  const right = calculateGeometry(normal, { ...options(normal), wood: 'right' });
  assert.equal(left.parts.find(p => p.id === 'insert').position[0], -right.parts.find(p => p.id === 'insert').position[0]);
  assert.ok(left.parts.some(p => p.id === 'shelf'));
  const w = kariConstruction['variant-retailer-5067'];
  assert.deepEqual(plain(calculateGeometry(w, { ...options(w), wood: 'left' })), plain(calculateGeometry(w, options(w))));
  assert.equal(readEnclosure(w, { ved: 'left' }).wood, 'none');
  assert.equal(left.parts.some(p => p.id === 'glass-back'), false);
  const tunnel = kariConstruction['variant-retailer-5189'];
  assert.ok(calculateGeometry(tunnel, options(tunnel)).parts.some(p => p.id === 'glass-back'));
});
test('every visual selection survives URL round-trip and step 03 links', () => {
  const chosen = { width: 1400, height: 2400, depth: 650, plinth: 250, shelf: true, wood: 'right', finish: 'stal', color: 'sand' };
  const prefs = { ...visualPreferences(chosen), anslutning: 'bak', kvm: '35.5' };
  const query = Object.fromEntries(new URL(designHref('rum', 'kari', 'v', prefs), 'https://example.com').searchParams);
  const result = resolveDesign(query, [{ id: 'kari', slug: 'kari', variantIds: ['v'] }], [{ id: 'v', modelId: 'kari' }]);
  assert.equal(result.step, 'rum');
  assert.deepEqual(plain(readEnclosure(normal, designPreferences(result.design))), chosen);
  assert.equal(result.design.room.areaM2, 35.5);
  assert.equal(result.design.enclosure.flueConnection, 'bak');
});
test('invalid URL values fall back safely, valid numbers clamp to supported ranges', () => {
  const bad = readEnclosure(normal, { dim: 'NaN.1.2.3', mat: '__proto__', kul: 'unknown', hy: 'yes', ved: 'back' });
  assert.equal(bad.width, defaultDimensions(normal).width);
  assert.equal(bad.finish, 'puts');
  assert.equal(bad.color, 'vit');
  assert.equal(bad.shelf, false);
  assert.equal(bad.wood, 'none');
  const clamped = readEnclosure(normal, { dim: '1.9999.1.9999' });
  assert.deepEqual([clamped.width, clamped.height, clamped.depth, clamped.plinth], [900, 2700, 450, 600]);
});

