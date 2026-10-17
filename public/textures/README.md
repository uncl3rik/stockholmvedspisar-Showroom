# PBR-ytskikt

Lägg sömlösa CC0-texturer från https://ambientcg.com/ i rätt mapp:
puts/, mikrocement/, kakel/, natursten/ eller stal/.
Kontrollera licens och spara källans URL och material-ID i mappen.
Licensinformation: https://docs.ambientcg.com/license/

Förväntade filnamn (JPEG, rekommenderat 1K för mobil):
- map.jpg: Color/Albedo, utan inbakad belysning. Läses som sRGB.
- normalMap.jpg: NormalGL (OpenGL, inte DirectX). Ingen färgrymdskonvertering.
- roughnessMap.jpg: Roughness, ingen färgrymdskonvertering. Inte Glossiness.
- surface.json: fysisk storlek för HELA bilden, i meter, exempel:

```json
{ "meters": [1.2, 1.2] }
```

Exemplet passar en bild med fyra 30 cm-plattor per sida. Ange verklig
materialstorlek från källan; anta inte att en bild motsvarar en enda platta.
Texturernas repeat beräknas separat för boxens sex ytor: bredd/höjd,
djup/höjd och bredd/djup. Därmed behålls plattstorleken när måtten ändras.
Färgvalet i guiden tonar albedot, så neutrala material fungerar bäst.

Saknas eller är surface.json ogiltig används enfärgat material utan att
skalan gissas. Saknade enskilda kartor använder materialets basvärde.
Ingen textur hämtas från extern tjänst vid användning av sidan.
Inga texturbilder ingår ännu; lägg in filerna och ladda om för att aktivera.

Three.js färghantering: https://threejs.org/manual/pages/color-management.html
