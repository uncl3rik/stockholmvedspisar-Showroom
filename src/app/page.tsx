import Image from 'next/image';
import Link from 'next/link';
import FireMark from '@/components/fire-mark';
import { AdviceCTA,Arrow,Heading,ModelCard,SceneCard,ShowroomImage } from '@/components/showroom';
import { models,showroomScenes } from '@/data/showroom';
export default function Home(){return <>
  <section className="showroom-hero"><div className="hero-editorial"><p className="eyebrow">STOCKHOLM VEDSPISAR / DIGITALT SHOWROOM</p><p className="hero-partnership">Tillsammans med Kratki Pro</p><div className="hero-title"><div className="hero-signature"><FireMark className="hero-fire"/><p className="collection-mark">KRATKI<span>PRO</span><i>®</i></p></div><h1>Eld, form<br/>och rum.</h1></div><p className="hero-description">Kaminer och insatser från Kratki Pro.<br/>Se modeller, material och miljöer.</p><Link href="/showroom" className="button ivory">Visa showroomet <Arrow/></Link><div className="hero-foot"><span>KAMINER / INSATSER</span><a href="#miljoer" aria-label="Se miljöerna längre ner">↓</a></div></div><Link href="/kollektion/erik" className="hero-scene hero-product" aria-label="Se ERIK – kamin med rundat glas"><ShowroomImage assetId="retailer-5318-norrtelje-4798" priority sizes="(max-width:760px) 100vw, 60vw"/><div className="hero-product-label"><div><p className="eyebrow">KRATKI PRO / FRISTÅENDE KAMIN</p><span>ERIK</span></div><span className="hero-product-link">Se modellen <Arrow/></span></div></Link></section>
  <section className="opening shell"><p className="eyebrow">ETT SHOWROOM FÖR KRATKI PRO</p><h2>Eldstäder<br/><em>i olika rum.</em></h2><div><p>Här visas Kratki Pro i olika miljöer, tillsammans med modellernas utföranden och produktuppgifter.</p><Link href="/om-kratki-pro" className="line-link">Om Kratki Pro <Arrow/></Link></div></section>
  <section id="miljoer" className="showroom-section shell"><Heading label="01 / UTVALDA MILJÖER" title="Två miljöer." href="/showroom" linkText="Hela showroomet"/><div className="scene-grid home-scenes">{showroomScenes.map((scene,i)=><SceneCard key={scene.id} scene={scene} index={i}/>)}</div></section>
  <section id="vinklar" className="angles-feature" aria-labelledby="angles-title">
    <div className="angles-image"><Image src="/images/tunnel-living-room.png" alt="Tunnelspis med genomsyn mellan soffgrupp och matplats i ett ljust vardagsrum" fill sizes="(max-width: 1244px) 90vw, 1120px"/></div>
    <div className="angles-content shell">
      <div className="angles-heading"><p className="eyebrow">VINKLAR / KRATKI PRO</p><h2 id="angles-title">En brasa.<br/>Flera håll.</h2></div>
      <div className="angles-details"><p>Tunnelspisar har glas på två motsatta sidor, med genomsyn och eld synlig från båda håll. En brasa mellan två delar av rummet.</p><p>Kratki Pro finns med hörnglas, tresidigt glas och tunnelglas. NB har glas på tre sidor, medan KARI även finns i tunnelutförande.</p><div className="feature-links"><Link href="/kollektion/kari" className="line-link light-link">Visa KARI <Arrow/></Link><Link href="/kollektion/nb" className="line-link light-link">Visa NB <Arrow/></Link></div></div>
    </div>
  </section>
  <section className="showroom-section shell"><Heading label="02 / KOLLEKTIONEN" title="Kaminer och insatser." href="/kollektion" linkText="Alla modeller"/><div className="model-grid">{models.slice(0,3).map(model=><ModelCard key={model.id} model={model}/>)}</div></section>
  <section className="material-story shell"><p className="eyebrow">MATERIAL OCH OMRAMNING</p><h2>Glas, stål<br/><em>och omramning.</em></h2><p>Omramningen påverkar eldstadens uttryck. Miljöbilderna visar olika möten mellan elden och rummets material.</p><Link className="line-link" href="/showroom">Se miljöerna <Arrow/></Link></section><AdviceCTA/>
</>}
