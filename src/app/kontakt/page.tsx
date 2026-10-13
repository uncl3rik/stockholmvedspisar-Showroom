import { Intro, ShowroomImage } from '@/components/showroom';
import QuoteForm from '@/components/quote-form';
import { models, variants, showroomScenes } from '@/data/showroom';
import { configurationLabel } from '@/lib/configuration';
export const metadata={title:'Kontakt',description:'Frågor om kaminer, insatser och materialval från Kratki Pro. Kontaktformuläret är en demo.'};
export default async function Page({searchParams}:{searchParams:Promise<{modell?:string;variant?:string;miljo?:string;konfiguration?:string}>}) {
  const q=await searchParams;
  const model=models.find(m=>m.slug===q.modell);
  const variant=variants.find(v=>v.id===q.variant&&v.modelId===model?.id);
  const configuration=variant?.configurations?.find(c=>c.id===q.konfiguration);
  const scene=showroomScenes.find(s=>s.slug===q.miljo);
  const context=[model?'Kratki Pro '+model.name:null,variant?variant.name:null,variant?configurationLabel(variant,configuration):null,scene?.name].filter(Boolean).join(' · ');
  return <><Intro label="KONTAKT / STOCKHOLM VEDSPISAR" title="Vilken kamin är din?" description="Frågor om en modell, ett material eller ett utförande? Här samlar vi dina val."/><div className="quote-layout shell"><aside className="quote-aside"><ShowroomImage assetId={configuration?.assetId||variant?.assetIds[0]||model?.coverAssetId||'sven-room'}/><h2>Modellen.<br/>Materialet.<br/>Detaljerna.</h2><p>Du behöver inte ha bestämt dig. Börja med den modell eller det uttryck du är nyfiken på.</p>{context&&<div className="context-note"><p className="eyebrow">DITT VAL</p><p>{context}</p></div>}</aside><QuoteForm key={context} context={context}/></div></>;
}
