import type { VisualPreferences } from './eldstad/configuration';
export type DesignStep = 'insats' | 'utforande' | 'rum';
export type EnclosureShape = 'fyrkantig' | 'rektangular';
export type FlueConnection = 'topp' | 'bak' | 'ny' | 'vet-ej';
export type Placement = 'vagg' | 'horn' | 'mitt';
export const placementLabels = { vagg: 'Mot vägg', horn: 'Hörn', mitt: 'Fristående mitt i rum' } as const;
export const connectionLabels = { topp: 'Toppansluten', bak: 'Bakansluten', ny: 'Ny skorsten', 'vet-ej': 'Vet ej' } as const;
export const visualizationNotice = 'Designverktyget är endast till för inspiration. Visualiseringen och måtten är inte ett bygg- eller installationsunderlag. Konstruktion, brandskydd och säkerhetsavstånd kontrolleras enligt tillverkarens anvisningar för vald insats.';
export type DesignPreferences = { form?: EnclosureShape; anslutning?: FlueConnection; kvm?: string; placering?: Placement; konfiguration?: string } & VisualPreferences;
/** Preferences are a visual brief, not a verified construction specification.
 * Future geometry uses millimetres; room area is square metres.
 */
export type FireplaceDesign = {
  version: 1;
  visual?: VisualPreferences;
  configurationId?: string;
  insert: { modelId: string; variantId: string } | null;
  enclosure: { shape: EnclosureShape | null; flueConnection: FlueConnection | null; systemId: string | null; finishId: string | null; dimensionsMm: {width:number;height:number;depth:number} | null } | null;
  room: { areaM2: number | null; assetId: string | null; placementKind?: Placement; placement: {xMm:number;yMm:number;zMm:number;rotationDeg:number} | null } | null;
};
type Model = { id:string; slug:string; variantIds:string[] };
type Variant = { id:string; modelId:string; configurations?: {id:string}[] };
export type DesignQuery = { [K in 'modell'|'variant'|'steg'|'form'|'anslutning'|'kvm'|'dim'|'mat'|'kul'|'hy'|'ved'|'placering'|'konfiguration'|'format'|'glas'|'profil'|'hyllm'|'vedm']?: string|string[] };
export const designSteps: {id:DesignStep;label:string}[]=[
{id:'insats',label:'Välj insats'},{id:'utforande',label:'Välj utförande'},{id:'rum',label:'Placera i rum'}
];
export function parseArea(value: unknown): number | null {
  if(typeof value !== 'string' || !/^\d{1,5}([.,]\d{1,2})?$/.test(value.trim()))return null;
  const n=Number(value.trim().replace(',','.'));
  return Number.isFinite(n)&&n>0&&n<=10000?n:null;
}
export function resolveDesign(query:DesignQuery,models:Model[],variants:Variant[]):{design:FireplaceDesign;step:DesignStep}{
  // The supplied catalogue is the explicit allowlist, independent of legacy categories.
  const slug = query.modell === 'contura-i8' ? 'liggande' : query.modell === 'contura-i1' ? 'staende' : query.modell;
  const model=models.find(m=>m.slug===slug || m.slug===query.modell);
  const variant=variants.find(v=>v.id===query.variant&&v.modelId===model?.id&&model?.variantIds.includes(v.id));
  const insert=model&&variant?{modelId:model.id,variantId:variant.id}:null;
  const requestedStep = query.steg === 'omramning' ? 'utforande' : query.steg;
  const step=insert&&designSteps.some(s=>s.id===requestedStep)?requestedStep as DesignStep:'insats';
  const visual: VisualPreferences = {};
  for(const key of ['dim','mat','kul','hy','ved','glas','profil','hyllm','vedm'] as const) { const value=query[key]; if(insert && typeof value==='string' && value.length>0 && value.length<=64) visual[key]=value; }
  const shape=query.form==='fyrkantig'||query.form==='rektangular'?query.form:null;
  const flueConnection=typeof query.anslutning==='string' && Object.hasOwn(connectionLabels,query.anslutning)?query.anslutning as FlueConnection:null;
  const placement=typeof query.placering==='string' && Object.hasOwn(placementLabels,query.placering)?query.placering as Placement:undefined;
  const configurationId=variant?.configurations?.find(c=>c.id===query.konfiguration)?.id;
  const areaM2=parseArea(query.kvm);
  return {design:{version:1,insert,...(configurationId?{configurationId}:{}),...(Object.keys(visual).length ? {visual} : {}),enclosure:insert&&(shape||flueConnection)?{shape,flueConnection,systemId:null,finishId:null,dimensionsMm:null}:null,room:insert&&(areaM2!==null||placement)?{areaM2,assetId:null,placement:null,...(placement?{placementKind:placement}:{})}:null},step};
}
export function designPreferences(design:FireplaceDesign):DesignPreferences{
  return {...design.visual,form:design.enclosure?.shape||undefined,anslutning:design.enclosure?.flueConnection||undefined,kvm:design.room?.areaM2?.toString(),placering:design.room?.placementKind,konfiguration:design.configurationId};
}
export function designHref(step:DesignStep | 'omramning',modelSlug?:string,variantId?:string,preferences:DesignPreferences={}){
  const query=new URLSearchParams({steg:step === 'omramning' ? 'utforande' : step});
  if(modelSlug&&variantId){query.set('modell',modelSlug);query.set('variant',variantId);
  for(const [key,value]of Object.entries(preferences))if(value)query.set(key,value);}
  query.sort();
  return '/designa?'+query;
}
