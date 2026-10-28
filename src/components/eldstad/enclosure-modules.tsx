'use client';
import { useEffect, useState } from 'react';
import type { EnclosureConfig } from '@/lib/eldstad/configuration';
import { detailLimits, profileLabels, type DetailDimension } from '@/lib/eldstad/details';

export function MeasureControl({ id, label, value, min, max, onChange }: {id:string; label:string; value:number; min:number; max:number; onChange:(value:number)=>void}) {
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);
  const commit = () => {
    const parsed = text.trim() ? Number(text) : value;
    const next = Number.isFinite(parsed) ? Math.max(min, Math.min(max, Math.round(parsed))) : value;
    setText(String(next)); onChange(next);
  };
  return <div className="dimension-control"><label htmlFor={id}>{label}<span>mm</span></label><div>
    <input type="range" aria-label={label+' i mm'} min={min} max={max} step={1} value={value} onChange={e=>{setText(e.target.value);onChange(Number(e.target.value));}}/>
    <input id={id} type="number" min={min} max={max} step={1} inputMode="numeric" value={text} onChange={e=>{setText(e.target.value);const n=Number(e.target.value);if(e.target.value && Number.isInteger(n) && n>=min && n<=max)onChange(n);}} onBlur={commit} onKeyDown={e=>{if(e.key==='Enter')commit();}}/>
  </div></div>;
}
type Props = {config:EnclosureConfig; onChange:(patch:Partial<EnclosureConfig>)=>void};
const detailLabels: Record<DetailDimension,string> = {shoulderInset:'Indrag per sida',shelfExtension:'Utstick åt sidan',shelfProjection:'Djup framför omramningen',shelfThickness:'Hyllans tjocklek',woodWidth:'Öppningens bredd',woodHeight:'Öppningens höjd',woodDivisions:'Mellanplan'};
function DetailControl({name,config,onChange}:Props & {name:DetailDimension}) {
  return <MeasureControl id={'detail-'+name} label={detailLabels[name]} value={config[name]} {...detailLimits[name]} onChange={value=>onChange({[name]:value})}/>;
}
export function ProfileControls({config,onChange}:Props) {
  return <fieldset><legend>Omramningens form</legend><div className="profile-choices">{(['straight','stepped'] as const).map(profile=><button type="button" key={profile} aria-pressed={config.profile===profile} onClick={()=>onChange({profile})}>
    <svg viewBox="0 0 72 80" aria-hidden="true"><path d={profile==='straight'?'M14 72V8H58V72Z':'M10 72V39H22V8H50V39H62V72Z'}/><path d="M24 63V47H48V63Z"/></svg><strong>{profileLabels[profile]}</strong><span>{profile==='straight'?'En sammanhållen volym':'Smalare överdel'}</span>
  </button>)}</div>{config.profile==='stepped'&&<DetailControl name="shoulderInset" config={config} onChange={onChange}/>}<p className="control-help module-help">Alla mått kan ändras. Insatsen behåller sina proportioner.</p></fieldset>;
}
export function ShelfControls({config,onChange}:Props) {
  return <fieldset><legend>Hylla / bänk</legend><div className="editor-choices">{[false,true].map(shelf=><button type="button" key={String(shelf)} aria-pressed={config.shelf===shelf} onClick={()=>onChange({shelf})}>{shelf?'Lägg till':'Ingen'}</button>)}</div>{config.shelf&&<div className="module-options">
    <p className="control-label">Placering</p><div className="editor-choices">{(['below','above'] as const).map(shelfLevel=><button type="button" key={shelfLevel} aria-pressed={config.shelfLevel===shelfLevel} onClick={()=>onChange({shelfLevel})}>{shelfLevel==='below'?'Under elden':'Över elden'}</button>)}</div>
    <p className="control-label">Förlängning</p><div className="editor-choices">{(['left','both','right'] as const).map(shelfSide=><button type="button" key={shelfSide} aria-pressed={config.shelfSide===shelfSide} onClick={()=>onChange({shelfSide})}>{{left:'Vänster',both:'Båda håll',right:'Höger'}[shelfSide]}</button>)}</div>
    {(['shelfExtension','shelfProjection','shelfThickness'] as const).map(name=><DetailControl key={name} name={name} config={config} onChange={onChange}/>)}
  </div>}</fieldset>;
}
export function WoodControls({config,onChange,builtIn}:Props & {builtIn:boolean}) {
  return <fieldset><legend>Vedfack</legend>{builtIn?<p className="control-help">Insatsen har ett inbyggt vedfack.</p>:<>
    <div className="editor-choices">{(['none','left','right'] as const).map(wood=><button type="button" key={wood} disabled={wood!=='none'&&(config.glazing==='both'||config.glazing===wood)} aria-pressed={config.wood===wood} onClick={()=>onChange({wood})}>{{none:'Inget',left:'Vänster',right:'Höger'}[wood]}</button>)}</div>
    <p className="control-help module-help">Vedfack placeras på en täckt sida. Sidoglas på samma sida tar bort vedfacket.</p>
    {config.wood!=='none'&&<div className="module-options">{(['woodWidth','woodHeight'] as const).map(name=><DetailControl key={name} name={name} config={config} onChange={onChange}/>)}<p className="control-label">Indelning</p><div className="editor-choices">{[0,1,2,3].map(woodDivisions=><button type="button" key={woodDivisions} aria-pressed={config.woodDivisions===woodDivisions} onClick={()=>onChange({woodDivisions})}>{woodDivisions+1} fack</button>)}</div></div>}
  </>}</fieldset>;
}
