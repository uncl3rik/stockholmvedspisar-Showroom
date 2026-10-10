import type { ProductVariant } from '../data/showroom';

export type Configuration = NonNullable<ProductVariant['configurations']>[number];

export function initialSelection(variants: ProductVariant[], variantId?: string, configurationId?: string) {
  const variant = variants.find(v => v.id === variantId) || variants[0];
  const configuration = variant.configurations?.find(c => c.id === configurationId) || variant.configurations?.[0];
  return { variantId: variant.id, configurationId: configuration?.id || '' };
}

/** Only offer an actual combination, preserving all the other selected attributes. */
export function configurationForOption(variant: ProductVariant, current: Configuration | undefined, key: string, value: string) {
  return variant.configurations?.find(c => c.attributes[key] === value &&
    Object.entries(current?.attributes || {}).every(([other, selected]) => other === key || c.attributes[other] === selected));
}

export function configurationLabel(variant: ProductVariant, configuration: Configuration | undefined) {
  return Object.entries(configuration?.attributes || {}).map(([key, value]) => {
    const option = variant.options?.find(o => o.key === key);
    return `${option?.name || key}: ${option?.values.find(v => v.value === value)?.label || value}`;
  }).join(' · ');
}
