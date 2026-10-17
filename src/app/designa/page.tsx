import Link from 'next/link';
import { Arrow, ShowroomImage } from '@/components/showroom';
import { insertModels, insertVariants, insertPreview } from '@/data/insert-catalog';
import { designHref, designSteps, designPreferences, resolveDesign, type DesignQuery } from '@/lib/fireplace-design';

import RoomArea from '@/components/room-area';

export const metadata = { title: 'Designa din eldstad', description: 'Börja med en Kratki-insats. En första skiss för omramning och placering.', robots: { index: false, follow: true } };

export default async function Page({ searchParams }: { searchParams: Promise<DesignQuery> }) {
  const { design, step } = resolveDesign(await searchParams, insertModels, insertVariants);
  const selected = insertModels.find(m => m.id === design.insert?.modelId);
  const selectedVariant = insertVariants.find(v => v.id === design.insert?.variantId);
  const index = designSteps.findIndex(s => s.id === step);
  const preferences = designPreferences(design);
  const href = (next: typeof step) => designHref(next, selected?.slug, selectedVariant?.id, preferences);
  return <div className="design-page shell">
    <header className="design-heading"><p className="eyebrow">DIN ELDSTAD / FÖRSTA SKISSEN</p><h1>Från KARI<br/>till din eldstad.</h1></header>
    <nav className="design-steps" aria-label="Designsteg">{designSteps.map((item, i) => selected || i === 0
      ? <Link key={item.id} href={href(item.id)} aria-current={step === item.id ? 'step' : undefined}><span>0{i + 1}</span>{item.label}</Link>
      : <span key={item.id} aria-disabled="true"><span>0{i + 1}</span>{item.label}</span>)}</nav>
    <div className="design-layout"><section aria-labelledby="design-stage-title">
      <div className="design-stage-heading"><p className="eyebrow">STEG 0{index + 1}</p><h2 id="design-stage-title">{step === 'insats' ? 'Börja med elden.' : step === 'omramning' ? 'Formen runt elden.' : 'Eldstaden i rummet.'}</h2><p>{step === 'insats' ? 'Välj din KARI-variant. Du kan byta senare.' : step === 'omramning' ? 'Välj form på omramningen och önskad skorstensanslutning.' : 'Börja med rummets yta. Exakt placering lägger vi till senare.'}</p></div>
      {step === 'insats' ? <div className="design-inserts">{insertModels.flatMap(model => model.variantIds.map(id => {
        const variant = insertVariants.find(v => v.id === id)!;
        const active = selectedVariant?.id === id;
        return <article className={`design-insert${active ? ' is-selected' : ''}`} key={id}>
          <Link className="design-insert-select" scroll={false} href={designHref('insats', model.slug, id, preferences)} aria-label={`Välj ${variant.name}`} aria-current={active ? 'true' : undefined}>
            <ShowroomImage assetId={insertPreview(model, variant)} sizes="(max-width:760px) 45vw, 25vw"/>
            <div><p className="eyebrow">KRATKI PRO / KARI</p><h3>{model.name}</h3><p>{variant.name}</p><span className="design-selection-label">{active ? 'Vald insats' : 'Välj insats'} <Arrow/></span></div>
          </Link><Link className="design-product-link" href={`/kollektion/${model.slug}?variant=${id}`}>Bilder & tekniska uppgifter <Arrow/></Link>
        </article>;
      }))}</div> : step === 'omramning' ? <div className="enclosure-options">
      <fieldset><legend>Omramningens form</legend><div className="design-choice-grid">{([{value:'fyrkantig',label:'Fyrkantig'},{value:'rektangular',label:'Rektangulär'}] as const).map(option=><Link key={option.value} scroll={false} className="design-option" aria-current={preferences.form===option.value?'true':undefined} href={designHref('omramning',selected?.slug,selectedVariant?.id,{...preferences,form:option.value})}><span className={'shape-symbol shape-'+option.value} aria-hidden="true"/><span>{option.label}</span>{preferences.form===option.value&&<small>Vald</small>}</Link>)}</div></fieldset>
      <fieldset><legend>Skorstensanslutning</legend><div className="design-choice-grid">{([{value:'topp',label:'Uppåt från spisen'},{value:'bak',label:'Bakansluten'}] as const).map(option=><Link key={option.value} scroll={false} className="design-option" aria-current={preferences.anslutning===option.value?'true':undefined} href={designHref('omramning',selected?.slug,selectedVariant?.id,{...preferences,anslutning:option.value})}><svg aria-hidden="true" className="flue-symbol" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="3"><rect x="20" y="30" width="40" height="40"/>{option.value==='topp'?<path d="M34 30V8h12v22"/>:<path d="M60 40h12v12H60"/>}</svg><span>{option.label}</span>{preferences.anslutning===option.value&&<small>Vald</small>}</Link>)}</div></fieldset><p className="quiet">Symbolerna visar principen. Mått och material kommer senare.</p>
      </div> : selected && selectedVariant ? <><RoomArea key={selectedVariant.id+'-'+preferences.kvm} modelSlug={selected.slug} variantId={selectedVariant.id} preferences={preferences}/><div className="design-canvas"><div><span className="eyebrow">RUMSVY / KOMMER SENARE</span><p>Här tar placeringen form.</p><span>Rumsytan är ett första underlag, inte en effektberäkning.</span></div></div></> : null}
      <div className="design-stage-actions">{index > 0 && <Link className="line-link" href={href(designSteps[index - 1].id)}>Tillbaka</Link>}{index < 2 ? selected ? <Link className="button dark" href={href(designSteps[index + 1].id)}>{index === 0 ? 'Till utförande' : 'Till placering'} <Arrow/></Link> : <button className="button dark" disabled>Välj en insats för att fortsätta</button> : <Link className="line-link" href={href('insats')}>Till ditt insatsval <Arrow/></Link>}</div>
    </section><aside className="design-summary" aria-label="Ditt val"><p className="eyebrow">DITT UTKAST</p>{selected && selectedVariant ? <><ShowroomImage assetId={insertPreview(selected, selectedVariant)} sizes="(max-width:760px) 90vw, 260px"/><h3>{selected.name}</h3><p>{selectedVariant.name}</p><p className="media-credit">Produktbild för valt utförande. Omramningen visas ännu inte.</p><Link href={href('insats')} className="line-link">Byt insats <Arrow/></Link></> : <p>Ingen insats vald ännu.</p>}<dl><div><dt>Omramning</dt><dd>{design.enclosure?.shape === 'fyrkantig' ? 'Fyrkantig' : design.enclosure?.shape === 'rektangular' ? 'Rektangulär' : 'Inte vald'}</dd></div><div><dt>Skorstensanslutning</dt><dd>{design.enclosure?.flueConnection === 'topp' ? 'Uppåt / toppansluten' : design.enclosure?.flueConnection === 'bak' ? 'Bakansluten' : 'Inte vald'}</dd></div><div><dt>Rumsyta</dt><dd>{design.room?.areaM2 ? design.room.areaM2.toLocaleString('sv-SE')+' m²' : 'Inte angiven'}</dd></div><div><dt>Placering</dt><dd>Inte vald</dd></div></dl><p className="quiet">Dina val beskriver önskat utförande. Konstruktion och anslutning behöver verifieras för vald KARI-variant.</p></aside></div>
  </div>;
}
