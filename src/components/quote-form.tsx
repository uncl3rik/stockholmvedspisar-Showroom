'use client';
import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Arrow } from './ui-icons';
import { draftFromHref, draftStorageKey, parseSavedDrafts, type SavedDraft } from '@/lib/saved-drafts';
import { contactEmail, submitContact, contactPayload } from '@/lib/contact';

export default function QuoteForm({context,draftHref}:{context:string;draftHref?:string|null}) {
  const [saved,setSaved]=useState<SavedDraft[]>([]);
  const [draft,setDraft]=useState<SavedDraft|null>(()=>draftFromHref(draftHref));
  const [include,setInclude]=useState(Boolean(draftHref));
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [message,setMessage]=useState(draftHref?'Hej! Jag vill prata om mitt eldstadsutkast.':context?'Jag är intresserad av '+context+'. ':'');
  const [state,setState]=useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [feedback,setFeedback]=useState('');
  useEffect(()=>{try {setSaved(parseSavedDrafts(localStorage.getItem(draftStorageKey)));} catch {setSaved([]);}},[]);
  function fields(form: HTMLFormElement) {
    return {name,email,message,website:String(new FormData(form).get('website')??''),...(include&&draft?{draftSummary:draft.summary,draftUrl:new URL(draft.href,window.location.origin).href}:{})};
  }
  async function send(e:FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(state==='sending')return;
    const values=fields(e.currentTarget);
    setState('sending');setFeedback('');
    try {await submitContact(values);setState('sent');}
    catch(error){setState('error');setFeedback(error instanceof Error && error.name==='Error'?error.message:'Vi kunde inte bekräfta att meddelandet kom fram. Kontrollera anslutningen eller mejla oss direkt.');}
  }
  function mail(form: HTMLFormElement) {
    if(!form.reportValidity())return;
    try {
      const values=fields(form);contactPayload(values);
      const body=`Namn: ${name}\nE-post: ${email}\n\n${message}${values.draftSummary?'\n\nMITT UTKAST\n'+values.draftSummary+'\n\n'+values.draftUrl:''}`;
      window.location.href=`mailto:${contactEmail}?subject=${encodeURIComponent('Min eldstad – Stockholm Vedspisar')}&body=${encodeURIComponent(body)}`;
      setFeedback('Mejlet öppnas i din mejlapp. Du behöver själv trycka på Skicka där.');
    } catch(error){setFeedback(error instanceof Error?error.message:'Kontrollera uppgifterna.');}
  }
  const choices=[...(draftFromHref(draftHref)?[draftFromHref(draftHref)!]:[]),...saved].filter((item,index,list)=>list.findIndex(d=>d.href===item.href)===index);
  return <form className="quote-form" onSubmit={send}>
    {state==='sent'?<div className="full" role="status"><h2>Tack för ditt meddelande.</h2><p>Din förfrågan har skickats{include&&draft?' tillsammans med ditt utkast':''}.</p><Link href="/" className="line-link">Till startsidan <Arrow/></Link></div>:<>
      <div className="full"><p>Skicka din fråga till oss eller mejla <a href={'mailto:'+contactEmail}>{contactEmail}</a>.</p></div>
      <fieldset className="full" style={{border:'1px solid var(--line)',padding:16,minWidth:0}}><legend>Din design – valfritt</legend>
        {choices.length>0?<div className="field"><label htmlFor="saved-draft">Välj ett utkast</label><select disabled={state==='sending'} id="saved-draft" value={draft?.href??''} onChange={e=>{setDraft(choices.find(d=>d.href===e.target.value)??null);setInclude(Boolean(e.target.value));}} style={{width:'100%',padding:12,background:'var(--paper)',color:'var(--ink)',fontSize:16}}><option value="">Ingen design vald</option>{choices.map(d=><option value={d.href} key={d.href}>{d.title}{saved.some(item=>item.href===d.href)?' · sparat '+new Date(d.savedAt).toLocaleDateString('sv-SE'): ' · aktuellt utkast'}</option>)}</select></div>:<p>Du kan spara en design i guiden och välja den här senare. <Link href="/">Börja designa</Link>.</p>}
        {draft&&<><label style={{display:'flex',gap:10,alignItems:'center',minHeight:44}}><input type="checkbox" checked={include} onChange={e=>setInclude(e.target.checked)} disabled={state==='sending'}/>Bifoga designen till mitt meddelande</label><p style={{whiteSpace:'pre-line',fontSize:'.85rem'}}>{draft.summary}</p><Link href={draft.href} className="line-link">Öppna designen <Arrow/></Link></>}
        <p className="quiet">Sparade designer finns bara i den här webbläsaren. Personliga kontaktuppgifter sparas inte här.</p>
      </fieldset>
      <div className="field"><label htmlFor="name">Namn *</label><input id="name" name="name" autoComplete="name" required maxLength={100} value={name} onChange={e=>setName(e.target.value)} disabled={state==='sending'}/></div>
      <div className="field"><label htmlFor="email">E-post *</label><input id="email" name="email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e=>setEmail(e.target.value)} disabled={state==='sending'}/></div>
      <div className="field full"><label htmlFor="message">Din fråga *</label><textarea id="message" name="message" required rows={6} maxLength={5000} value={message} onChange={e=>setMessage(e.target.value)} disabled={state==='sending'} placeholder="Berätta om din idé och vad du vill ha hjälp med."/></div>
      <div aria-hidden="true" style={{position:'absolute',left:'-10000px',width:1,height:1,overflow:'hidden'}}><label htmlFor="website">Webbplats</label><input id="website" name="website" tabIndex={-1} autoComplete="off"/></div>
      <p className="privacy-note full">Dina uppgifter och eventuell design skickas via Formspree så att vi kan svara på din förfrågan. <Link href="/integritet">Läs om integritet</Link>.</p>
      <p className="full" role={state==='error'?'alert':'status'}>{feedback}</p>
      <button type="submit" className="button dark full" disabled={state==='sending'}>{state==='sending'?'Skickar…':'Skicka förfrågan'} <Arrow/></button>
      <button type="button" className="line-link full" disabled={state==='sending'} onClick={e=>{const form=e.currentTarget.form;if(form)mail(form);}}>Öppna i min mejlapp <Arrow/></button>
    </>}
  </form>;
}

