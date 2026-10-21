import Link from 'next/link';
import { Arrow, Intro } from '@/components/showroom';
export const metadata = {title:'Mer info',description:'Vi bygger och anpassar eldstäder efter ditt hem. Designverktyget är endast till för inspiration.'};
export default function AboutFireplaces(){return <>
  <Intro label="MER INFO / STOCKHOLM VEDSPISAR" title="En eldstad som passar dig." description="Vi bygger de flesta typer av eldstadslösningar och anpassar utformningen efter ditt hem, dina önskemål och rummets förutsättningar."/>
  <section className="about-copy shell"><h2>Från idé<br/>till eldstad.</h2><div>
    <p>En enkel omramning eller en mer personlig, platsbyggd lösning – vi hjälper dig att hitta rätt form, material och placering. Modellerna och valen på sidan är en början, inte gränsen för vad vi kan bygga.</p>
    <p>Har du en annan insats, en egen skiss eller en idé som inte finns i verktyget? Berätta för oss, så tittar vi på hur lösningen kan anpassas.</p>
    <Link href="/kontakt" className="line-link">Prata med oss om din idé <Arrow/></Link>
  </div></section>
  <section className="about-copy shell"><h2>Designa för<br/>inspiration.</h2><div>
    <p><strong>Designverktyget är endast till för inspiration.</strong> Prova proportioner, material och placering för att hitta ett uttryck du gillar.</p>
    <p>Visualiseringen och utkastets mått är inte en byggritning eller ett godkänt installationsunderlag. Den slutliga konstruktionen, materialvalen, ventilationen och säkerhetsavstånden behöver kontrolleras för den valda insatsen och platsen.</p>
    <Link href="/" className="button dark">Prova en idé <Arrow/></Link>
  </div></section>
  <section className="design-overview shell" aria-label="Så använder du designverktyget"><Link href="/"><span className="eyebrow">01 / VÄLJ</span><h2>Välj insats.</h2><p>Stående eller liggande uttryck.</p><Arrow/></Link><div><span className="eyebrow">02 / UTFORSKA</span><h2>Prova utförande.</h2><p>Utforska mått, material och detaljer.</p></div><div><span className="eyebrow">03 / DELA</span><h2>Visa din idé.</h2><p>Prova placering och ta med utkastet till oss.</p></div></section>
</>}
