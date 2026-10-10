'use client';
import { useState } from 'react';
import { models, variants } from '@/data/showroom';
import { catalogSummary } from '@/data/kratki-pro/collection';
import { ModelCard } from './showroom';
const filters=[{id:'all',name:'Alla modeller'},{id:'stove',name:'Kaminer'},{id:'insert',name:'Insatser'},{id:'round',name:'Rundat glas'},{id:'front',name:'Frontglas'},{id:'corner',name:'Hörnglas'},{id:'panorama',name:'Tresidigt'},{id:'tunnel',name:'Tunnelglas'}];
export default function Collection() {
  const [filter,setFilter]=useState('all');
  const [query,setQuery]=useState('');
  const list=models.filter(m => (filter==='all' || m.category===filter || (m.glazingOptions || [m.glazing]).includes(filter as typeof m.glazing)) && `${m.name} ${m.tagline} ${variants.filter(v => m.variantIds.includes(v.id)).map(v => v.name).join(' ')}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <><div className="catalog-intro"><p><strong>{catalogSummary.families} kaminfamiljer</strong> · {catalogSummary.products} utföranden · {catalogSummary.configurations} materialkonfigurationer</p><p>Kollektionen omfattar även fem insatsserier.</p></div><div className="collection-search field"><label htmlFor="model-search">Sök modellserie</label><input id="model-search" type="search" placeholder="Sök exempelvis ERIK, KARI eller REN" value={query} onChange={e=>setQuery(e.target.value)}/></div><div className="collection-toolbar" role="group" aria-label="Filtrera kollektionen">{filters.map(f=><button className="filter-button" key={f.id} aria-pressed={filter===f.id} onClick={()=>setFilter(f.id)}>{f.name}</button>)}</div><p className="collection-result-count" role="status">{list.length} {list.length===1?'modellserie':'modellserier'}</p><div className="model-grid">{list.map(m=><ModelCard key={m.id} model={m}/>)}</div>{!list.length&&<p className="empty">Ingen modellserie matchar ditt val. Prova ett annat namn eller filter.</p>}<p className="media-credit" style={{marginTop:40}}>Kaminutföranden från <a href={catalogSummary.sourceUrl} target="_blank" rel="noreferrer">Norrtelje Eldstäders Kratki Pro-sortiment</a>, hämtade {catalogSummary.retrievedOn}. Insatsserier från Kratki. Bilder kan visa andra kulörer inom samma utförande.</p></>;
}
