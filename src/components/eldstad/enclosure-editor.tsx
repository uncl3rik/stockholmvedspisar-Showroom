'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { KariConstruction } from '@/data/kari-construction';
import { designHref, designSteps, parseArea, placementLabels, connectionLabels, visualizationNotice, type Placement, type FlueConnection, type DesignPreferences } from '@/lib/fireplace-design';
import { draftContactHref } from '@/lib/design-draft';
import { powerGuidance } from '@/lib/eldstad/room';
import DraftLink from './draft-link';
import { ShowroomImage } from '../showroom';
import { calculateGeometry, dimensionLimits, type EnclosureDimensions } from '@/lib/eldstad/geometry';
import { colors, finishes, enclosureSummary, readEnclosure, updateEnclosure, visualPreferences, type EnclosureConfig } from '@/lib/eldstad/configuration';
import { Arrow } from '../ui-icons';
import EnclosureViewer from './enclosure-viewer';
import { MeasureControl, ProfileControls, ShelfControls, WoodControls } from './enclosure-modules';

const dimensionLabels: Record<keyof EnclosureDimensions, string> = { width: 'Bredd', height: 'Höjd', depth: 'Djup', plinth: 'Sockelhöjd' };

export default function EnclosureEditor({ modelSlug, variantId, variantName, data, initialPreferences, step = 'utforande', power, referenceAssetId }: {modelSlug: string; variantId: string; variantName: string; data: KariConstruction; initialPreferences: DesignPreferences; step?: 'utforande' | 'rum'; power?: string; referenceAssetId: string}) {
  const [config, setConfig] = useState(() => readEnclosure(data, initialPreferences));
  const [connection, setConnection] = useState(initialPreferences.anslutning);
  const [placement, setPlacement] = useState(initialPreferences.placering);
  const [areaText, setAreaText] = useState(initialPreferences.kvm ?? '');
  const area = parseArea(areaText);
  const areaInvalid = Boolean(areaText.trim()) && area === null;
  const roomStep = step === 'rum';
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const preferences = useMemo(() => ({ ...initialPreferences, ...(config ? visualPreferences(config) : {}), anslutning: connection, placering: placement, kvm: area?.toString() }), [initialPreferences, config, connection, placement, area]);
  const currentHref = designHref(step, modelSlug, variantId, preferences);
  useEffect(() => {
    timer.current = setTimeout(() => { window.history.replaceState(null, '', currentHref); timer.current = null; }, 300);
    return () => { if(timer.current) clearTimeout(timer.current); };
  }, [currentHref]);
  const [adjustment, setAdjustment] = useState('');
  const update = (patch: Partial<EnclosureConfig>) => {
    if (!config) return;
    const {config:next,adjusted} = updateEnclosure(data,config,patch);
    if (!next) return;
    setAdjustment(adjusted.length ? 'För att ge plats har vi anpassat '+adjusted.map(key=>dimensionLabels[key].toLowerCase()+' till '+next[key]+' mm').join(', ')+'.' : '');
    setConfig(next);
  };
  const geometry = config ? calculateGeometry(data, config) : null;
  const link = (step: 'insats' | 'utforande' | 'rum') => designHref(step, modelSlug, variantId, preferences);
  return <div className="design-page shell enclosure-page" onClickCapture={e => { if(e.target instanceof Element && e.target.closest('a') && timer.current) clearTimeout(timer.current); }}>
    <header className="design-heading"><p className="eyebrow">DIN ELDSTAD / STEG {roomStep ? '03' : '02'}</p><h1>{roomStep ? 'Eldstaden i rummet.' : 'Formen runt elden.'}</h1><p className="control-help">Endast för inspiration – inte ett bygg- eller installationsunderlag.</p></header>
    <nav className="design-steps" aria-label="Designsteg">{designSteps.map((item,i) => <Link key={item.id} href={link(item.id)} aria-current={item.id === step ? 'step' : undefined}><span>0{i+1}</span>{item.label}</Link>)}</nav>
    <div className="enclosure-layout"><div className="enclosure-stage"><EnclosureViewer data={data} config={config} room={roomStep ? { area, placement } : undefined}/>
      <div className="insert-reference"><ShowroomImage assetId={referenceAssetId} sizes="120px"/><div><p className="eyebrow">VALD INSATS / {data.glbPath ? '3D-MODELL' : 'SCHEMATISK 3D'}</p><strong>{variantName}</strong><p>{data.dimensionsMm ? `Insats B × H × D: ${data.dimensionsMm.width} × ${data.dimensionsMm.height} × ${data.dimensionsMm.depth} mm` : 'Insatsens mått saknas'}</p>{config && <p>Omramning: {config.width} × {config.height} × {config.depth} mm</p>}<p className="control-help">{data.dimensionsStatus === 'verified' ? 'Yttermått från tillverkaren.' : 'Insatsens mått är preliminära.'} Insatsen behåller sin storlek när du ändrar omramningen. Illustrationen visar proportionerna; glas, ram och detaljer är schematiska.</p></div></div>
      <p className="scene-caption-note">{visualizationNotice}</p>{roomStep && <p className="scene-caption-note">Rummet visas som en kvadratisk principskiss, utan verifierade säkerhetsavstånd. {area ? '' : 'Utan rumsyta visas ett exempel på 25 m².'} {placement ? '' : 'Välj placering för att spara den; förhandsvisningen utgår från mot vägg.'}</p>}</div>
      <div className="enclosure-sidebar"><section className="enclosure-panel" aria-label={roomStep ? 'Placera i rum' : 'Välj utförande'}><p className="eyebrow">{roomStep ? 'INSATS / I RUMMET' : 'INSATS / OM RAMEN'}</p>
        <details className="enclosure-notice"><summary>Om mått och konstruktion</summary><strong>{data.dimensionsMm ? data.dimensionsStatus === 'verified' ? 'Produktmått från tillverkaren' : 'Overifierade produktmått' : 'Mått under verifiering'}</strong><p>{data.dimensionsMm ? data.dimensionsStatus === 'verified' ? 'Produktens yttermått är hämtade från tillverkaren. Glas och detaljer är förenklade. Skikten visas som ' + (data.fireboard?.thicknessMm ?? 50) + ' mm. Skissen är inte en verifierad inbyggnadskonstruktion; ventilation och säkerhetsavstånd behöver kontrolleras.' : 'Källans mått har preliminärt räknats om från cm till mm. Inbyggnadskrav är inte verifierade. Brandskivor visas som 50 mm när verifierad uppgift saknas.' : 'Mått saknas för denna variant. Välj en annan insats för att prova 3D-skissen.'}</p></details>
        {geometry?.tooSmall && <div className="enclosure-error" role="alert"><strong>Omramningen är för liten</strong><ul>{geometry.warnings.map(w => <li key={w}>{w}</li>)}</ul></div>}
        {roomStep && <>
          <fieldset><legend>Placering</legend><div className="editor-choices">{(Object.keys(placementLabels) as Placement[]).map(value => <button key={value} type="button" aria-pressed={placement === value} onClick={() => setPlacement(value)}>{placementLabels[value]}</button>)}</div></fieldset>
          <fieldset><legend>Rumsyta</legend><div className="field"><label htmlFor="draft-room-area">Rummets yta i m²</label><input id="draft-room-area" type="text" inputMode="decimal" value={areaText} placeholder="Exempelvis 25" onChange={e => setAreaText(e.target.value)} aria-invalid={areaInvalid} aria-describedby="room-area-feedback"/></div><p id="room-area-feedback" className="control-help">{areaInvalid ? 'Ange 0,01–10 000 m² med högst två decimaler. Det ogiltiga värdet sparas inte.' : 'Rumsytan sparas automatiskt i utkastet.'}</p></fieldset>
          <div className="enclosure-notice room-guidance" role="status"><strong>Effekt och rumsyta</strong><p>{powerGuidance(area, power)}</p></div>
        </>}
        {!roomStep && config && <>
          <ProfileControls config={config} onChange={update}/>
          <p className="editor-live-note" role="status">{adjustment || 'Ändringarna visas direkt i 3D.'}</p>
          <fieldset><legend>Glasutförande</legend>{data.sideGlazing ? <><div className="editor-choices">{(['front','side','both'] as const).map(value => <button type="button" key={value} aria-pressed={value === 'side' ? config.glazing === 'left' || config.glazing === 'right' : config.glazing === value} onClick={() => update({glazing:value === 'side' ? 'right' : value})}>{{front:'Framsida',side:'Framsida + en sida',both:'Framsida + båda sidor'}[value]}</button>)}</div>{(config.glazing === 'left' || config.glazing === 'right') && <><p className="control-help">Välj sida, sett framifrån.</p><div className="editor-choices">{(['left','right'] as const).map(value => <button type="button" key={value} aria-pressed={config.glazing === value} onClick={() => update({glazing:value})}>{value === 'left' ? 'Vänster' : 'Höger'}</button>)}</div></>}</> : <p className="control-help">Frontglas. Den stående insatsen har täckta sidor.</p>}</fieldset>
          <fieldset><legend>Omramningens mått</legend><p className="control-help">Höjd mäts från golvet. Ange takhöjden om omramningen ska nå taket.</p>{(Object.keys(dimensionLabels) as (keyof EnclosureDimensions)[]).map(name => <MeasureControl key={name} id={'dimension-'+name} label={dimensionLabels[name]} value={config[name]} {...dimensionLimits[name]} min={name === 'plinth' ? dimensionLimits.plinth.min : Math.max(dimensionLimits[name].min, geometry?.requiredMm?.[name] ?? 0)} onChange={n => update({[name]: n})}/>)}</fieldset>
          <ShelfControls config={config} onChange={update}/>
          <WoodControls config={config} onChange={update} builtIn={data.builtInWoodCompartment}/>
          <fieldset><legend>Ytskikt</legend><div className="editor-choices editor-finishes">{(Object.keys(finishes) as (keyof typeof finishes)[]).map(value => <button type="button" key={value} aria-pressed={config.finish === value} onClick={() => update({finish:value})}>{finishes[value].label}</button>)}</div></fieldset>
          <fieldset><legend>Kulör</legend><div className="editor-choices">{(Object.keys(colors) as (keyof typeof colors)[]).map(value => <button type="button" className="editor-swatch" key={value} aria-pressed={config.color === value} onClick={() => update({color:value})}><span style={{background:colors[value].hex}}/>{colors[value].label}</button>)}</div></fieldset>
        </>}
        <fieldset><legend>Skorstensanslutning</legend><div className="editor-choices">{(Object.keys(connectionLabels) as FlueConnection[]).map(value => <button type="button" key={value} aria-pressed={connection === value} onClick={() => setConnection(value)}>{connectionLabels[value]}</button>)}</div><p className="control-help">Önskad anslutning; verifieras för vald variant. Skorstenen modelleras inte i detta steg.</p></fieldset>
      </section>
      <aside className="design-summary enclosure-summary" aria-label="Ditt val"><p className="eyebrow">DITT UTKAST</p><h3>{variantName}</h3><dl><div><dt>Omramning</dt><dd>{config ? enclosureSummary(config) : 'Mått under verifiering'}</dd></div><div><dt>Skorstensanslutning</dt><dd>{connection ? connectionLabels[connection] : 'Inte vald'}</dd></div><div><dt>Rumsyta</dt><dd>{preferences.kvm ? preferences.kvm.replace('.',',')+' m²' : 'Inte angiven'}</dd></div><div><dt>Placering</dt><dd>{placement ? placementLabels[placement] : 'Inte vald'}</dd></div></dl></aside>
      <div className="design-stage-actions"><Link href={link(roomStep ? 'utforande' : 'insats')} className="line-link">{roomStep ? 'Till utförande' : 'Byt insats'}</Link><Link href={roomStep ? draftContactHref(modelSlug, variantId, preferences) : link('rum')} className="button dark">{roomStep ? 'Skicka mitt utkast' : 'Till placering'} <Arrow/></Link></div>
      <DraftLink href={currentHref}/>{roomStep && <p className="control-help">Nästa steg öppnar kontaktformuläret. Du väljer själv om utkastet ska följa med.</p>}
    </div></div>
  </div>;
}

