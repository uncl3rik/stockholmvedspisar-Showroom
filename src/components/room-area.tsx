'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { designHref, parseArea, type DesignPreferences } from '@/lib/fireplace-design';
import { Arrow } from './ui-icons';

export default function RoomArea({modelSlug,variantId,preferences}:{modelSlug:string;variantId:string;preferences:DesignPreferences}){
  const router=useRouter();
  const [value,setValue]=useState(preferences.kvm||'');
  const [error,setError]=useState('');
  return <form className="room-area-form" onSubmit={e=>{
    e.preventDefault();
    const area=parseArea(value);
    if(value.trim()&&area===null){setError('Ange en yta mellan 0,01 och 10 000 m², med högst två decimaler.');return;}
    setError('');
    router.push(designHref('rum',modelSlug,variantId,{...preferences,kvm:area?.toString()}),{scroll:false});
  }}>
    <div className="field"><label htmlFor="room-area">Rummets yta i m²</label><input id="room-area" name="kvm" type="text" inputMode="decimal" placeholder="Exempelvis 35" value={value} onChange={e=>setValue(e.target.value)} aria-describedby="area-help area-error" aria-invalid={Boolean(error)}/><p id="area-help" className="quiet">Ange ytan på rummet där eldstaden ska stå.</p></div>
    <p id="area-error" role="alert">{error}</p>
    <button className="button dark" type="submit">Spara rumsytan <Arrow/></button>
    {preferences.kvm&&<p className="quiet" role="status">Sparad rumsyta: {preferences.kvm.replace('.',',')} m²</p>}
  </form>;
}
