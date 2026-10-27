export type DimensionsMm = { width: number; height: number; depth: number };
export type KariConstruction = {
  sideGlazing?: boolean;
  dimensionsMm: DimensionsMm | null;
  dimensionsStatus: 'verified' | 'unverified' | 'missing';
  sourceDimensions: string | null;
  conversion: 'assumed-cm-to-mm' | null;
  minimumEnclosureMm: DimensionsMm | null;
  fireboard: { thicknessMm: number; verified: boolean } | null;
  glbPath: string | null;
  builtInWoodCompartment: boolean;
  tunnel: boolean;
  /** Provisional body height above the integrated wood compartment, inferred
   * from the matching non-W model. Not a verified glass or installation size. */
  schematicFireboxHeightMm?: number;
};

// Explicit provisional conversion requested for the visual sketch ONLY.
// Original source does not state units. Do not use these as installation dimensions.
const entry = (sourceDimensions: string | null, dimensionsMm: DimensionsMm | null, wood = false, tunnel = false): KariConstruction => ({
  sourceDimensions, dimensionsMm, dimensionsStatus: dimensionsMm ? 'unverified' : 'missing',
  conversion: dimensionsMm ? 'assumed-cm-to-mm' : null,
  minimumEnclosureMm: null, fireboard: null, glbPath: null,
  builtInWoodCompartment: wood, tunnel,
});
export const kariConstruction: Record<string, KariConstruction> = {
  'variant-retailer-5080': entry('68 x 57.4 x 50', { width: 680, height: 574, depth: 500 }),
  'variant-retailer-5067': { ...entry('68 x 92.4 x 50', { width: 680, height: 924, depth: 500 }, true), schematicFireboxHeightMm: 574 },
  'variant-retailer-5047': entry('77 x 66.8 x 50', { width: 770, height: 668, depth: 500 }),
  'variant-retailer-5033': { ...entry('77 x 116.8 x 50', { width: 770, height: 1168, depth: 500 }, true), schematicFireboxHeightMm: 668 },
  'variant-retailer-5020': entry('95 x 67.3 x 50', { width: 950, height: 673, depth: 500 }),
  'variant-retailer-5006': { ...entry('95 x 117.3 x 50', { width: 950, height: 1173, depth: 500 }, true), schematicFireboxHeightMm: 673 },
  'variant-retailer-5189': entry('77 x 67.1 x 45.4', { width: 770, height: 671, depth: 454 }, false, true),
  'variant-retailer-5199': entry(null, null, true, true),
};
