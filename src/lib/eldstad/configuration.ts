import type { KariConstruction } from '../../data/kari-construction';
import { defaultDimensions, clampDimension, type GeometryOptions, type EnclosureDimensions } from './geometry';

export const finishes = {
  puts: { label: 'Puts', roughness: 0.95, metalness: 0 },
  mikrocement: { label: 'Mikrocement', roughness: 0.72, metalness: 0 },
  kakel: { label: 'Kakel', roughness: 0.22, metalness: 0 },
  natursten: { label: 'Natursten', roughness: 0.85, metalness: 0 },
  stal: { label: 'Stålplåt', roughness: 0.36, metalness: 0.85 },
} as const;
export const colors = { vit: { label: 'vit', hex: '#e9e6df' }, sand: { label: 'sand', hex: '#c5b397' }, gra: { label: 'grå', hex: '#818482' }, svart: { label: 'svart', hex: '#292c2b' } } as const;
export type VisualPreferences = { dim?: string; mat?: string; kul?: string; hy?: string; ved?: string };
export type EnclosureConfig = GeometryOptions & { finish: keyof typeof finishes; color: keyof typeof colors };
export function readEnclosure(data: KariConstruction, query: VisualPreferences): EnclosureConfig | null {
  const defaults = defaultDimensions(data);
  if (!defaults) return null;
  const dimensions = { ...defaults };
  if (query.dim && /^\d{1,5}\.\d{1,5}\.\d{1,5}\.\d{1,5}$/.test(query.dim)) {
    const values = query.dim.split('.').map(Number);
    (['width', 'height', 'depth', 'plinth'] as (keyof EnclosureDimensions)[]).forEach((key, i) => { dimensions[key] = clampDimension(values[i], key); });
  }
  return { ...dimensions, shelf: query.hy === '1', wood: !data.builtInWoodCompartment && (query.ved === 'left' || query.ved === 'right') ? query.ved : 'none', finish: query.mat && Object.hasOwn(finishes, query.mat) ? query.mat as keyof typeof finishes : 'puts', color: query.kul && Object.hasOwn(colors, query.kul) ? query.kul as keyof typeof colors : 'vit' };
}
export function visualPreferences(config: EnclosureConfig): VisualPreferences {
  return { dim: [config.width, config.height, config.depth, config.plinth].join('.'), mat: config.finish, kul: config.color, hy: config.shelf ? '1' : '0', ved: config.wood };
}
export function enclosureSummary(config: EnclosureConfig) {
  return `${finishes[config.finish].label}, ${colors[config.color].label} · ${config.width} × ${config.height} × ${config.depth} mm · sockel ${config.plinth} mm${config.shelf ? ' · hylla' : ''}${config.wood !== 'none' ? ` · vedfack ${config.wood === 'left' ? 'vänster' : 'höger'}` : ''}`;
}
