import catalog from './catalog.json';
import { families } from './families';
import type { MediaAsset, ProductModel, ProductVariant } from '../showroom';

const familyFor = (name: string) => {
  const family = families.find(f => name.startsWith(f.prefix));
  if (!family) throw new Error(`Ungrouped Kratki Pro product: ${name}`);
  return family;
};
const mediaId = (productId: number, imageId: string) => `retailer-${productId}-${imageId}`;
const variantId = (productId: number) => `variant-retailer-${productId}`;
const roomImage = (product: typeof catalog.products[number]) => ![5094, 5217].includes(product.id) ? product.imageIds[1] : undefined;

export const retailerAssets: MediaAsset[] = catalog.products.flatMap(product => {
  const ids = [...new Set([...product.imageIds, ...product.configurations.map(c => c.assetId).filter((id): id is string => Boolean(id))])];
  return ids.map(imageId => {
    const image = catalog.images.find(i => i.id === imageId)!;
    const drawing = /matt|ritning|scaled\.jpg/i.test(image.url);
    return {
      id: mediaId(product.id, imageId), src: image.src, kind: drawing ? 'drawing' : imageId === roomImage(product) ? 'render' : imageId === product.imageIds[0] ? 'product' : 'photo',
      alt: `Kratki ${product.name} — ${drawing ? 'måttunderlag' : image.name}`,
      viewLabel: drawing ? 'Måttunderlag' : imageId === roomImage(product) ? 'I rummet' : imageId === product.imageIds[0] ? 'Produktvy' : `Bild ${ids.indexOf(imageId) + 1}`,
      credit: 'Kratki · via Norrtelje Eldstäder', sourceUrl: product.sourceUrl, originalUrl: image.url,
      modelId: `model-${familyFor(product.name).slug}`, variantId: variantId(product.id), focalPoint: '50% 50%', rights: 'permission-confirmed',
    };
  });
});

export const retailerVariants: ProductVariant[] = catalog.products.map(product => {
  const specifications: Record<string, string> = {};
  const issues: string[] = [];
  if (product.power.length === 1) specifications['Effekt enligt källa'] = product.power[0];
  else issues.push('Effekt saknas eller är inte entydig i källan.');
  for (const [key, value] of Object.entries(product.specifications)) {
    if (!value || value === '-') { issues.push(`${key} saknas i källan.`); continue; }
    if (key.startsWith('Mått') && !/\b(?:cm|mm)\b/.test(value)) {
      specifications['Mått B × H × D (källvärde)'] = value;
      issues.push('Enhet för måtten saknas i källan och behöver verifieras.');
    } else if (key === 'Vikt' && !/kg/.test(value)) {
      specifications['Vikt (källvärde)'] = value;
      issues.push('Enhet för vikten saknas i källan och behöver verifieras.');
    } else specifications[key === 'Garanti' ? 'Garanti enligt återförsäljaren' : key] = value;
  }
  if (!product.sku) issues.push('Tillverkarens artikelnummer saknas i källan.');
  return {
    id: variantId(product.id), modelId: `model-${familyFor(product.name).slug}`, name: product.name.toUpperCase(), sku: product.sku,
    sourceUrl: product.sourceUrl, sourceName: 'Norrtelje Eldstäder', sourceProductId: String(product.id), verifiedOn: catalog.retrievedOn, specifications, issues,
    assetIds: product.imageIds.map(id => mediaId(product.id, id)), documentLinks: product.documentLinks,
    options: product.options,
    configurations: product.configurations.map(c => ({ ...c, id: `configuration-retailer-${c.id}`, sourceId: c.id, assetId: c.assetId ? mediaId(product.id, c.assetId) : null })),
  };
});

const executionOrder: Record<string,number[]> = {ren:[5172,5155,5094],erik:[5318,4715,4400,4547,4570],bjorn:[4821,4836],kari:[5080,5067,5047,5033,5020,5006,5189,5199]};
export const retailerModels: ProductModel[] = families.map(family => {
  const products = catalog.products.filter(p => familyFor(p.name).slug === family.slug).sort((a,b) => (executionOrder[family.slug]?.indexOf(a.id) || 0) - (executionOrder[family.slug]?.indexOf(b.id) || 0));
  const lead = products[0];
  const room = roomImage(lead);
  const initial = [room, lead.imageIds[0]].filter((id): id is string => Boolean(id));
  return {
    id: `model-${family.slug}`, slug: family.slug, name: family.name, brand: 'Kratki Pro', category: 'stove', glazing: family.glazing,
    glazingOptions: family.slug === 'kari' ? ['front', 'tunnel'] : [family.glazing],
    tagline: family.tagline, description: family.description, designNotes: [...family.notes],
    coverAssetId: mediaId(lead.id, room || lead.imageIds[0]), assetIds: initial.map(id => mediaId(lead.id, id)),
    variantIds: products.map(p => variantId(p.id)), sourceUrl: catalog.sourceUrl,
  };
});
export const catalogSummary = { families: retailerModels.length, products: catalog.products.length, configurations: catalog.products.reduce((n, p) => n + p.configurations.length, 0), images: catalog.images.length, retrievedOn: catalog.retrievedOn, sourceUrl: catalog.sourceUrl };
