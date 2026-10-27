import { i1Asset, i1Model, i1Variant } from './contura-i1';
import { conturaAsset, conturaModel, conturaVariant } from './contura-i8';
import { retailerAssets, retailerModels, retailerVariants } from './kratki-pro/collection';
/** Content IDs are independent of routes and future CMS storage. */
export type Glazing = 'front' | 'corner' | 'panorama' | 'round' | 'tunnel';
export const glazingLabels: Record<Glazing, string> = { front: 'Frontglas', corner: 'Hörnglas', panorama: 'Tresidigt glas', round: 'Rundat glas', tunnel: 'Tunnelglas' };
export type MediaAsset = { id:string; kind:'render'|'product'|'photo'|'drawing'; src:string; alt:string; credit:string; sourceUrl:string; modelId:string; variantId?:string; focalPoint:string; rights:'permission-confirmed'|'manufacturer-source'|'user-provided'; originalUrl?:string; viewLabel?:string };
/** Future 3D assets identify an exact variant, scale and orientation. */
export type Model3DAsset = { id:string; kind:'model3d'; src:string; variantId:string; configurationId?:string; format:'glb'; version:string; units:'meters'; upAxis:'Y'; posterAssetId:string; materialSlots:string[] };
export type ProductModel = { id:string; slug:string; name:string; brand:''|'Kratki Pro'|'Contura'; category:'insert'|'stove'; glazing:Glazing; glazingOptions?:Glazing[]; tagline:string; description:string; designNotes:string[]; coverAssetId:string; assetIds:string[]; variantIds:string[]; sourceUrl:string };
export type ProductVariant = { id:string; modelId:string; name:string; sku:string|null; sourceUrl:string; verifiedOn:string; specifications:Record<string,string>; assetIds:string[]; sourceName?:string; sourceProductId?:string; issues?:string[]; documentLinks?:{label:string;url:string}[]; options?:{name:string;key:string;values:{label:string;value:string}[]}[]; configurations?:{id:string;sourceId:string;sku:string|null;attributes:Record<string,string>;assetId:string|null}[] };
export type DesignSetting = { id:string; modelId:string; materials:{name:string;color:string}[]; placement:string; description:string; variantId?:string };
export type ShowroomScene = { id:string; slug:string; name:string; subtitle:string; description:string; assetIds:string[]; settingId:string; mood:string; room:string };
const manufacturer='https://pro.kratki.com/en/products/';
const asset=(id:string,file:string,modelId:string,alt:string,kind:MediaAsset['kind']='render'):MediaAsset=>({id,src:`/images/kratki/${file}.webp`,modelId,alt,kind,credit:'Kratki Pro',sourceUrl:manufacturer,focalPoint:'50% 58%',rights:'permission-confirmed'});
export const mediaAssets:MediaAsset[]=[
  ...retailerAssets, conturaAsset, i1Asset,
  asset('mb-room','MB_wizualizacja','model-mb','Kratki MB i en mörk kaklad eldstad med träbänk och öppen planlösning'),
  asset('nb-room','nb_wizualizacja','model-nb','Kratki NB med tresidigt glas, ljus omramning och ett ljust vardagsrum'),
  asset('vn-room','vn_wizualizacja','model-vn','Kratki VN integrerad i en ljus vägg i ett vardagsrum'),
  asset('lucy-room','lucy_wizualizacja','model-lucy','Kratki LUCY i en vit kaklad omramning mellan vardagsrum och kök'),
  asset('floki-room','floki_w','model-floki','Kratki FLOKI med frontglas i en varm modern vardagsrumsmiljö'),
  asset('sven-room','sven_wizualizacja2','model-sven','Fristående Kratki SVEN med rundad front i ett lugnt ljust vardagsrum'),
  asset('mb-product','mb-product','model-mb','Produktbild av en insats ur Kratki MB-serien','product'),
  asset('nb-product','nb-product','model-nb','Produktbild av en insats ur Kratki NB-serien','product'),
  asset('vn-product','vn-product','model-vn','Produktbild av en insats ur Kratki VN-serien','product'),
  asset('lucy-product','lucy-product','model-lucy','Produktbild av en insats ur Kratki LUCY-serien','product'),
];
export const models:ProductModel[]=[
  ...retailerModels, conturaModel, i1Model,
  {id:'model-nb',slug:'nb',name:'NB',brand:'Kratki Pro',category:'insert',glazing:'panorama',tagline:'Elden, från fler perspektiv.',description:'Tre glasytor låter elden vara närvarande från flera delar av rummet. NB ger en tydlig utgångspunkt för en eldstad som får stå i centrum av möbleringen.',designNotes:['Eld synlig från tre sidor','En naturlig mittpunkt i öppen planlösning','Omramningen formar det slutliga uttrycket'],coverAssetId:'nb-room',assetIds:['nb-room','nb-product'],variantIds:['variant-nbc-black'],sourceUrl:manufacturer},
  {id:'model-mb',slug:'mb',name:'MB',brand:'Kratki Pro',category:'insert',glazing:'corner',tagline:'En del av arkitekturen.',description:'Låt eldstaden följa rummets linjer. MB-serien bjuder in till integrerade lösningar där glas, omramning och material bildar en sammanhängande helhet.',designNotes:['Hörnet blir en del av upplevelsen','För integrerade, platsbyggda gestaltningar','Material och proportioner sätter tonen'],coverAssetId:'mb-room',assetIds:['mb-room','mb-product'],variantIds:['variant-mbm-right'],sourceUrl:manufacturer},
  {id:'model-vn',slug:'vn',name:'VN',brand:'Kratki Pro',category:'insert',glazing:'corner',tagline:'Ett öppnare hörn.',description:'Hörnglaset ger elden en plats i två riktningar. En ren inramning och lyftlucka gör VN till en intressant utgångspunkt för ett arkitektoniskt uttryck.',designNotes:['Hörnglas med öppen känsla','Lyftlucka i den utvalda varianten','Lika intressant från soffan som från matbordet'],coverAssetId:'vn-room',assetIds:['vn-room','vn-product'],variantIds:['variant-vnl-480'],sourceUrl:manufacturer},
  {id:'model-lucy',slug:'lucy',name:'LUCY',brand:'Kratki Pro',category:'insert',glazing:'corner',tagline:'Värme med tydlig form.',description:'LUCY ger utrymme för en eldstad med personlig omramning. Utforska hur ljusa ytor, keramiska material och trä kan möta den mörka insatsen.',designNotes:['Insats för en egen gestaltning','Utvalt utförande med vänster hörnglas','Ljus omramning lyfter fram elden'],coverAssetId:'lucy-room',assetIds:['lucy-room','lucy-product'],variantIds:['variant-lucy-left'],sourceUrl:manufacturer},
  {id:'model-floki',slug:'floki',name:'FLOKI',brand:'Kratki Pro',category:'insert',glazing:'front',tagline:'En stilla fokuspunkt.',description:'En avskalad omramning gör brasan till rummets blickfång. FLOKI-serien finns med olika glasutföranden, för ett uttryck som kan anpassas till arkitekturen.',designNotes:['Serie med front- och hörnutföranden','Passar en lugn, integrerad gestaltning','Låt omgivande material ge karaktär'],coverAssetId:'floki-room',assetIds:['floki-room'],variantIds:['variant-floki-left'],sourceUrl:manufacturer},
];
export const variants:ProductVariant[]=[
  ...retailerVariants, conturaVariant, i1Variant,
  {id:'variant-mbm-right',modelId:'model-mb',name:'MBM · höger · böjt glas',sku:'MBM/P/BS/SG',verifiedOn:'2026-10-02',sourceUrl:'https://kratki.com/en/steel-fireplace-kratki-mbm-right-10-kw-o-200-bent-glass-57518',specifications:{'Nominell effekt':'10 kW','Verkningsgrad':'81 %','Bredd × höjd × djup':'775 × 1261 × 492 mm','Vikt':'174 kg','Rökutlopp':'Ø 200 mm','Maximal vedlängd':'50 cm'},assetIds:[]},
  {id:'variant-nbc-black',modelId:'model-nb',name:'NBC 500/500 · svart TERMOTEC',sku:'NBC/500/500/BLACK/BA1',verifiedOn:'2026-10-02',sourceUrl:'https://kratki.com/en/steel-fireplace-kratki-nbc-500-500-8-kw-lift-up-self-closing-door-black-thermotec-364485',specifications:{'Nominell effekt':'8 kW','Verkningsgrad':'83,5 %','Bredd × höjd × djup':'576 × 1470 × 719 mm','Vikt':'238 kg','Rökutlopp':'Ø 200 mm','Maximal vedlängd':'40 cm'},assetIds:[]},
  {id:'variant-vnl-480',modelId:'model-vn',name:'VNL 480/480 · lyftlucka',sku:'VNL/480/480',verifiedOn:'2026-10-02',sourceUrl:'https://kratki.com/en/steel-fireplace-kratki-vnl-480-480-8-kw-o-200-lift-up-59626',specifications:{'Nominell effekt':'8 kW','Verkningsgrad':'84 %','Bredd × höjd × djup':'599 × 1389 × 599 mm','Vikt':'195 kg','Rökutlopp':'Ø 200 mm'},assetIds:[]},
  {id:'variant-lucy-left',modelId:'model-lucy',name:'LUCY 12 · vänster',sku:'LUCY/12/L/NEW',verifiedOn:'2026-10-02',sourceUrl:'https://kratki.com/en/steel-fireplace-kratki-lucy-left-12-kw-o-200-209925',specifications:{'Nominell effekt':'12 kW','Bredd × höjd × djup':'759 × 1268 × 490 mm','Vikt':'207 kg','Rökutlopp':'Ø 200 mm'},assetIds:[]},
  {id:'variant-floki-left',modelId:'model-floki',name:'FLOKI S · vänster',sku:'FLOKI/S/L',verifiedOn:'2026-10-02',sourceUrl:'https://kratki.com/en/steel-fireplace-kratki-floki-s-left-8-kw-o-160-91578',specifications:{'Nominell effekt':'8 kW','Verkningsgrad':'79,7 %','Bredd × höjd × djup':'619 × 1143 × 469 mm','Vikt':'126 kg','Rökutlopp':'Ø 160 mm','Maximal vedlängd':'40 cm'},assetIds:[]},
];
export const settings:DesignSetting[]=[
  {id:'setting-dark',modelId:'model-mb',placement:'Integrerad hörneldstad',materials:[{name:'Mörk keramik',color:'#2c454a'},{name:'Trä',color:'#947c60'},{name:'Svart stål',color:'#242525'}],description:'Mörka keramiska ytor och en lång träbänk ger eldstaden en självklar plats i rummet. En gestaltning där kontrasten mellan eld och material får bära uttrycket.'},
  {id:'setting-light',modelId:'model-nb',placement:'Tresidigt glas i öppen planlösning',materials:[{name:'Ljus puts',color:'#c3bcad'},{name:'Natursten',color:'#91897b'},{name:'Svart stål',color:'#242525'}],description:'En ljus, vertikal volym möter den horisontella brasan. Tre glasytor öppnar upp elden mot rummet och låter den upplevas från flera håll.'},
];
export const showroomScenes:ShowroomScene[]=[
  {id:'scene-dark',slug:'mork-materialitet',name:'Mörk materialitet',subtitle:'Eld, keramik och trä.',description:'En eldstad med lika mycket närvaro när brasan har slocknat.',assetIds:['mb-room'],settingId:'setting-dark',mood:'Kontrastrik',room:'Öppen planlösning'},
  {id:'scene-light',slug:'ljus-arkitektur',name:'Ljus arkitektur',subtitle:'En brasa. Fler perspektiv.',description:'Elden som en öppen mittpunkt i ett ljust hem.',assetIds:['nb-room'],settingId:'setting-light',mood:'Avskalad',room:'Vardagsrum'},
];
export const getAsset=(id:string)=>{const a=mediaAssets.find(a=>a.id===id);if(!a)throw new Error(`Unknown asset: ${id}`);return a};
export const getModel=(id:string)=>{const m=models.find(m=>m.id===id);if(!m)throw new Error(`Unknown model: ${id}`);return m};
export const getSetting=(id:string)=>{const s=settings.find(s=>s.id===id);if(!s)throw new Error(`Unknown setting: ${id}`);return s};
