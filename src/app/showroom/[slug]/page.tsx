import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Intro, Arrow, SceneCard } from '@/components/showroom';
import { showroomScenes } from '@/data/showroom';

export function generateStaticParams(){return showroomScenes.map(s=>({slug:s.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const scene=showroomScenes.find(s=>s.slug===slug);
  return {title:scene ? scene.name+' — Showroom' : 'Miljön finns inte'};
}
export default async function Page({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const scene=showroomScenes.find(s=>s.slug===slug);
  if(!scene)notFound();
  return <><Intro label="SHOWROOM / UNDER UTVECKLING" title={scene.name} description="Här tar nästa showroom form."/><section className="shell page-content"><Link href="/kollektion" className="line-link">Utforska kaminerna <Arrow/></Link><div className="scene-grid scene-next">{showroomScenes.filter(s=>s.id!==scene.id).map((s)=><SceneCard key={s.id} scene={s} index={showroomScenes.indexOf(s)}/>)}</div></section></>;
}
