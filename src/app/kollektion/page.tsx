import { Intro } from '@/components/showroom';
import Collection from '@/components/collection';
export const metadata={title:'KARI från Kratki Pro',description:'Utforska KARI och dess åtta varianter som utgångspunkt för din eldstad.'};
export default function Page(){return <><Intro label="KRATKI PRO / INSATSER" title="Elden börjar här." description="KARI i åtta varianter. Välj din utgångspunkt för en egen omramning."/><section className="shell page-content" aria-label="Eldstadsinsatser"><Collection/></section></>}
