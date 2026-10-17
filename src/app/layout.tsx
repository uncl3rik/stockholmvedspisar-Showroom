import type { Metadata, Viewport } from 'next';
import Link from 'next/link';
import Header from '@/components/header';
import BrandLogo from '@/components/brand-logo';
import { Arrow } from '@/components/ui-icons';
import { siteUrl } from '@/lib/site';
import './globals.css';
import './shop-theme.css';
export const metadata:Metadata={metadataBase:new URL(siteUrl),title:{default:'Skräddarsydda eldstäder | Stockholm Vedspisar',template:'%s | Stockholm Vedspisar'},description:'Välj din insats och forma din egen platsbyggda eldstad.',openGraph:{type:'website',locale:'sv_SE',siteName:'Stockholm Vedspisar',title:'Skräddarsydda eldstäder | Stockholm Vedspisar',description:'Eld med karaktär. Insatser och egna utföranden för din eldstad.'},icons:{icon:'/favicon.svg'}};
export const viewport:Viewport={themeColor:'#111111',colorScheme:'dark'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="sv" data-scroll-behavior="smooth"><body><a className="skip-link" href="#main">Hoppa till innehåll</a><Header/><main id="main">{children}</main><footer className="site-footer shell"><div><Link className="footer-brand" href="/" aria-label="Stockholm Vedspisar, startsida"><BrandLogo sizes="230px"/></Link><p>Skräddarsydda eldstäder.<br/>Eld med karaktär.</p></div><div><p className="eyebrow">DIN ELDSTAD</p><Link href="/designa">Designa din eldstad</Link><Link href="/kollektion">Insatser</Link></div><div><p className="eyebrow">STOCKHOLM VEDSPISAR</p><Link href="/kontakt">Kontakt</Link><Link href="/integritet">Integritet & bilder</Link><span className="footer-demo">Designverktyg under utveckling</span></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Stockholm Vedspisar</span><span>ELD MED KARAKTÄR</span><a href="#main">Till toppen <Arrow direction="up"/></a></div></footer></body></html>}
