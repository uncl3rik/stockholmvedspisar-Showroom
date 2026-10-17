# Fireplace design flow

## Current storefront

The public catalogue is restricted by src/data/insert-catalog.ts to KARI and its eight source executions, as requested by the project owner. This is a design-sketch allowlist, not evidence of manufacturer approval for any enclosure or flue connection. Other retained product records and original media remain in the source catalogue for provenance; they are not listed, generated as product pages, or included in the sitemap. Direct links to excluded stove products return not-found. The old showroom URLs redirect to /designa.

## Three independent layers

1. Insert: a validated model ID plus an exact product variant ID.
2. Enclosure: selected square/rectangular shape and desired top/rear flue connection; future construction system ID, finish ID and explicit dimensions in millimetres.
3. Room: saved area in square metres; future room asset ID and a position in millimetres with rotation in degrees.

The versioned FireplaceDesign contract lives in src/lib/fireplace-design.ts. The insert and its enclosure are separate entities; a finish must never be treated as a manufacturer variant. Null fields mean undecided, not defaults.

The /designa sketch stores the exact KARI variant, step, enclosure shape, requested flue connection and saved room area in the URL. Reload, browser back/forward and copying the address preserve those values. No account, server project storage or localStorage is involved. Invalid, mismatched or non-allowlisted selections return to step 1. Steps 2 and 3 collect preferences only; entering them does not complete or validate an enclosure. Room area accepts decimal comma or point with up to two decimals, greater than zero and at most 10,000 m² (input bound, not appliance suitability). Click Save to persist room area; clearing and saving removes it. Shapes are schematic symbols rather than a measured enclosure. There is no checkout or price calculation.

## Next implementation boundary

Introduce a versioned, explicit eligibility matrix for construction systems, exact appliance variants and finishes before making those choices selectable. Obtain manufacturer clearances, ventilation requirements, support requirements and exact geometry; do not derive these from product dimensions or photographs. Keep installation validation separate from visual design.

A future renderer receives FireplaceDesign and asset references. Start with an accessible 2D preview and add an on-demand GLB renderer when exact geometry is available. Editing an insert must invalidate or revalidate dependent enclosure/placement choices. Store the full versioned document in a persistence layer only once those editors are implemented; support migration and validation when loading saved projects.

## Checks

node --experimental-strip-types --test scripts/fireplace-design.test.mjs

The tests cover invalid and cross-model IDs, excluded models, missing selections, URL round trips and preference round trips and malformed room areas. Existing content checks validate the full retained source catalogue rather than the public subset.
