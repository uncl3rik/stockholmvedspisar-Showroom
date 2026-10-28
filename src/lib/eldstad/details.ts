/** Independent visual modules, in millimetres. Future trims can add their own module. */
export const profileLabels = { straight: 'Rak', stepped: 'Avtrappad' } as const;
export const detailLimits = {
  shoulderInset: { min: 50, max: 300 },
  shelfExtension: { min: 0, max: 600 },
  shelfProjection: { min: 40, max: 300 },
  shelfThickness: { min: 30, max: 100 },
  woodWidth: { min: 180, max: 600 },
  woodHeight: { min: 300, max: 1200 },
  woodDivisions: { min: 0, max: 3 },
} as const;
export type DetailDimension = keyof typeof detailLimits;
export type DetailSettings = Record<DetailDimension, number> & {
  profile: keyof typeof profileLabels;
  shelfLevel: 'below' | 'above';
  shelfSide: 'both' | 'left' | 'right';
};
export const detailDefaults: DetailSettings = {
  profile: 'straight', shoulderInset: 160,
  shelfLevel: 'below', shelfSide: 'both', shelfExtension: 100, shelfProjection: 140, shelfThickness: 50,
  woodWidth: 280, woodHeight: 650, woodDivisions: 0,
};
export function clampDetail(value: number, key: DetailDimension) {
  const { min, max } = detailLimits[key];
  return Number.isFinite(value) ? Math.max(min, Math.min(max, Math.round(value))) : detailDefaults[key];
}
export function normalizeDetails(input: Partial<DetailSettings>): DetailSettings {
  const result = { ...detailDefaults };
  for (const key of Object.keys(detailLimits) as DetailDimension[]) result[key] = clampDetail(input[key] ?? result[key], key);
  if (input.profile === 'stepped') result.profile = 'stepped';
  if (input.shelfLevel === 'above') result.shelfLevel = 'above';
  if (input.shelfSide === 'left' || input.shelfSide === 'right') result.shelfSide = input.shelfSide;
  return result;
}
export type DetailPreferences = { profil?: string; hyllm?: string; vedm?: string };
export function readDetails(query: DetailPreferences): DetailSettings {
  const input: Partial<DetailSettings> = {};
  const profile = /^(straight|stepped)\.(\d{1,5})$/.exec(query.profil ?? '');
  if (profile) { input.profile = profile[1] as DetailSettings['profile']; input.shoulderInset = Number(profile[2]); }
  const shelf = /^(below|above)\.(both|left|right)\.(\d{1,5})\.(\d{1,5})\.(\d{1,5})$/.exec(query.hyllm ?? '');
  if (shelf) {
    input.shelfLevel = shelf[1] as DetailSettings['shelfLevel']; input.shelfSide = shelf[2] as DetailSettings['shelfSide'];
    input.shelfExtension = Number(shelf[3]); input.shelfProjection = Number(shelf[4]); input.shelfThickness = Number(shelf[5]);
  }
  const wood = /^(\d{1,5})\.(\d{1,5})\.(\d{1,5})$/.exec(query.vedm ?? '');
  if (wood) { input.woodWidth = Number(wood[1]); input.woodHeight = Number(wood[2]); input.woodDivisions = Number(wood[3]); }
  return normalizeDetails(input);
}
export function detailPreferences(input: Partial<DetailSettings>): DetailPreferences {
  const d = normalizeDetails(input);
  return { profil: `${d.profile}.${d.shoulderInset}`, hyllm: `${d.shelfLevel}.${d.shelfSide}.${d.shelfExtension}.${d.shelfProjection}.${d.shelfThickness}`, vedm: `${d.woodWidth}.${d.woodHeight}.${d.woodDivisions}` };
}
