import type { KariConstruction, DimensionsMm } from '../../data/kari-construction';
import { normalizeDetails, type DetailSettings } from './details';

export const dimensionLimits = {
  width: { min: 900, max: 2400 }, height: { min: 1200, max: 2700 },
  depth: { min: 450, max: 800 }, plinth: { min: 0, max: 600 },
} as const;
export type WoodCompartment = 'none' | 'left' | 'right';
export type EnclosureDimensions = DimensionsMm & { plinth: number };
export const glazingLabels = { front: 'Frontglas', left: 'Front + vänster sida', right: 'Front + höger sida', both: 'Front + båda sidor' } as const;
export type InsertGlazing = keyof typeof glazingLabels;
export function normalizeGlazing(data: KariConstruction, value?: string): InsertGlazing {
  return data.sideGlazing && value && Object.hasOwn(glazingLabels, value) ? value as InsertGlazing : 'front';
}
export function normalizeWood(data: KariConstruction, glazing: InsertGlazing, wood?: string): WoodCompartment {
  return !data.builtInWoodCompartment && (wood === 'left' || wood === 'right') && glazing !== 'both' && glazing !== wood ? wood : 'none';
}
export type GeometryOptions = EnclosureDimensions & Partial<DetailSettings> & { shelf: boolean; wood: WoodCompartment; glazing?: InsertGlazing };
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
  const glazing = normalizeGlazing(data, options.glazing);
  const wood = normalizeWood(data, glazing, options.wood);
  const detail = normalizeDetails(options);
  const frontRecess = 12;
  const bay = wood === 'none' ? 0 : detail.woodWidth + 2 * t;
  const nicheBottom = options.shelf && detail.shelfLevel === 'below' ? Math.max(t, base, detail.shelfThickness) : t;
  const nicheTop = wood === 'none' ? 0 : nicheBottom + detail.woodHeight + t;
  const upperShelfBase = Math.max(base + d.height + 2 * t, nicheTop);
  const shoulder = Math.max(base + d.height + 2 * t + 120, nicheTop);
  const requiredMm = { width: Math.max(d.width + 2 * t + bay, data.minimumEnclosureMm?.width ?? 0), height: Math.max(base + d.height + 2 * t, options.shelf && detail.shelfLevel === 'above' ? upperShelfBase + detail.shelfThickness : 0, nicheTop, detail.profile === 'stepped' ? shoulder + 200 : 0, data.minimumEnclosureMm?.height ?? 0), depth: Math.max(d.depth + frontRecess + (data.tunnel ? 0 : t), data.minimumEnclosureMm?.depth ?? 0) };
  if (w < requiredMm.width) warnings.push('Omramningen är för smal för insatsen och valda skikten.');
  if (h < requiredMm.height) warnings.push('Omramningen är för låg för insatsen och sockeln.');
  if (depth < requiredMm.depth) warnings.push('Omramningen är för grund för insatsen.');
  const upperWidth = Math.max(400, w - 2 * detail.shoulderInset);
  if (detail.profile === 'stepped' && h < shoulder + 200) warnings.push(`Avtrappad form behöver minst ${shoulder + 200} mm höjd för en synlig överdel.`);
  if (wood !== 'none' && detail.woodHeight + 2 * t > h) warnings.push('Vedfacket är för högt för omramningen.');
  const rawAdd = (id: string, kind: BoxPart['kind'], width: number, height: number, zSize: number, x: number, y: number, z = 0) => {
    if ([width, height, zSize, x, y, z].every(Number.isFinite) && width > 0 && height > 0 && zSize > 0)
      parts.push({ id, kind, size: [width / 1000, height / 1000, zSize / 1000], position: [x / 1000, y / 1000, z / 1000] });
  };
  const add: typeof rawAdd = (id, kind, width, height, zSize, x, y, z = 0) => {
    if (detail.profile !== 'stepped' || kind !== 'shell' || id === 'shelf' || y + height / 2 <= shoulder) {
      rawAdd(id, kind, width, height, zSize, x, y, z); return;
    }
    const bottom = y - height / 2, top = y + height / 2;
    if (bottom < shoulder) rawAdd(id, kind, width, shoulder - bottom, zSize, x, (bottom + shoulder) / 2, z);
    const upperBottom = Math.max(shoulder, bottom);
    const left = Math.max(x - width / 2, -upperWidth / 2), right = Math.min(x + width / 2, upperWidth / 2);
    rawAdd(id + '-upper', kind, right - left, top - upperBottom, zSize, (left + right) / 2, (upperBottom + top) / 2, z);
  };
  const openingW = d.width + 2 * t;
  const openingH = d.height + 2 * t;
  const x = wood === 'left' ? -w / 2 + bay + openingW / 2 : wood === 'right' ? w / 2 - bay - openingW / 2 : 0;
  const left = w / 2 + x - openingW / 2;
  const right = w / 2 - x - openingW / 2;
  const openingY = base + openingH / 2;
  const glassSides = { left: glazing === 'left' || glazing === 'both', right: glazing === 'right' || glazing === 'both' };
  const glassHeight = d.height * 0.72;
  const glassBottom = openingY - glassHeight / 2;
  const glassTop = openingY + glassHeight / 2;
  // Cut a sightline through the side enclosure and lining to the glass.
  // Rear returns remain behind the appliance; these are visual parts, not structural specifications.
  const openSide = (id: string, kind: BoxPart['kind'], size: number, center: number, bottom: number, top: number) => {
    add(id + '-lower', kind, size, glassBottom - bottom, depth, center, (bottom + glassBottom) / 2);
    add(id + '-upper', kind, size, top - glassTop, depth, center, (top + glassTop) / 2);
    const rear = Math.max(0, depth - frontRecess - d.depth);
    add(id + '-rear', kind, size, glassHeight, rear, center, openingY, -depth / 2 + rear / 2);
  };
  const side = (id: string, size: number, center: number, hasBay: boolean) => {
    if (!hasBay) { add(id, 'shell', size, h, depth, center, h / 2); return; }
    // A separate side niche made of boxes; no boolean cuts.
    const wall = Math.min(t, size / 3);
    const nicheH = Math.min(detail.woodHeight, h - nicheBottom - wall);
    add(id + '-outer', 'shell', wall, h, depth, center + (id === 'left' ? -1 : 1) * (size - wall) / 2, h / 2);
    add(id + '-inner', 'shell', wall, h, depth, center + (id === 'left' ? 1 : -1) * (size - wall) / 2, h / 2);
    add(id + '-bottom', 'shell', size - 2 * wall, nicheBottom, depth, center, nicheBottom / 2);
    add(id + '-top', 'shell', size - 2 * wall, h - nicheH - nicheBottom, depth, center, (h + nicheH + nicheBottom) / 2);
    add(id + '-back', 'wood', size - 2 * wall, nicheH, wall, center, nicheBottom + nicheH / 2, -depth / 2 + wall / 2);
    for (let i = 1; i <= detail.woodDivisions; i++) {
      add(id + '-divider-' + i, 'shell', size - 2 * wall, 25, depth - wall, center, nicheBottom + nicheH * i / (detail.woodDivisions + 1), wall / 2);
    }
  };
  if (glassSides.left) openSide('left', 'shell', left, -w / 2 + left / 2, 0, h);
  else side('left', left, -w / 2 + left / 2, wood === 'left');
  if (glassSides.right) openSide('right', 'shell', right, w / 2 - right / 2, 0, h);
  else side('right', right, w / 2 - right / 2, wood === 'right');
  add('plinth', 'shell', openingW, base, depth, x, base / 2);
  add('top', 'shell', openingW, h - base - openingH, depth, x, (h + base + openingH) / 2);
  if (glassSides.left) openSide('board-left', 'board', t, x - (d.width + t) / 2, base, base + openingH);
  else add('board-left', 'board', t, openingH, depth, x - (d.width + t) / 2, openingY);
  if (glassSides.right) openSide('board-right', 'board', t, x + (d.width + t) / 2, base, base + openingH);
  else add('board-right', 'board', t, openingH, depth, x + (d.width + t) / 2, openingY);
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
  if (glassSides.left) add('glass-left', 'glass', 4, glassH, d.depth - 40, x - d.width / 2 - 3, glassY, bodyZ);
  if (glassSides.right) add('glass-right', 'glass', 4, glassH, d.depth - 40, x + d.width / 2 + 3, glassY, bodyZ);
  if (data.tunnel) add('glass-back', 'glass', d.width * 0.85, glassH, 4, x, glassY, front - d.depth - 3);
  if (data.builtInWoodCompartment) add('integrated-wood', 'wood', d.width * 0.85, woodH * 0.8, 5, x, base + t + woodH / 2, front + 3);
  if (options.shelf) {
    const leftExtension = detail.shelfSide !== 'right' ? detail.shelfExtension : 0;
    const rightExtension = detail.shelfSide !== 'left' ? detail.shelfExtension : 0;
    const shelfY = detail.shelfLevel === 'above' ? upperShelfBase + detail.shelfThickness / 2 : Math.max(detail.shelfThickness / 2, base - detail.shelfThickness / 2);
    if (detail.shelfLevel === 'above' && shelfY + detail.shelfThickness / 2 > h) warnings.push('Hyllan ovanför elden ryms inte inom omramningens höjd.');
    add('shelf', 'shell', w + leftExtension + rightExtension, detail.shelfThickness, depth + detail.shelfProjection, (rightExtension - leftExtension) / 2, shelfY, detail.shelfProjection / 2);
  }
  return { parts, warnings, missing: false, tooSmall: warnings.length > 0, requiredMm };
}
