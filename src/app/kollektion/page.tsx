import { Intro } from '@/components/showroom';
import Collection from '@/components/collection';
export const metadata={title:'KARI och Contura i8',description:'Välj KARI från Kratki Pro eller Contura i8 som utgångspunkt för din eldstad.'};
export default function Page(){return <><Intro label="KOLLEKTION / INSATSER" title="Elden börjar här." description="KARI och Contura i8. Två utgångspunkter för en egen omramning."/><section className="shell page-content" aria-label="Eldstadsinsatser"><Collection/></section></>}
