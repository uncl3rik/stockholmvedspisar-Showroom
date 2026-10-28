import type { DesignPreferences, DesignQuery } from './fireplace-design';

// Versioned compact tuple. No personal details; values are validated by resolveDesign.
const keys = ['modell','variant','dim','mat','kul','hy','ved','form','anslutning','kvm','placering','konfiguration','glas','profil','hyllm','vedm'] as const;
export function encodeDraft(model: string, variant: string, preferences: DesignPreferences): string {
  const query = { modell: model, variant, ...preferences };
  return JSON.stringify([1, ...keys.map(key => query[key] ?? '')]);
}
export function decodeDraft(value: unknown): DesignQuery | null {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const tuple: unknown = JSON.parse(value);
    if (!Array.isArray(tuple) || ![13,14,17].includes(tuple.length) || tuple[0] !== 1 || !tuple.slice(1).every(v => typeof v === 'string' && v.length <= 128)) return null;
    return Object.fromEntries(keys.slice(0, tuple.length - 1).map((key, index) => [key, tuple[index + 1]]));
  } catch { return null; }
}
export function draftContactHref(model: string, variant: string, preferences: DesignPreferences) {
  const query = new URLSearchParams({ modell: model, variant, utkast: encodeDraft(model, variant, preferences) });
  if (preferences.konfiguration) query.set('konfiguration', preferences.konfiguration);
  return '/kontakt?' + query;
}
