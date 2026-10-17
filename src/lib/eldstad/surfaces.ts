import type { BoxPart } from './geometry';

/** Split shell boxes at world X=0 so exactly one half can fade, without CSG. */
export function splitShell(part: BoxPart): BoxPart[] {
  if (part.kind !== 'shell') return [part];
  const left = part.position[0] - part.size[0] / 2;
  const right = part.position[0] + part.size[0] / 2;
  if (left >= 0 || right <= 0) return [part];
  return [
    { ...part, id: part.id + '-cut-left', size: [-left, part.size[1], part.size[2]], position: [left / 2, part.position[1], part.position[2]] },
    { ...part, id: part.id + '-cut-right', size: [right, part.size[1], part.size[2]], position: [right / 2, part.position[1], part.position[2]] },
  ];
}
/** BoxGeometry face order: +/-X, +/-Y, +/-Z. Metres per face, no stretching. */
export function faceRepeats(size: [number, number, number], meters: [number, number]): [number, number][] {
  const [w, h, d] = size;
  return [[d,h],[d,h],[w,d],[w,d],[w,h],[w,h]].map(([u,v]) => [u / meters[0], v / meters[1]]);
}

/** Hollow schematic appliance: the fire can sit behind its transparent glass. */
export function hollowInsert(body: BoxPart, glass: BoxPart, tunnel: boolean): BoxPart[] {
  const [w, h, d] = body.size;
  const [x, y, z] = body.position;
  const side = (w - glass.size[0]) / 2;
  const bottom = glass.position[1] - glass.size[1] / 2 - (y - h / 2);
  const top = y + h / 2 - (glass.position[1] + glass.size[1] / 2);
  const box = (id: string, size: BoxPart['size'], position: BoxPart['position']): BoxPart => ({ id, kind: 'insert', size, position });
  return [
    box('insert-left', [side,h,d], [x-(w-side)/2,y,z]),
    box('insert-right', [side,h,d], [x+(w-side)/2,y,z]),
    box('insert-bottom', [glass.size[0],bottom,d], [x,y-h/2+bottom/2,z]),
    box('insert-top', [glass.size[0],top,d], [x,y+h/2-top/2,z]),
    ...(!tunnel ? [box('insert-back', [w,h,0.02], [x,y,z-d/2+0.01])] : []),
  ].filter(part => part.size.every(n => n > 0));
}
