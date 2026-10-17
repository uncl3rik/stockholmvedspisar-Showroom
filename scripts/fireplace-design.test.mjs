import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveDesign, designHref, designPreferences, parseArea } from '../src/lib/fireplace-design.ts';
const models=[{id:'kari',slug:'kari',variantIds:['kari-70','kari-80']}];
const variants=[{id:'kari-70',modelId:'kari'},{id:'kari-80',modelId:'kari'},{id:'nb-1',modelId:'nb'}];
test('only explicitly offered models and matching variants can enter later steps',()=>{
for(const query of [{steg:'rum'},{modell:'nb',variant:'nb-1',steg:'rum'},{modell:'kari',variant:'nb-1',steg:'rum'},{modell:['kari'],variant:'kari-70',steg:'rum'}]){
const result=resolveDesign(query,models,variants);
assert.equal(result.step,'insats');assert.equal(result.design.insert,null);assert.equal(result.design.enclosure,null);
}});
test('shape, connection and room area survive links between steps and reloads',()=>{
const query={modell:'kari',variant:'kari-80',steg:'rum',form:'rektangular',anslutning:'bak',kvm:'35,5'};
const original=resolveDesign(query,models,variants).design;
const href=designHref('omramning','kari','kari-80',designPreferences(original));
const restored=resolveDesign(Object.fromEntries(new URL(href,'https://example.com').searchParams),models,variants);
assert.equal(restored.step,'utforande');assert.deepEqual(restored.design,original);
assert.equal(restored.design.enclosure.shape,'rektangular');assert.equal(restored.design.enclosure.flueConnection,'bak');assert.equal(restored.design.room.areaM2,35.5);
assert.equal(restored.design.enclosure.dimensionsMm,null);assert.equal(restored.design.room.placement,null);
});
test('malformed and excessive room areas are rejected instead of guessed',()=>{
for(const value of ['', '0','-5','NaN','Infinity','1e3','10001','12.345','abc',['20']])assert.equal(parseArea(value),null);
assert.equal(parseArea('0,01'),0.01);assert.equal(parseArea(' 35.5 '),35.5);
});
test('unknown preferences stay unselected and invalid steps preserve a valid model',()=>{
const {design,step}=resolveDesign({modell:'kari',variant:'kari-70',steg:'checkout',form:'round',anslutning:['bak'],kvm:'-1'},models,variants);
assert.equal(step,'insats');assert.equal(design.insert.variantId,'kari-70');assert.equal(design.enclosure,null);assert.equal(design.room,null);
});
