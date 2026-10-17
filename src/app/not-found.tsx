import Link from 'next/link';
import { Arrow } from '@/components/ui-icons';
export default function NotFound(){return <section className="notice shell"><p className="eyebrow">404 / SIDAN SAKNAS</p><h1>Sidan finns inte.</h1><p>Utforska våra eldstadsinsatser eller börja med en ny skiss.</p><Link className="button dark" href="/designa">Designa din eldstad <Arrow/></Link></section>}
