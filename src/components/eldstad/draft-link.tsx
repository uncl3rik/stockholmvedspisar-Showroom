'use client';
import { useState } from 'react';
import { draftFromHref, draftStorageKey, parseSavedDrafts, upsertDraft } from '@/lib/saved-drafts';
export default function DraftLink({ href }: {href: string}) {
  const [status, setStatus] = useState('');
  const [manual, setManual] = useState('');
  async function copy() {
    const url = new URL(href, window.location.origin).href;
    try { await navigator.clipboard.writeText(url); setStatus('Länken är kopierad.'); setManual(''); }
    catch { setManual(url); setStatus('Kopiera länken i fältet nedan.'); }
  }
  function save() {
    const draft=draftFromHref(href);
    if (!draft) {setStatus('Utkastet kunde inte sparas. Välj en insats först.');return;}
    try {localStorage.setItem(draftStorageKey,JSON.stringify(upsertDraft(parseSavedDrafts(localStorage.getItem(draftStorageKey)),draft)));setStatus('Sparat på den här enheten. Du kan välja utkastet i kontaktformuläret.');}
    catch {setStatus('Webbläsaren kunde inte spara. Ladda ner utkastet eller kopiera länken istället.');}
  }
  function download() {
    const draft=draftFromHref(href);
    if (!draft) {setStatus('Välj en insats först.');return;}
    const text='MITT ELDSTADSUTKAST\n\n'+draft.summary+'\n\nÖppna eller fortsätt designa:\n'+new URL(draft.href,window.location.origin).href+'\n\nEndast för inspiration – inte ett bygg- eller installationsunderlag.\n';
    const url=URL.createObjectURL(new Blob(['\uFEFF'+text],{type:'text/plain;charset=utf-8'}));
    const a=document.createElement('a');a.href=url;a.download='eldstadsutkast.txt';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Utkastet har laddats ner som text med en länk tillbaka till din design.');
  }
  return <div className="draft-share"><div style={{display:'flex',flexWrap:'wrap',gap:16}}><button type="button" className="line-link" onClick={save}>Spara min design</button><button type="button" className="line-link" onClick={download}>Ladda ner utkast</button><button type="button" className="line-link" onClick={copy}>Kopiera länk till utkastet</button></div><p role="status">{status}</p>{manual && <input aria-label="Delbar länk till utkastet" readOnly value={manual} onFocus={e => e.target.select()} style={{width:'100%'}}/>}</div>;
}
