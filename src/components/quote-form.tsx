'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Arrow } from './ui-icons';
export default function QuoteForm({context}:{context:string}) {
  const [tested,setTested] = useState(false);
  return <form className="quote-form" onSubmit={e => {e.preventDefault();setTested(true)}}>
    <p className="form-status full">Formuläret är en demo. Inga uppgifter skickas.</p>
    {tested ? <div className="full" role="status"><h2>Formuläret har testats.</h2><p>Inga uppgifter har skickats eller sparats.</p><Link href="/kollektion" className="line-link">Till kaminerna <Arrow/></Link></div> : <>
      <div className="field"><label htmlFor="name">Namn *</label><input id="name" name="name" autoComplete="name" required maxLength={100}/></div>
      <div className="field"><label htmlFor="email">E-post *</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254}/></div>
      <div className="field full"><label htmlFor="message">Din fråga *</label><textarea id="message" name="message" required rows={6} maxLength={5000} defaultValue={context ? 'Jag är intresserad av '+context+'. ' : ''} placeholder="Vilken modell eller vilket utförande funderar du på?"/></div>
      <p className="privacy-note full">Uppgifterna stannar i webbläsaren tills du lämnar sidan. <Link href="/integritet">Läs om integritet</Link>.</p>
      <button type="submit" className="button dark full">Testa formuläret <Arrow/></button>
    </>}
  </form>;
}
