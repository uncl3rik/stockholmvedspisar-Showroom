import type { Placement } from '../fireplace-design';

export function roomLayout(area: number | null, placement: Placement | undefined, widthMm: number, depthMm: number) {
  // Square plan is an illustration: area alone does not define real room geometry.
  const side = Math.sqrt(area ?? 25);
  const extent = Math.max(widthMm, depthMm) / 2000;
  const rear = -depthMm / 2000 - 0.15;
  return { side, rear: placement === 'mitt' ? -side / 2 : placement === 'horn' ? -extent - 0.2 : rear,
    left: placement === 'horn' ? -extent - 0.2 : -side / 2,
    rotation: placement === 'horn' ? Math.PI / 4 : 0,
    illustrationTooSmall: side < Math.max(widthMm, depthMm) / 1000 + 0.4 };
}
export function powerGuidance(area: number | null, source: string | undefined) {
  const match = source?.trim().match(/^(\d+(?:[.,]\d+)?)\s*kW$/i);
  if (!match) return 'Effektuppgiften saknas eller är inte entydig. Rummets värmebehov behöver bedömas innan en insats väljs.';
  const power = Number(match[1].replace(',', '.'));
  if (!area || !power) return `Källan anger ${source}. Ange rumsyta för en vägledande jämförelse.`;
  const density = power * 1000 / area;
  // Qualitative comparison only; no claimed universal W/m² requirement or approval.
  const observation = density > 100 ? 'Det är mycket effekt i förhållande till enbart den angivna rumsytan. Kontrollera risken för övervärme och insatsens lägsta effekt.' : density < 30 ? 'Effekten är låg i förhållande till den angivna rumsytan. Kontrollera om eldstaden ska vara komplement eller huvudsaklig värmekälla.' : 'Rumsytan ensam räcker inte för att avgöra om effekten passar.';
  return `${source} på ${area.toLocaleString('sv-SE')} m² motsvarar cirka ${Math.round(density)} W/m². ${observation} Detta är en grov jämförelse, inte dimensionering. Isolering, takhöjd, ventilation och öppningar till andra rum påverkar behovet.`;
}
