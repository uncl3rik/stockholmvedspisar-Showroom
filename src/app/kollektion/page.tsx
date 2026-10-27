import { Intro } from '@/components/showroom';
import Collection from '@/components/collection';
export const metadata={title:'KARI, Contura i8 och i1',description:'Välj KARI från Kratki Pro, Contura i8 eller i1 som utgångspunkt för din eldstad.'};
export default function Page(){return <><Intro label="KOLLEKTION / INSATSER" title="Elden börjar här." description="Liggande och stående utgångspunkter för en egen omramning."/><section className="shell page-content" aria-label="Eldstadsinsatser"><Collection/></section></>}
