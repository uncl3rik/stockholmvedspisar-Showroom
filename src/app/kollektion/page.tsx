import { Intro,AdviceCTA } from '@/components/showroom';
import Collection from '@/components/collection';
export const metadata={title:'Kollektion — Kratki Pro-modeller',description:'Upptäck ERIK, REN, SVEN, BJORN, KARI och fler Kratki Pro-modeller. Utforska Kratki Pro efter form, glas och mötet med rummet.'};
export default function Page(){return <><Intro label="KOLLEKTION / KRATKI PRO" title="Formen runt elden." description="Tolv kaminfamiljer och fem insatsserier. Upptäck former, jämför utföranden och utforska materialen som passar din idé."/><section className="shell page-content" aria-label="Kratki Pro-kollektionen"><Collection/></section><AdviceCTA/></>}
