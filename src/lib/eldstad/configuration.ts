import type { KariConstruction } from '../../data/kari-construction';
import { calculateGeometry, dimensionLimits, normalizeGlazing, normalizeWood, glazingLabels, defaultDimensions, clampDimension, type GeometryOptions, type EnclosureDimensions } from './geometry';
import { detailPreferences, readDetails, profileLabels, type DetailPreferences, type DetailSettings } from './details';

export const finishes = {
  puts: { label: 'Puts', roughness: 0.95, metalness: 0 },
  mikrocement: { label: 'Mikrocement', roughness: 0.72, metalness: 0 },
  kakel: { label: 'Kakel', roughness: 0.22, metalness: 0 },
  natursten: { label: 'Natursten', roughness: 0.85, metalness: 0 },
  stal: { label: 'Stålplåt', roughness: 0.36, metalness: 0.85 },
} as const;
export const colors = { vit: { label: 'vit', hex: '#e9e6df' }, sand: { label: 'sand', hex: '#c5b397' }, gra: { label: 'grå', hex: '#818482' }, svart: { label: 'svart', hex: '#292c2b' } } as const;
export type VisualPreferences = { dim?: string; mat?: string; kul?: string; hy?: string; ved?: string; glas?: string } & DetailPreferences;
export type EnclosureConfig = GeometryOptions & DetailSettings & { finish: keyof typeof finishes; color: keyof typeof colors };
export function readEnclosure(data: KariConstruction, query: VisualPreferences): EnclosureConfig | null {
  const defaults = defaultDimensions(data);
  if (!defaults) return null;
  const dimensions = { ...defaults };
  if (query.dim && /^\d{1,5}\.\d{1,5}\.\d{1,5}\.\d{1,5}$/.test(query.dim)) {
    const values = query.dim.split('.').map(Number);
    (['width', 'height', 'depth', 'plinth'] as (keyof EnclosureDimensions)[]).forEach((key, i) => { dimensions[key] = clampDimension(values[i], key); });
  }
  const glazing = normalizeGlazing(data, query.glas);
  return { ...dimensions, ...readDetails(query), glazing, shelf: query.hy === '1', wood: normalizeWood(data, glazing, query.ved), finish: query.mat && Object.hasOwn(finishes, query.mat) ? query.mat as keyof typeof finishes : 'puts', color: query.kul && Object.hasOwn(colors, query.kul) ? query.kul as keyof typeof colors : 'vit' };
}
export function visualPreferences(config: EnclosureConfig): VisualPreferences {
  return { ...detailPreferences(config), glas: config.glazing ?? 'front', dim: [config.width, config.height, config.depth, config.plinth].join('.'), mat: config.finish, kul: config.color, hy: config.shelf ? '1' : '0', ved: config.wood };
}
/** Fit added modules without changing the insert. Loading old drafts never silently resizes them. */
export function updateEnclosure(data: KariConstruction, current: EnclosureConfig, patch: Partial<EnclosureConfig>) {
  const config = readEnclosure(data, visualPreferences({ ...current, ...patch }));
  const adjusted: (keyof EnclosureDimensions)[] = [];
  const required = config && calculateGeometry(data, config).requiredMm;
  if (config && required) for (const key of ['width','height','depth'] as const) {
    if (config[key] < required[key] && required[key] <= dimensionLimits[key].max) {
      config[key] = required[key]; adjusted.push(key);
    }
  }
  return { config, adjusted };
}
export function enclosureSummary(config: EnclosureConfig) {
  return `${profileLabels[config.profile]}${config.profile === 'stepped' ? `, indrag ${config.shoulderInset} mm per sida` : ''} · ${glazingLabels[config.glazing ?? 'front']} · ${finishes[config.finish].label}, ${colors[config.color].label} · ${config.width} × ${config.height} × ${config.depth} mm · sockel ${config.plinth} mm${config.shelf ? ` · hylla ${config.shelfLevel === 'above' ? 'över' : 'under'} elden, utstick ${config.shelfExtension} mm ${config.shelfSide === 'both' ? 'åt båda håll' : config.shelfSide === 'left' ? 'åt vänster' : 'åt höger'}, djup framför omramningen ${config.shelfProjection} mm, tjocklek ${config.shelfThickness} mm` : ''}${config.wood !== 'none' ? ` · vedfack ${config.wood === 'left' ? 'vänster' : 'höger'}, öppning ${config.woodWidth} × ${config.woodHeight} mm, ${config.woodDivisions + 1} fack` : ''}`;
}
