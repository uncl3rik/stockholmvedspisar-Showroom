import type { KariConstruction, DimensionsMm } from '../../data/kari-construction';

export const dimensionLimits = {
  width: { min: 900, max: 2400 }, height: { min: 1200, max: 2700 },
  depth: { min: 450, max: 800 }, plinth: { min: 0, max: 600 },
} as const;
export type WoodCompartment = 'none' | 'left' | 'right';
export type EnclosureDimensions = DimensionsMm & { plinth: number };
export type GeometryOptions = EnclosureDimensions & { shelf: boolean; wood: WoodCompartment };
export type BoxPart = { id: string; size: [number, number, number]; position: [number, number, number]; kind: 'shell' | 'board' | 'insert' | 'glass' | 'wood' };
// TODO: verifiera mot vald tillverkares monteringsanvisning. Visualisation fallback, NOT a requirement.
export const UNVERIFIED_FIREBOARD_MM = 50;
export const clampDimension = (value: number, key: keyof EnclosureDimensions) => Math.max(dimensionLimits[key].min, Math.min(dimensionLimits[key].max, Math.round(value)));
export function defaultDimensions(data: KariConstruction): EnclosureDimensions | null {
  if (!data.dimensionsMm) return null;
  const d = data.dimensionsMm;
  const lining = data.fireboard?.thicknessMm ?? UNVERIFIED_FIREBOARD_MM;
  return { width: clampDimension(d.width + 400, 'width'), height: clampDimension(Math.max(2200, d.height + 700), 'height'), depth: clampDimension(Math.max(d.depth + 100, d.depth + lining + 12), 'depth'), plinth: 200 };
}

/** All calculation is in mm; emitted box transforms are metres for Three.js.
 * This checks only visual fit. Manufacturer minima and ventilation remain unknown.
 */
export function calculateGeometry(data: KariConstruction, options: GeometryOptions) {
  const parts: BoxPart[] = [];
  const warnings: string[] = [];
  const d = data.dimensionsMm;
  if (!d) return { parts, warnings: ['Mått under verifiering'], missing: true, tooSmall: false, requiredMm: null };
  const { width: w, height: h, depth: depth, plinth: base } = options;
  const t = data.fireboard?.thicknessMm ?? UNVERIFIED_FIREBOARD_MM;
  const wood = data.builtInWoodCompartment ? 'none' : options.wood;
  const frontRecess = 12;
  const bay = wood === 'none' ? 0 : 350;
  const requiredMm = { width: Math.max(d.width + 2 * t + bay, data.minimumEnclosureMm?.width ?? 0), height: Math.max(base + d.height + 2 * t, data.minimumEnclosureMm?.height ?? 0), depth: Math.max(d.depth + frontRecess + (data.tunnel ? 0 : t), data.minimumEnclosureMm?.depth ?? 0) };
  if (w < requiredMm.width) warnings.push('Omramningen är för smal för insatsen och valda skikten.');
  if (h < requiredMm.height) warnings.push('Omramningen är för låg för insatsen och sockeln.');
  if (depth < requiredMm.depth) warnings.push('Omramningen är för grund för insatsen.');
  const add = (id: string, kind: BoxPart['kind'], width: number, height: number, zSize: number, x: number, y: number, z = 0) => {
    if ([width, height, zSize, x, y, z].every(Number.isFinite) && width > 0 && height > 0 && zSize > 0)
      parts.push({ id, kind, size: [width / 1000, height / 1000, zSize / 1000], position: [x / 1000, y / 1000, z / 1000] });
  };
  const openingW = d.width + 2 * t;
  const openingH = d.height + 2 * t;
  const x = wood === 'left' ? bay / 2 : wood === 'right' ? -bay / 2 : 0;
  const left = w / 2 + x - openingW / 2;
  const right = w / 2 - x - openingW / 2;
  const openingY = base + openingH / 2;
  const side = (id: string, size: number, center: number, hasBay: boolean) => {
    if (!hasBay) { add(id, 'shell', size, h, depth, center, h / 2); return; }
    // A separate side niche made of boxes; no boolean cuts.
    const wall = Math.min(t, size / 3);
    const nicheH = Math.min(650, h - 2 * wall);
    add(id + '-outer', 'shell', wall, h, depth, center + (id === 'left' ? -1 : 1) * (size - wall) / 2, h / 2);
    add(id + '-inner', 'shell', wall, h, depth, center + (id === 'left' ? 1 : -1) * (size - wall) / 2, h / 2);
    add(id + '-bottom', 'shell', size - 2 * wall, wall, depth, center, wall / 2);
    add(id + '-top', 'shell', size - 2 * wall, h - nicheH - wall, depth, center, (h + nicheH + wall) / 2);
    add(id + '-back', 'wood', size - 2 * wall, nicheH, wall, center, wall + nicheH / 2, -depth / 2 + wall / 2);
  };
  side('left', left, -w / 2 + left / 2, wood === 'left');
  side('right', right, w / 2 - right / 2, wood === 'right');
  add('plinth', 'shell', openingW, base, depth, x, base / 2);
  add('top', 'shell', openingW, h - base - openingH, depth, x, (h + base + openingH) / 2);
  add('board-left', 'board', t, openingH, depth, x - (d.width + t) / 2, openingY);
  add('board-right', 'board', t, openingH, depth, x + (d.width + t) / 2, openingY);
  add('board-bottom', 'board', d.width, t, depth, x, base + t / 2);
  add('board-top', 'board', d.width, t, depth, x, base + t + d.height + t / 2);
  const front = depth / 2 - frontRecess;
  if (!data.tunnel) add('board-back', 'board', d.width, d.height, t, x, openingY, front - d.depth - t / 2);
  const bodyZ = front - d.depth / 2;
  add('insert', 'insert', d.width, d.height, d.depth, x, openingY, bodyZ);
  // Glass/wood-door proportions are schematic, not measured product geometry.
  const fireboxH = Math.min(d.height, data.schematicFireboxHeightMm ?? d.height);
  const woodH = data.builtInWoodCompartment ? d.height - fireboxH : 0;
  const glassH = fireboxH * 0.72;
  const glassY = openingY + woodH / 2;
  add('glass-front', 'glass', d.width * 0.85, glassH, 4, x, glassY, front + 3);
  if (data.tunnel) add('glass-back', 'glass', d.width * 0.85, glassH, 4, x, glassY, front - d.depth - 3);
  if (data.builtInWoodCompartment) add('integrated-wood', 'wood', d.width * 0.85, woodH * 0.8, 5, x, base + t + woodH / 2, front + 3);
  if (options.shelf) add('shelf', 'shell', w + 100, 50, depth + 160, 0, Math.max(25, base - 25), 80);
  return { parts, warnings, missing: false, tooSmall: warnings.length > 0, requiredMm };
}
