import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { initialSelection, configurationForOption, configurationLabel } from '../src/lib/configuration.ts';

const catalog = JSON.parse(readFileSync(new URL('../src/data/kratki-pro/catalog.json', import.meta.url)));
const products = catalog.products.map(p => ({ ...p, id: String(p.id) }));
const erik = products.find(p => p.id === '4715');

test('every registered selection resolves, has an image and preserves other choices', () => {
  let count = 0;
  for (const product of products) for (const current of product.configurations) {
    count++;
    assert.equal(initialSelection(products, product.id, current.id).configurationId, current.id);
    assert.ok(catalog.images.some(image => image.id === current.assetId));
    for (const [key, value] of Object.entries(current.attributes)) {
      assert.equal(configurationForOption(product, current, key, value).id, current.id);
      for (const candidate of product.options.find(o => o.key === key).values) {
        const next = configurationForOption(product, current, key, candidate.value);
        if (!next) continue;
        assert.equal(next.attributes[key], candidate.value);
        for (const [other, selected] of Object.entries(current.attributes)) {
          if (other !== key) assert.equal(next.attributes[other], selected);
        }
      }
    }
  }
  assert.equal(count, 72);
});

test('ERIK gold with black chamber uses its exact photo; stray taxonomy is unavailable', () => {
  const gold = erik.configurations.find(c => c.id === '4724');
  const black = configurationForOption(erik, gold, 'pa_termotec', 'svart');
  assert.equal(black.id, '4725');
  assert.equal(black.assetId, 'norrtelje-4775');
  assert.match(configurationLabel(erik, black), /Gold satin/);
  assert.match(configurationLabel(erik, black), /Svart/);
  assert.equal(configurationForOption(erik, black, 'pa_dekorativ-keramik', 'svart'), undefined);
});

test('untrusted links never select a configuration belonging to another execution', () => {
  const initial = initialSelection(products, '4715', '4852');
  assert.equal(initial.variantId, '4715');
  assert.equal(initial.configurationId, erik.configurations[0].id);
  assert.equal(initialSelection(products, 'missing', 'missing').variantId, products[0].id);
});

test('no combinations are invented for KOZA; sparse combinations preserve other choices', () => {
  const koza = products.find(p => p.id === '5209');
  assert.equal(initialSelection([koza]).configurationId, '');
  assert.equal(configurationForOption(koza, undefined, 'pa_termotec', 'vit'), undefined);
  const sparse = { configurations: [
    { id: 'a', attributes: { finish: 'gold', chamber: 'white' } },
    { id: 'b', attributes: { finish: 'grey', chamber: 'black' } },
  ] };
  assert.equal(configurationForOption(sparse, sparse.configurations[0], 'finish', 'grey'), undefined);
});
