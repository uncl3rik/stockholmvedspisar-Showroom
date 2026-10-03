import { Intro,AdviceCTA } from '@/components/showroom';
import Collection from '@/components/collection';
export const metadata={title:'Kollektion — Kratki Pro-modeller',description:'Kaminer och insatser från Kratki Pro. Jämför modellernas form, glas, material och utföranden.'};
export default function Page(){return <><Intro label="KOLLEKTION / KRATKI PRO" title="Formen runt elden." description="Tolv kaminfamiljer och fem insatsserier. Välj en modell för bilder, utföranden och produktuppgifter."/><section className="shell page-content" aria-label="Kratki Pro-kollektionen"><Collection/></section><AdviceCTA/></>}
