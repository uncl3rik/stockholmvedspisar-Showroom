import Link from 'next/link';
import { Arrow } from '@/components/ui-icons';
export default function NotFound(){return <section className="notice shell"><p className="eyebrow">404 / SIDAN SAKNAS</p><h1>Sidan finns inte.</h1><p>Du kan gå vidare till showroomet via länken nedan.</p><Link className="button dark" href="/showroom">Till showroomet <Arrow/></Link></section>}
