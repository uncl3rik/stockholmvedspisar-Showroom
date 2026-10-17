import { models, variants, getAsset, type ProductModel, type ProductVariant } from './showroom';

// Explicit scope for the design sketch, selected by the project owner.
// Eligibility here does not certify an enclosure system or a flue connection.
export const insertModels = models.filter(model => model.slug === 'kari');
export const insertVariants = variants.filter(variant => insertModels.some(model => model.id === variant.modelId));
export function insertPreview(model: ProductModel, variant?: ProductVariant) {
  return variant?.configurations?.[0]?.assetId || variant?.assetIds.find(id => getAsset(id).kind === 'product') || model.assetIds.find(id => getAsset(id).kind === 'product') || model.coverAssetId;
}
