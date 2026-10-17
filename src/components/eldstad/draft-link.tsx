'use client';
import { useState } from 'react';
export default function DraftLink({ href }: {href: string}) {
  const [status, setStatus] = useState('');
  const [manual, setManual] = useState('');
  async function copy() {
    const url = new URL(href, window.location.origin).href;
    try { await navigator.clipboard.writeText(url); setStatus('Länken är kopierad.'); setManual(''); }
    catch { setManual(url); setStatus('Kopiera länken i fältet nedan.'); }
  }
  return <div className="draft-share"><button type="button" className="line-link" onClick={copy}>Kopiera länk till utkastet</button><p role="status">{status}</p>{manual && <input aria-label="Delbar länk till utkastet" readOnly value={manual} onFocus={e => e.target.select()} style={{width:'100%'}}/>}</div>;
}
