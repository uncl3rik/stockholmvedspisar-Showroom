export type DesignStep = 'insats' | 'omramning' | 'rum';
export type EnclosureShape = 'fyrkantig' | 'rektangular';
export type FlueConnection = 'topp' | 'bak';
export type DesignPreferences = { form?: EnclosureShape; anslutning?: FlueConnection; kvm?: string };
/** Preferences are a visual brief, not a verified construction specification.
 * Future geometry uses millimetres; room area is square metres.
 */
export type FireplaceDesign = {
  version: 1;
  insert: { modelId: string; variantId: string } | null;
  enclosure: { shape: EnclosureShape | null; flueConnection: FlueConnection | null; systemId: string | null; finishId: string | null; dimensionsMm: {width:number;height:number;depth:number} | null } | null;
  room: { areaM2: number | null; assetId: string | null; placement: {xMm:number;yMm:number;zMm:number;rotationDeg:number} | null } | null;
};
type Model = { id:string; slug:string; variantIds:string[] };
type Variant = { id:string; modelId:string };
export type DesignQuery = { [K in 'modell'|'variant'|'steg'|'form'|'anslutning'|'kvm']?: string|string[] };
export const designSteps: {id:DesignStep;label:string}[]=[
{id:'insats',label:'Välj KARI'},{id:'omramning',label:'Välj utförande'},{id:'rum',label:'Placera i rum'}
];
export function parseArea(value: unknown): number | null {
  if(typeof value !== 'string' || !/^\d{1,5}([.,]\d{1,2})?$/.test(value.trim()))return null;
  const n=Number(value.trim().replace(',','.'));
  return Number.isFinite(n)&&n>0&&n<=10000?n:null;
}
export function resolveDesign(query:DesignQuery,models:Model[],variants:Variant[]):{design:FireplaceDesign;step:DesignStep}{
  // The supplied catalogue is the explicit allowlist, independent of legacy categories.
  const model=models.find(m=>m.slug===query.modell);
  const variant=variants.find(v=>v.id===query.variant&&v.modelId===model?.id&&model?.variantIds.includes(v.id));
  const insert=model&&variant?{modelId:model.id,variantId:variant.id}:null;
  const step=insert&&designSteps.some(s=>s.id===query.steg)?query.steg as DesignStep:'insats';
  const shape=query.form==='fyrkantig'||query.form==='rektangular'?query.form:null;
  const flueConnection=query.anslutning==='topp'||query.anslutning==='bak'?query.anslutning:null;
  const areaM2=parseArea(query.kvm);
  return {design:{version:1,insert,enclosure:insert&&(shape||flueConnection)?{shape,flueConnection,systemId:null,finishId:null,dimensionsMm:null}:null,room:insert&&areaM2!==null?{areaM2,assetId:null,placement:null}:null},step};
}
export function designPreferences(design:FireplaceDesign):DesignPreferences{
  return {form:design.enclosure?.shape||undefined,anslutning:design.enclosure?.flueConnection||undefined,kvm:design.room?.areaM2?.toString()};
}
export function designHref(step:DesignStep,modelSlug?:string,variantId?:string,preferences:DesignPreferences={}){
  const query=new URLSearchParams({steg:step});
  if(modelSlug&&variantId){query.set('modell',modelSlug);query.set('variant',variantId);
  for(const [key,value]of Object.entries(preferences))if(value)query.set(key,value);}
  return '/designa?'+query;
}
