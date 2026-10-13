import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Header from '@/components/header';
import BrandLogo from '@/components/brand-logo';
import { Arrow } from '@/components/ui-icons';
import { siteUrl } from '@/lib/site';
import './globals.css';
import './shop-theme.css';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Kaminer & insatser från Kratki Pro | Stockholm Vedspisar',template:'%s | Stockholm Vedspisar'},description:'Kaminer och insatser från Kratki Pro. Utforska modeller, välj material och se eldstäderna i vårt digitala showroom.',openGraph:{type:'website',locale:'sv_SE',siteName:'Stockholm Vedspisar',title:'Kaminer & insatser från Kratki Pro | Stockholm Vedspisar',description:'Hitta din kamin hos Stockholm Vedspisar. Modeller, materialval och showroom för Kratki Pro.'},icons:{icon:'/favicon.svg'}};
export const viewport:Viewport={themeColor:'#111111',colorScheme:'dark'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="sv" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Hoppa till innehåll</a><Header/><main id="main">{children}</main><footer className="site-footer shell"><div><Link className="footer-brand" href="/" aria-label="Stockholm Vedspisar, startsida"><BrandLogo sizes="230px"/></Link><p>Kaminer. Insatser. Kratki Pro.<br/>Hitta ditt uttryck.</p></div><div><p className="eyebrow">SHOWROOM</p><Link href="/showroom">Showroom</Link><Link href="/kollektion">Kaminer & insatser</Link><Link href="/om-kratki-pro">Om Kratki Pro</Link></div><div><p className="eyebrow">STOCKHOLM VEDSPISAR</p><Link href="/kontakt">Kontakt</Link><Link href="/integritet">Integritet & bilder</Link><span className="footer-demo">Showroom i utveckling · demo</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Stockholm Vedspisar</span><span>KRATKI PRO / ELD MED KARAKTÄR</span><a href="#main">Till toppen <Arrow direction="up"/></a></div></footer></body></html>}
