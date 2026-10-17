'use client';
import { useEffect, useState } from 'react';
import { NoColorSpace, RepeatWrapping, SRGBColorSpace, Texture, TextureLoader } from 'three';
import type { EnclosureConfig } from '@/lib/eldstad/configuration';

export type SurfaceTextures = { map?: Texture; normalMap?: Texture; roughnessMap?: Texture; meters: [number, number] };
// Physical size describes the entire seamless image, not one tile within it.
export function useSurfaceTextures(finish: EnclosureConfig['finish']) {
  const [loaded, setLoaded] = useState<{ finish: string; textures: SurfaceTextures } | null>(null);
  useEffect(() => {
    let cancelled = false;
    const owned: Texture[] = [];
    const abort = new AbortController();
    async function load() {
      try {
        const root = `/textures/${finish}`;
        const response = await fetch(`${root}/surface.json`, { signal: abort.signal });
        if (!response.ok) return;
        const metadata: unknown = await response.json();
        if (!metadata || typeof metadata !== 'object' || !('meters' in metadata)) return;
        const meters = metadata.meters;
        if (!Array.isArray(meters) || meters.length !== 2 || !meters.every(n => typeof n === 'number' && Number.isFinite(n) && n > 0)) return;
        const result: SurfaceTextures = { meters: [meters[0], meters[1]] };
        await Promise.all((['map', 'normalMap', 'roughnessMap'] as const).map(async key => {
          try {
            const texture = await new TextureLoader().loadAsync(`${root}/${key}.jpg`);
            if (cancelled) { texture.dispose(); return; }
            owned.push(texture);
            texture.colorSpace = key === 'map' ? SRGBColorSpace : NoColorSpace;
            texture.wrapS = texture.wrapT = RepeatWrapping;
            texture.anisotropy = 4;
            result[key] = texture;
          } catch { /* A missing individual map uses the material's base value. */ }
        }));
        if (!cancelled) setLoaded({ finish, textures: result });
      } catch { /* Missing metadata: keep the solid fallback rather than guess scale. */ }
    }
    void load();
    return () => { cancelled = true; abort.abort(); owned.forEach(texture => texture.dispose()); };
  }, [finish]);
  return loaded?.finish === finish ? loaded.textures : null;
}
