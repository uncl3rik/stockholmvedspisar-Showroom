import { insertModels, insertVariants } from '@/data/insert-catalog';
import { designHref, designPreferences, resolveDesign, placementLabels, connectionLabels } from './fireplace-design';
import { readEnclosure, enclosureSummary, visualPreferences } from './eldstad/configuration';
export const draftStorageKey = 'stockholmvedspisar.drafts.v1';
export type SavedDraft = { href: string; title: string; summary: string; savedAt: string };
export function draftFromHref(href: unknown, savedAt = new Date().toISOString()): SavedDraft | null {
  if (typeof href !== 'string' || href.length > 4096 || !href.startsWith('/designa?')) return null;
  const url = new URL(href, 'https://draft.invalid');
  if (url.pathname !== '/designa' || url.origin !== 'https://draft.invalid') return null;
  const { design } = resolveDesign(Object.fromEntries(url.searchParams), insertModels, insertVariants);
  const model = insertModels.find(m => m.id === design.insert?.modelId);
  const variant = insertVariants.find(v => v.id === design.insert?.variantId);
  if (!model || !variant) return null;
  const prefs = designPreferences(design);
  const config = readEnclosure(variant.construction, prefs);
  const normalized = {...prefs,...(config ? visualPreferences(config) : {})};
  const summary = [variant.name, 'Omramning: '+(config ? enclosureSummary(config) : 'Mått under verifiering'), 'Placering: '+(prefs.placering ? placementLabels[prefs.placering] : 'Inte vald'), 'Rumsyta: '+(prefs.kvm ? prefs.kvm+' m²' : 'Inte angiven'), 'Skorstensanslutning: '+(prefs.anslutning ? connectionLabels[prefs.anslutning] : 'Inte vald'), ...(prefs.konfiguration ? ['Produktutförande: '+prefs.konfiguration] : [])].join('\n');
  return {href:designHref('rum',model.slug,variant.id,normalized),title:variant.name,summary,savedAt};
}
export function parseSavedDrafts(raw: string | null): SavedDraft[] {
  if (!raw || raw.length > 100000) return [];
  try {
    const values: unknown = JSON.parse(raw);
    if (!Array.isArray(values)) return [];
    return values.slice(0,10).flatMap(value => {
      if (!value || typeof value !== 'object' || !('href' in value) || !('savedAt' in value) || typeof value.savedAt !== 'string' || !Number.isFinite(Date.parse(value.savedAt))) return [];
      const record=draftFromHref(value.href,value.savedAt);
      return record ? [record] : [];
    });
  } catch { return []; }
}
export function upsertDraft(existing: SavedDraft[], draft: SavedDraft) {
  return [draft,...existing.filter(item => item.href !== draft.href)].slice(0,10);
}
