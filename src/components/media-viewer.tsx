'use client';
import { useId, useState } from 'react';
import { Arrow } from './ui-icons';
import { getAsset } from '@/data/showroom';
import { ShowroomImage } from './showroom';
/** Images render now; future video/3D renderers belong here, not in route layouts. */
export default function MediaViewer({assetIds, scope='family'}:{assetIds:string[]; scope?:'family'|'execution'}) {
  const [selected, setSelected] = useState(assetIds[0]);
  const panelId = useId();
  const asset = getAsset(selected);
  return <div className="viewer">
    <div id={panelId} className="viewer-image"><ShowroomImage assetId={selected}/></div>
    {assetIds.length > 1 && <div className="viewer-controls gallery-controls" role="group" aria-label="Välj bildvy">{assetIds.map((id, index) => {
      const image = getAsset(id);
      return <button key={id} aria-pressed={selected === id} aria-controls={panelId} aria-label={`${image.viewLabel || (image.kind === 'render' ? 'I rummet' : 'Produktvy')} ${index + 1}`} onClick={() => setSelected(id)}><ShowroomImage assetId={id} sizes="80px"/><span>{image.viewLabel || (image.kind === 'render' ? 'I rummet' : 'Produktvy')}</span></button>;
    })}</div>}
    <p className="media-credit" aria-live="polite">{asset.kind === 'render' ? 'Miljövisualisering' : asset.kind === 'drawing' ? 'Måttunderlag' : 'Bild'} · Kratki Pro · {scope === 'execution' ? 'Material för det valda utförandet. Kulör kan avvika.' : 'Seriens inledande bildvy. Utforska utförandena längre ned.'}</p>
    {asset.kind === 'drawing' && asset.originalUrl && <a className="line-link" href={asset.originalUrl} target="_blank" rel="noreferrer">Öppna måttunderlaget i original <Arrow/></a>}
  </div>;
}
