import Image from 'next/image';
import Link from 'next/link';
import { AdviceCTA, Arrow, Heading, ModelCard, SceneCard, ShowroomImage } from '@/components/showroom';
import { models, showroomScenes } from '@/data/showroom';

export default function Home() {
  return <>
    <section className="shop-hero shell">
      <div className="shop-hero-copy">
        <p className="eyebrow">STOCKHOLM VEDSPISAR / KRATKI PRO</p>
        <h1 className="bespoke-title">Skräddarsydda<br/><span>Eldstäder.</span></h1>
        <Link href="/kollektion" className="button dark">Se alla kaminer & insatser <Arrow/></Link>
        <span className="shop-partnership">Tillsammans med Kratki Pro</span>
      </div>
      <Link href="/kollektion/erik" className="shop-hero-product" aria-label="Utforska ERIK och välj utförande">
        <div className="product-stamp"><span>MODELL I FOKUS</span><strong>ERIK</strong></div>
        <ShowroomImage assetId="retailer-5318-norrtelje-4798" priority sizes="(max-width:760px) 90vw, 50vw"/>
        <div className="shop-product-foot"><span>Rundat glas. Tydlig form.</span><span>Utforska ERIK <Arrow/></span></div>
      </Link>
    </section>
    <nav className="shop-shortcuts shell" aria-label="Utforska sortimentet">
      <Link href="/kollektion"><span>01 / SORTIMENT</span>Kaminer & insatser <Arrow/></Link>
      <Link href="/kollektion/erik"><span>02 / MATERIALVAL</span>Välj ditt uttryck <Arrow/></Link>
      <Link href="/showroom"><span>03 / INSPIRATION</span>Se elden i rummet <Arrow/></Link>
    </nav>
    <section className="showroom-section shell"><Heading label="SORTIMENT / KRATKI PRO" title="Hitta din form." href="/kollektion" linkText="Alla modeller"/><div className="model-grid featured-models">{['erik','ren','kari','sven'].map(slug => models.find(m => m.slug === slug)!).map(model => <ModelCard key={model.id} model={model}/>)}</div></section>
    <section className="material-guide shell">
      <div><p className="eyebrow">EN MODELL. DITT UTFÖRANDE.</p><h2>Detaljerna<br/>gör skillnaden.</h2><p>Stål, keramik eller sten. Ljus eller mörk insida. På modellsidan ser du vilka val som finns och hur de förändrar kaminens utseende.</p><Link href="/kollektion/erik" className="line-link">Prova materialvalen på ERIK <Arrow/></Link></div>
      <div className="material-guide-steps"><div><span>01</span><h3>Välj modell</h3><p>Hitta formen och glaset som passar dig.</p></div><div><span>02</span><h3>Byt material</h3><p>Se produktbilden ändras med ditt val, där bild finns.</p></div><div><span>03</span><h3>Spara ditt val</h3><p>Kopiera länken till just ditt utförande.</p></div></div>
    </section>
    <section id="miljoer" className="showroom-section shell"><Heading label="SHOWROOM / TVÅ UTTRYCK" title="Samma eld. Olika rum." href="/showroom" linkText="Till showroomet"/><div className="scene-grid home-scenes">{showroomScenes.map((scene,i) => <SceneCard key={scene.id} scene={scene} index={i}/>)}</div></section>
    <section id="vinklar" className="angles-feature shell" aria-labelledby="angles-title">
      <div className="angles-image"><Image src="/images/tunnel-living-room.png" alt="Tunnelspis med genomsyn mellan soffgrupp och matplats" fill sizes="(max-width:760px) 90vw, 60vw"/></div>
      <div className="angles-content"><div className="angles-heading"><p className="eyebrow">GLAS / PERSPEKTIV</p><h2 id="angles-title">En brasa.<br/>Flera håll.</h2></div><div className="angles-details"><p>Tunnelglas öppnar upp elden åt två håll. Hörnglas och tresidigt glas ger fler vinklar på samma brasa.</p><div className="feature-links"><Link href="/kollektion/kari" className="line-link">KARI / tunnelglas <Arrow/></Link><Link href="/kollektion/nb" className="line-link">NB / tresidigt glas <Arrow/></Link></div></div></div>
    </section>
    <AdviceCTA/>
  </>;
}
