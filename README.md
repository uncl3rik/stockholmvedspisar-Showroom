# Stockholm Vedspisar .se — Kratki Pro showroom

The new stockholmvedspisar.se project, built with Next.js App Router, TypeScript, React and Tailwind CSS. The existing published stockholmvedspisar.shop site remains separate and unchanged. No redirect from .shop is planned.

The workspace directory still carries its original `.shop` name. Production domain identity is configured in `src/lib/site.ts` and `.env.example`; this change does not publish the site or change DNS. Contact remains demonstration-only.

## Run

```sh
pnpm install
pnpm dev
```

The preview is served at http://127.0.0.1:3000.

```sh
pnpm lint
pnpm typecheck
pnpm build
```

## Content and architecture

`src/data/showroom.ts` combines twelve retailer model families (28 executions, 72 registered material configurations) with five manufacturer insert families, four design settings, four showroom scenes, and a media library. IDs remain stable independently of slugs. Specs have a source URL and retrieval date. Missing SKUs and units remain unknown and are exposed under “Uppgifter att komplettera”. Family-level media never implies an exact variant match.

Routes: `/showroom`, `/showroom/[slug]`, `/kollektion`, `/kollektion/[slug]`, `/om-kratki-pro`, `/kontakt`. Previous generic-store routes redirect to the new showroom. Legacy concept products and other manufacturers are no longer in the rendered experience.

`src/components/media-viewer.tsx` owns media switching. Route layouts consume asset IDs and do not depend on a renderer. When actual 3D assets arrive, add a lazily loaded renderer at this boundary. `Model3DAsset` defines GLB, exact variant association, meters, Y-up, a version, poster and material slot names. No 3D engine or fake 3D button is included now.

`src/app/globals.css` defines design tokens and layouts. Keep typography, surfaces, spacing, focus treatment and mobile behavior consistent; allow scenes to have individual compositions. Replace the data module with a CMS repository later without coupling CMS objects to page layout.

## Demo contact flow

The contact route always renders with `configured={false}`, even if webhook variables exist. It validates inputs locally and demonstrates a confirmation without uploading or sending data. Model, variant and scene context is carried in verified URL parameters. No delivery API is exposed. Before activating real enquiries, implement the chosen provider, abuse protection and a production privacy policy.

## Content provenance

Local optimized WebP assets were retrieved from `https://pro.kratki.com/en/products/`. The user confirmed permission to use Kratki material on 2026-10-02. The retailer catalog contains 344 optimized image files; provenance and original URLs are preserved. All visuals distinguish family-level renderings from exact variant technical data. No manufacturer warranty, retailer authorization or installation compliance is asserted.

Technical data references are recorded per variant. Dimensions are device dimensions, not installation clearances. Materials described in scenes are editorial interpretation, not certified construction specifications.

## Design rails for future work

- Scenes, design settings, exact variants and media remain distinct records.
- Every media asset has a source, credit, kind and model association.
- Variant-specific images and 3D must reference the exact variant ID.
- Display images as the immediate, accessible fallback; load interactive 3D only on demand.
- Keep selection and presentation independent of quote delivery and future saved-project storage.
- Do not add purchase/cart flows; the primary journey is scene → model → advice.
- Preserve keyboard operation, visible focus, reduced motion and responsive layouts.

## GitHub and Vercel

Repository: https://github.com/uncl3rik/stockholmvedspisar-Showroom

Import this repository as a new Vercel project using the Next.js framework preset, repository root directory, and the default install/build settings. The build script also validates the product catalog. Set `NEXT_PUBLIC_SITE_URL=https://stockholmvedspisar.se` for the production environment. Verify the generated Vercel deployment before connecting `stockholmvedspisar.se` and its `www` subdomain in Vercel's domain settings.

The existing `.shop` website uses a separate repository and deployment. This project's local folder name does not determine its public domain. The contact form remains a demo and does not deliver enquiries.

## Retailer catalog import

Run `node scripts/import-kratki-pro.mjs` with `NODE_USE_SYSTEM_CA=1` on this Windows machine to refresh the public catalog. This does not run during build or page rendering. The importer follows product URLs in the specified brand category, fetches WooCommerce Store API data and published variation records, checks coverage, and stores optimized WebP files locally. It never creates a SKU, dimension unit or configuration that the source does not expose.

- `src/data/kratki-pro/catalog.json`: source product IDs, exact execution names, attributes, registered configurations, gallery mappings and distributor links.
- `src/data/kratki-pro/families.ts`: editorial series grouping and copy.
- `src/data/kratki-pro/collection.ts`: adapter to showroom entities.
- `src/components/variant-explorer.tsx`: execution and actual material configuration selection.

The 28 imported executions cover SVEN; REN S/M/L; ERIK, Keramik, Hel Keramik, W and Pelare; BJORN/W and BJORN; KARI 70/70W/80/80W/95/95W/80 Tunnel/80W Tunnel; AB ENYO R/RW; HATI; INGA; SKADI; TOFA; RUNA; KOZA K11 and Trä. Retailer copy has inconsistencies (especially plain ERIK/keramic descriptions and installation terminology for KARI); original marketing text is not reproduced. Family copy is editorial. Numerical facts are preserved as reported, with missing units flagged instead of inferred. No 3D files or PDF downloads were exposed by the retailer pages; drawing images and product-underlay links are available when supplied. Future 3D must attach to a stable execution ID and, where relevant, a configuration ID.

REN’s corner glazing and KARI’s flexible freestanding use were cross-checked against https://pro.kratki.com/en/products/ on 2026-10-02.

## Ember visual direction

Warm charcoal surfaces, ivory text and copper accents form the showroom palette. `FireMark` is decorative inline SVG with slow CSS flame and glow animation. It adds no JavaScript loop, canvas, external media or animation dependency. `prefers-reduced-motion` produces a still flame. Mobile browser chrome and native controls use the dark color scheme; original product images retain a light studio surface.
