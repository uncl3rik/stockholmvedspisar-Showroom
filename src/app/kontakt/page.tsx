import Link from 'next/link';
import { Intro, ShowroomImage } from '@/components/showroom';
import QuoteForm from '@/components/quote-form';
import DraftLink from '@/components/eldstad/draft-link';
import { insertModels as models, insertVariants as variants, insertPreview } from '@/data/insert-catalog';
import { configurationLabel } from '@/lib/configuration';
import { decodeDraft } from '@/lib/design-draft';
import { designHref, designPreferences, resolveDesign, placementLabels, connectionLabels, visualizationNotice, type DesignQuery } from '@/lib/fireplace-design';
import { readEnclosure, enclosureSummary, visualPreferences } from '@/lib/eldstad/configuration';
export const metadata={title:'Kontakt',description:'Frågor om insatser och utföranden. Kontakta oss om din eldstad och bifoga gärna din design.'};
export default async function Page({searchParams}:{searchParams:Promise<DesignQuery & {utkast?:string|string[];miljo?:string}>}) {
  const q=await searchParams;
  const decoded=decodeDraft(q.utkast);
  const resolved=decoded ? resolveDesign(decoded,models,variants) : null;
  const hasDraft=Boolean(resolved?.design.insert);
  const source=hasDraft && decoded ? decoded : q;
  const model=models.find(m=>m.id===resolved?.design.insert?.modelId || m.slug===source.modell);
  const variant=variants.find(v=>v.id===source.variant&&v.modelId===model?.id);
  const configuration=variant?.configurations?.find(c=>c.id===source.konfiguration);
  const prefs=resolved && hasDraft ? designPreferences(resolved.design) : null;
  const enclosure=variant && prefs ? readEnclosure(variant.construction,prefs) : null;
  const normalized=prefs ? {...prefs,...(enclosure?visualPreferences(enclosure):{})} : null;
  const draftHref=model && variant && normalized ? designHref('rum',model.slug,variant.id,normalized) : null;
  const summary=normalized ? [
    ['Omramning',enclosure?enclosureSummary(enclosure):'Mått under verifiering'],
    ['Placering',normalized.placering?placementLabels[normalized.placering]:'Inte vald'],
    ['Rumsyta',normalized.kvm?normalized.kvm.replace('.',',')+' m²':'Inte angiven'],
    ['Skorstensanslutning',normalized.anslutning?connectionLabels[normalized.anslutning]:'Inte vald'],
  ] : [];
  const productContext=[model?model.name:null,variant?variant.name:null,variant?configurationLabel(variant,configuration):null].filter(Boolean).join(' · ');
  const context=[productContext,...summary.map(([label,value])=>`${label}: ${value}`),draftHref?'Utkast: '+draftHref:null].filter(Boolean).join('\n');
  return <><Intro label="KONTAKT / STOCKHOLM VEDSPISAR" title="Frågor om din eldstad?" description="Frågor om en modell, ett material eller ett utförande? Här samlar vi dina val."/>
    <div className="quote-layout shell"><aside className="quote-aside">
      <ShowroomImage assetId={configuration?.assetId||variant?.assetIds[0]||model?.coverAssetId||insertPreview(models[0])}/>
      <h2>{hasDraft?'Ditt utkast.':'Modellen. Materialet. Detaljerna.'}</h2>
      {productContext&&<div className="context-note"><p className="eyebrow">DITT VAL</p><p>{productContext}</p></div>}
      {summary.length>0 && <dl>{summary.map(([label,value])=><div key={label} style={{marginBlock:'16px'}}><dt><strong>{label}</strong></dt><dd>{value}</dd></div>)}</dl>}
      {draftHref && <div style={{overflowWrap:'anywhere'}}><p className="eyebrow">DELBART UTKAST</p><Link href={draftHref}>Öppna och fortsätt med utkastet</Link><p style={{fontSize:'.75rem',marginBlock:'12px'}}>{draftHref}</p><DraftLink href={draftHref}/><p className="quiet">{visualizationNotice}</p></div>}
      {q.utkast&&!hasDraft&&<p role="status">Utkastlänken kunde inte läsas. Öppna guiden och skapa en ny länk.</p>}
      {!hasDraft&&<p>Du behöver inte ha bestämt dig. Börja med den modell eller det uttryck du är nyfiken på.</p>}
    </aside><QuoteForm key={context} context={context} draftHref={draftHref}/></div></>;
}

