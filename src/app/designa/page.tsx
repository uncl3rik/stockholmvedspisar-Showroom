import Link from 'next/link';
import { Arrow, ShowroomImage } from '@/components/showroom';
import { insertModels, insertVariants, insertPreview } from '@/data/insert-catalog';
import { designHref, designSteps, designPreferences, resolveDesign, placementLabels, connectionLabels, type DesignQuery } from '@/lib/fireplace-design';
import { enclosureSummary, readEnclosure } from '@/lib/eldstad/configuration';
import RoomArea from '@/components/room-area';
import EnclosureEditor from '@/components/eldstad/enclosure-editor';
import './enclosure.css';

export const metadata = { title: 'Designa din eldstad', description: 'Välj en liggande eller stående insats. Forma omramningen och placera eldstaden i rummet.', robots: { index: false, follow: true } };

export default async function Page({ searchParams }: { searchParams: Promise<DesignQuery> }) {
  const query = await searchParams;
  const offeredModels = query.format === 'liggande' ? insertModels.filter(model => model.slug === 'liggande') : insertModels;
  const { design, step } = resolveDesign(query, insertModels, insertVariants);
  const selected = insertModels.find(m => m.id === design.insert?.modelId);
  const selectedVariant = insertVariants.find(v => v.id === design.insert?.variantId);
  const preferences = designPreferences(design);
  const index = designSteps.findIndex(s => s.id === step);
  const href = (next: typeof step) => designHref(next, selected?.slug, selectedVariant?.id, preferences);
  if((step === 'utforande' || step === 'rum') && selected && selectedVariant) return <EnclosureEditor key={JSON.stringify(query)} modelSlug={selected.slug} variantId={selectedVariant.id} variantName={selectedVariant.name} data={selectedVariant.construction} initialPreferences={preferences} referenceAssetId={insertPreview(selected,selectedVariant)} step={step} power={selectedVariant.specifications['Nominell effekt'] || selectedVariant.specifications['Effekt enligt källa']}/>;
  const visualConfig = selectedVariant && design.visual ? readEnclosure(selectedVariant.construction, preferences) : null;
  return <div className="design-page shell">
    <header className="design-heading"><p className="eyebrow">DIN ELDSTAD / ENDAST FÖR INSPIRATION</p><h1>Från insats<br/>till din eldstad.</h1></header>
    <nav className="design-steps" aria-label="Designsteg">{designSteps.map((item,i) => selected || i === 0
      ? <Link key={item.id} href={href(item.id)} aria-current={step === item.id ? 'step' : undefined}><span>0{i+1}</span>{item.label}</Link>
      : <span key={item.id} aria-disabled="true"><span>0{i+1}</span>{item.label}</span>)}</nav>
    <div className="design-layout"><section aria-labelledby="design-stage-title">
      <div className="design-stage-heading"><p className="eyebrow">STEG 0{index+1}</p><h2 id="design-stage-title">{step === 'insats' ? 'Börja med elden.' : 'Eldstaden i rummet.'}</h2><p>{step === 'insats' ? (query.format === 'liggande' ? 'Välj en liggande insats. Därefter formar du omramningen.' : 'Välj din insats. Därefter formar du omramningen.') : 'Börja med rummets yta. Exakt placering lägger vi till senare.'}</p></div>
      {step === 'insats' && <Link href="/" className="line-link">Byt mellan stående och liggande <Arrow/></Link>}
      {step === 'insats' ? <div className="design-inserts">{offeredModels.flatMap(model => model.variantIds.filter(id => model.slug !== 'kari' || id === 'variant-retailer-5047').map(id => {
        const variant = insertVariants.find(v => v.id === id)!;
        const active = selectedVariant?.id === id;
        return <article className={'design-insert'+(active?' is-selected':'')} key={id}>
          <Link className="design-insert-select" href={designHref('utforande',model.slug,id,active?preferences:{...preferences,dim:undefined,ved:undefined,glas:undefined})} aria-label={'Välj '+variant.name} aria-current={active?'true':undefined}>
            <ShowroomImage assetId={insertPreview(model,variant)} sizes="(max-width:760px) 45vw, 25vw"/>
            <div><p className="eyebrow">PRINCIPSKISS / INSATS</p><h3>{model.slug === 'kari' ? 'KARI 80' : model.name}</h3>{model.slug !== 'kari' && <p>{variant.name}</p>}<span className="design-selection-label">{active?'Till utförande':'Välj insats'} <Arrow/></span></div>
          </Link><Link className="design-product-link" href={'/kollektion/'+model.slug+'?variant='+id}>Mått & information <Arrow/></Link>
        </article>;
      }))}</div> : selected && selectedVariant ? <><RoomArea key={selectedVariant.id+'-'+preferences.kvm} modelSlug={selected.slug} variantId={selectedVariant.id} preferences={preferences}/><div className="design-canvas"><div><span className="eyebrow">RUMSVY / KOMMER SENARE</span><p>Här tar placeringen form.</p><span>Rumsytan är ett första underlag, inte en effektberäkning.</span></div></div></> : null}
      <div className="design-stage-actions">{index>0&&<Link className="line-link" href={href('utforande')}>Tillbaka</Link>}{step==='insats'?selected?<Link className="button dark" href={href('utforande')}>Till utförande <Arrow/></Link>:<button className="button dark" disabled>Välj en insats för att fortsätta</button>:<Link className="line-link" href={href('insats')}>Till ditt insatsval <Arrow/></Link>}</div>
    </section><aside className="design-summary" aria-label="Ditt val"><p className="eyebrow">DITT UTKAST</p>{selected&&selectedVariant?<><ShowroomImage assetId={insertPreview(selected,selectedVariant)} sizes="(max-width:760px) 90vw, 260px"/><h3>{selected.name}</h3><p>{selectedVariant.name}</p><Link href={href('insats')} className="line-link">Byt insats <Arrow/></Link></>:<p>Ingen insats vald ännu.</p>}<dl>
      <div><dt>Omramning</dt><dd>{visualConfig?enclosureSummary(visualConfig):design.enclosure?.shape==='fyrkantig'?'Fyrkantig':design.enclosure?.shape==='rektangular'?'Rektangulär':'Inte vald'}</dd></div>
      <div><dt>Skorstensanslutning</dt><dd>{design.enclosure?.flueConnection?connectionLabels[design.enclosure.flueConnection]:'Inte vald'}</dd></div>
      <div><dt>Rumsyta</dt><dd>{design.room?.areaM2?design.room.areaM2.toLocaleString('sv-SE')+' m²':'Inte angiven'}</dd></div><div><dt>Placering</dt><dd>{design.room?.placementKind?placementLabels[design.room.placementKind]:'Inte vald'}</dd></div>
    </dl><p className="quiet">Dina val beskriver önskat utförande. Konstruktion och anslutning behöver verifieras för vald insats.</p></aside></div>
  </div>;
}

