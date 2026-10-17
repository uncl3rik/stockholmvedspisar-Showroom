# KARI-modeller

Exportera varje verifierad variant som glTF Binary (.glb) från Blender.
- Arbeta i meter (Metric, Unit Scale 1), applicera rotation och skala.
- Exportera med +Y Up; framsidan ska peka mot +Z efter export.
- Endast själva insatsen, inga kameror, lampor, golv eller omramning.
- Modellen centreras efter sin bounding box och placeras vid insatsens centrum.
  Den skalas INTE automatiskt: kontrollera verkliga mått före export.
- Använd transparent glas och en öppen brännkammare så att eldplanet syns.
- Sikta på högst cirka 2 MB per fil och 1K-texturer för mobilen.

Komprimera med glTF Transform och Draco:

```sh
npx --package @gltf-transform/cli gltf-transform optimize kari-70-original.glb kari-70.glb --compress draco --texture-compress webp
```

Dokumentation: https://gltf-transform.dev/cli
Lägg resultatet här och sätt glbPath: '/models/kari-70.glb' för rätt variant i
src/data/kari-construction.ts. Behåll null tills filen är färdig.
useGLTF använder Dreis Draco-decoder (hämtas från Googles versionerade CDN
när modellen kräver Draco). Om offline/CSP krävs, lägg decoder-filer lokalt
och ange lokal decoder-sökväg i useGLTF.

Modellen laddas med Suspense; boxmodellen visas under laddning, vid saknad
sökväg eller vid inläsningsfel. Cachad GLB återanvänds; den muteras inte.
Eldens läge är tills vidare schematiskt utifrån variantens glasöppning;
kontrollera detta mot varje riktig modell innan publicering.
Inga GLB-filer ingår ännu.
