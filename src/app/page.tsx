import Link from 'next/link';
import { ShowroomImage, Arrow } from '@/components/showroom';
import { designHref } from '@/lib/fireplace-design';
import './entry.css';
export default function Home() {
  return <section className="design-entry shell" aria-labelledby="entry-title">
    <header><p className="eyebrow">01 / VÄLJ DIN UTGÅNGSPUNKT</p><h1 id="entry-title">Vilken form är din?</h1><p>Välj insats. Utforska din idé – endast för inspiration.</p></header>
    <div className="entry-options">
      <Link href={designHref('utforande','liggande','variant-contura-i8')} className="entry-option">
        <div className="entry-image"><ShowroomImage assetId="contura-i8-product" priority sizes="(max-width:760px) 44vw, 45vw"/></div>
        <div className="entry-caption"><span className="eyebrow">735 × 530 × 365 MM</span><h2>Liggande</h2><span className="entry-action">Börja designa <Arrow/></span></div>
      </Link>
      <Link href={designHref('utforande','staende','variant-contura-i1')} className="entry-option">
        <div className="entry-image"><ShowroomImage assetId="contura-i1-product" priority sizes="(max-width:760px) 44vw, 45vw"/></div>
        <div className="entry-caption"><span className="eyebrow">480 × 550 × 350 MM</span><h2>Stående</h2><span className="entry-action">Börja designa <Arrow/></span></div>
      </Link>
    </div>
    <Link className="entry-more" href="/om-eldstader">Mer info <Arrow/></Link>
  </section>;
}

