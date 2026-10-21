import { i1Construction } from './contura-i1';
import { conturaConstruction } from './contura-i8';
import { kariConstruction } from './kari-construction';
import { models, variants, getAsset, type ProductModel, type ProductVariant } from './showroom';

// Explicit scope for the design sketch, selected by the project owner.
// Eligibility here does not certify an enclosure system or a flue connection.
export const insertModels = models.filter(model => ['kari', 'contura-i8', 'contura-i1'].includes(model.slug));
export const insertVariants = variants.filter(variant => insertModels.some(model => model.id === variant.modelId)).map(variant => ({ ...variant, construction: variant.id === 'variant-contura-i1' ? i1Construction : variant.id === 'variant-contura-i8' ? conturaConstruction : kariConstruction[variant.id] }));
export function insertPreview(model: ProductModel, variant?: ProductVariant) {
  return variant?.configurations?.[0]?.assetId || variant?.assetIds.find(id => getAsset(id).kind === 'product') || model.assetIds.find(id => getAsset(id).kind === 'product') || model.coverAssetId;
}
