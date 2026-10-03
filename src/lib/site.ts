/** This showroom is the Stockholm Vedspisar .se project. */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || 'https://stockholmvedspisar.se',
).origin;
