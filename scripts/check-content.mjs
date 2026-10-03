import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';

const cache = new Map();
function load(file) {
  file = path.resolve(file);
  if (cache.has(file)) return cache.get(file).exports;
  if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
  const source = fs.readFileSync(file, 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true } }).outputText;
  const contentModule = { exports: {} };
  cache.set(file, contentModule);
  vm.runInNewContext(compiled, { module: contentModule, exports: contentModule.exports, require: name => load(path.resolve(path.dirname(file), name.endsWith('.json') ? name : `${name}.ts`)) }, { filename: file });
  return contentModule.exports;
}
const { models, variants, settings, showroomScenes, mediaAssets } = load('src/data/showroom.ts');
const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
for (const list of [models, variants, settings, showroomScenes, mediaAssets]) {
  assert(new Set(list.map(x => x.id)).size === list.length, 'Duplicate content ID');
  const slugs = list.filter(x => x.slug).map(x => x.slug);
  assert(new Set(slugs).size === slugs.length, 'Duplicate route slug');
}
for (const m of models) {
  assert(mediaAssets.some(a => a.id === m.coverAssetId && a.modelId === m.id), `${m.id}: missing or mismatched cover`);
  for (const id of m.assetIds) assert(mediaAssets.some(a => a.id === id && a.modelId === m.id), `${m.id}: invalid media ${id}`);
  for (const id of m.variantIds) assert(variants.some(v => v.id === id && v.modelId === m.id), `${m.id}: invalid variant ${id}`);
}
for (const v of variants) {
  assert(models.some(m => m.id === v.modelId), `${v.id}: missing model`);
  assert(Boolean(v.sourceUrl && v.verifiedOn), `${v.id}: missing provenance`);
  assert(models.some(m => m.variantIds.includes(v.id)), `${v.id}: orphaned variant`);
  for (const id of v.assetIds) assert(mediaAssets.some(a => a.id === id && a.modelId === v.modelId), `${v.id}: invalid media ${id}`);
  assert(new Set((v.configurations || []).map(c => c.id)).size === (v.configurations || []).length, `${v.id}: duplicate configuration`);
  for (const c of v.configurations || []) {
    if (c.assetId) assert(mediaAssets.some(a => a.id === c.assetId && a.variantId === v.id), `${c.id}: mismatched image`);
    for (const [key, value] of Object.entries(c.attributes)) assert(v.options.some(o => o.key === key && o.values.some(x => x.value === value)), `${c.id}: unknown material option`);
  }
}
for (const a of mediaAssets) {
  assert(fs.existsSync(path.join('public', a.src)), `${a.id}: missing file ${a.src}`);
  assert(models.some(m => m.id === a.modelId), `${a.id}: missing model`);
  if (a.variantId) assert(variants.some(v => v.id === a.variantId && v.modelId === a.modelId), `${a.id}: mismatched variant`);
  assert(Boolean(a.alt && a.credit && a.sourceUrl), `${a.id}: missing media metadata`);
}
for (const setting of settings) {
  assert(models.some(m => m.id === setting.modelId), `${setting.id}: missing model`);
  if (setting.variantId) assert(variants.some(v => v.id === setting.variantId && v.modelId === setting.modelId), `${setting.id}: mismatched variant`);
}
for (const scene of showroomScenes) {
  const setting = settings.find(s => s.id === scene.settingId);
  assert(Boolean(setting), `${scene.id}: missing setting`);
  for (const id of scene.assetIds) assert(mediaAssets.some(a => a.id === id && a.modelId === setting?.modelId), `${scene.id}: invalid media ${id}`);
}
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Content verified: ${models.length} model families, ${variants.length} variants, ${showroomScenes.length} scenes, ${mediaAssets.length} assets.`);
const catalog = load('src/data/kratki-pro/catalog.json');
assert(catalog.products.every(p => variants.some(v => v.sourceProductId === String(p.id))), 'Imported product missing from showroom');
assert(variants.filter(v => v.sourceProductId).length === catalog.products.length, 'Catalog coverage mismatch');
if (errors.length) throw new Error(errors.join('\n'));
