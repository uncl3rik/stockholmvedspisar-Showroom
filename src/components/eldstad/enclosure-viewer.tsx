'use client';
import dynamic from 'next/dynamic';
import { Component, useState, type ReactNode } from 'react';
import type { SceneOptions, CameraView, RoomPreview } from './enclosure-scene';
import type { KariConstruction } from '@/data/kari-construction';
import type { EnclosureConfig } from '@/lib/eldstad/configuration';

const Scene = dynamic(() => import('./enclosure-scene'), { ssr: false, loading: () => <div className="scene-loading" role="status"><span className="eyebrow">02 / VISUALISERING</span><p>Laddar 3D-vyn…</p></div> });
class SceneBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <div className="scene-loading" role="status">3D-vyn kunde inte startas. Dina val går fortfarande att ändra och sparas i länken.</div> : this.props.children; }
}
export default function EnclosureViewer({ data, config, room }: { data: KariConstruction; config: EnclosureConfig | null; room?: RoomPreview }) {
  const [options, setOptions] = useState<SceneOptions>({ boards: false, fire: false, camera: 'angle', cameraRevision: 0 });
  return <><div className="enclosure-viewport" aria-label="Interaktiv skiss av eldstaden">
    {config ? <SceneBoundary><Scene data={data} config={config} options={options} room={room}/></SceneBoundary> : <div className="scene-loading" role="status"><span className="eyebrow">INSATS / PRODUKTUNDERLAG</span><p>Mått under verifiering</p><span>3D-vyn öppnas när mått finns för denna variant.</span></div>}
    {config && <p className="scene-instructions">Dra för att rotera · nyp eller scrolla för att zooma</p>}
  </div>{config && <div className="scene-toolbar" aria-label="Visningsval">
    <div className="editor-choices"><button type="button" aria-pressed={options.boards} onClick={() => setOptions(old => ({...old, boards: !old.boards}))}>Visa brandskivor</button><button type="button" aria-pressed={options.fire} onClick={() => setOptions(old => ({...old, fire: !old.fire}))}>{options.fire ? 'Släck brasan' : 'Tänd brasan'}</button></div>
    <div className="editor-choices" aria-label="Kameravinkel">{(['front','angle','close'] as CameraView[]).map(camera => <button type="button" key={camera} onClick={() => setOptions(old => ({...old, camera, cameraRevision: old.cameraRevision + 1}))}>{{front:'Framifrån',angle:'Snett',close:'Närbild'}[camera]}</button>)}</div>
  </div>}</>;
}
