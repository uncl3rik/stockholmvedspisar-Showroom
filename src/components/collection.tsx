'use client';
import { useState } from 'react';
import { insertModels, insertVariants } from '@/data/insert-catalog';
import { ModelCard } from './showroom';
export default function Collection(){
const [query,setQuery]=useState('');
const list=insertModels.filter(m=>(m.name+' '+m.tagline+' '+insertVariants.filter(v=>v.modelId===m.id).map(v=>v.name).join(' ')).toLowerCase().includes(query.toLowerCase().trim()));
return <><div className="collection-search field"><label htmlFor="model-search">Sök insats</label><input id="model-search" type="search" placeholder="Exempelvis KARI 80 eller Contura i8" value={query} onChange={e=>setQuery(e.target.value)}/></div><p className="collection-result-count" role="status">{list.length} {list.length===1?'insatsserie':'insatsserier'}</p><div className="model-grid">{list.map(model=><ModelCard key={model.id} model={model}/>)}</div>{!list.length&&<p className="empty">Ingen insats matchar din sökning.</p>}<p className="media-credit" style={{marginTop:24}}>Bilderna visar modellserier. Utförande och tekniska uppgifter anges på respektive modellsida.</p></>}
