import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require(require.resolve('sharp', { paths: [path.dirname(require.resolve('next/package.json'))] }));
const origin = 'https://norrteljeeldstader.se';
const sourceUrl = `${origin}/varum%C3%A4rke/kratki-pro/`;
const decode = s => s.replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&amp;/g, '&').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/&nbsp;/g, ' ');
async function get(url) { const r = await fetch(url); if (!r.ok) throw new Error(`${r.status}: ${url}`); return r; }
async function pool(items, fn, workers = 4) { let cursor = 0; await Promise.all(Array.from({ length: workers }, async () => { while (cursor < items.length) { const i = cursor++; await fn(items[i], i); } })); }
const html = await (await get(sourceUrl)).text();
const urls = [...new Set([...html.matchAll(/href="(https:\/\/norrteljeeldstader.se\/produkt\/[^"#?]+)"/g)].map(m => decode(m[1])))];
if (!urls.length) throw new Error('No products in the source category');
let sourceProducts = [];
for (let page = 1; ; page++) {
  const r = await get(`${origin}/wp-json/wc/store/v1/products?per_page=100&page=${page}`);
  sourceProducts.push(...await r.json());
  if (page >= Number(r.headers.get('x-wp-totalpages') || 1)) break;
}
const products = urls.map(url => { const p = sourceProducts.find(p => p.permalink === url); if (!p) throw new Error(`Product missing: ${url}`); return p; });
const configurations = new Map();
await pool(products, async p => {
  const page = await (await get(p.permalink)).text();
  const match = page.match(/data-product_variations="([^"]+)"/);
  const rows = match ? JSON.parse(decode(match[1])) : [];
  if (!Array.isArray(rows)) throw new Error(`Variation data not exposed: ${p.permalink}`);
  if (rows.length !== p.variations.length) throw new Error(`Variation count mismatch: ${p.name}`);
  configurations.set(p.id, rows);
});
const images = new Map();
for (const p of products) {
  for (const image of p.images) images.set(image.src, { url: image.src, name: decode(image.name), id: `norrtelje-${image.id}` });
  for (const c of configurations.get(p.id)) if (c.image?.url && !images.has(c.image.url)) images.set(c.image.url, { url: c.image.url, name: decode(c.image.title || p.name), id: `norrtelje-config-${c.variation_id}` });
}
fs.mkdirSync('public/images/kratki/catalog', { recursive: true });
await pool([...images.values()], async (image, index) => {
  image.src = `/images/kratki/catalog/${image.id}.webp`;
  const file = path.join('public', image.src);
  if (!fs.existsSync(file)) {
    const buffer = Buffer.from(await (await get(image.url)).arrayBuffer());
    await sharp(buffer).rotate().resize({ width: 1800, height: 1800, fit: 'inside', withoutEnlargement: true }).webp({ quality: 86 }).toFile(file);
  }
  const metadata = await sharp(file).metadata();
  image.width = metadata.width; image.height = metadata.height;
  if (index % 50 === 0) console.log(`Images: ${index + 1}/${images.size}`);
});
const catalog = {
  sourceUrl, retrievedOn: new Date().toISOString().slice(0, 10), permission: 'User confirmed permission to use Kratki material, 2026-10-02',
  products: products.map(p => ({
    id: p.id, name: decode(p.name.replace(/^Kratki Braskamin /, '')), slug: p.slug.replace(/^kratki-braskamin-/, ''), sourceUrl: p.permalink, sku: p.sku || null,
    specifications: Object.fromEntries(p.attributes.filter(a => !a.has_variations).map(a => [decode(a.name), a.terms.map(t => decode(t.name)).join(', ')])),
    power: [...new Set((p.description + p.short_description).match(/\d+(?:[,.]\d+)?\s*kW/g) || [])],
    options: p.attributes.filter(a => a.has_variations).map(a => ({ name: decode(a.name), key: a.taxonomy || a.name, values: a.terms.map(t => ({ label: decode(t.name), value: t.slug })) })),
    configurations: configurations.get(p.id).map(c => ({ id: String(c.variation_id), sku: c.sku || null, attributes: Object.fromEntries(Object.entries(c.attributes).map(([key, value]) => [key.replace(/^attribute_/, ''), value])), assetId: c.image?.url ? images.get(c.image.url).id : null })),
    imageIds: [...new Set(p.images.map(i => images.get(i.src).id))],
    documentLinks: [...p.description.matchAll(/href="([^"]+)"/g)].map(m => decode(m[1])).filter(url => url.startsWith('https://www.spisochkamin.se/')).map(url => ({ label: 'Produktunderlag hos svensk distributör', url })),
  })), images: [...images.values()],
};
fs.mkdirSync('src/data/kratki-pro', { recursive: true });
fs.writeFileSync('src/data/kratki-pro/catalog.json', JSON.stringify(catalog, null, 2) + '\n');
console.log(`Imported ${catalog.products.length} products, ${catalog.products.reduce((n, p) => n + p.configurations.length, 0)} configurations, ${catalog.images.length} images.`);
