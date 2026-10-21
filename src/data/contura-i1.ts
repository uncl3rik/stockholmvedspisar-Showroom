import type { MediaAsset, ProductModel, ProductVariant } from './showroom';
import type { KariConstruction } from './kari-construction';
const source = 'https://www.contura.eu/sv-se/kamin/spiskassett-och-kamininsats/contura-i1';
const manual = 'https://www.contura.eu/download/18.1e24a2d619275abc03e503/1740731783768/iav_Contura_i1_no.pdf';
export const i1Asset: MediaAsset = { id:'contura-i1-product',kind:'product',src:'/images/contura/i1.jpg',alt:'Contura i1, stående insats med frontglas',credit:'Contura · bild tillhandahållen av Stockholm Vedspisar',sourceUrl:source,modelId:'model-contura-i1',focalPoint:'50% 50%',rights:'user-provided' };
export const i1Model: ProductModel = {
  id:'model-contura-i1',slug:'contura-i1',name:'Contura i1',brand:'Contura',category:'insert',glazing:'front',tagline:'Ett stående uttryck.',
  description:'En kompakt insats med frontglas och stående proportioner. Utgångspunkten för en egen platsbyggd eldstad.',
  designNotes:['Demon utgår från fyrsidig ram, 480 × 550 × 350 mm.','Produktbilden visar serien. 3D-vyn är en förenklad principskiss.','Konstruktion, ventilation och säkerhetsavstånd kontrolleras enligt Conturas anvisningar.'],
  coverAssetId:i1Asset.id,assetIds:[i1Asset.id],variantIds:['variant-contura-i1'],sourceUrl:source,
};
export const i1Variant: ProductVariant = {
  id:'variant-contura-i1',modelId:i1Model.id,name:'Contura i1 · fyrsidig ram',sku:null,sourceUrl:source,sourceName:'Contura',verifiedOn:'2026-10-21',
  specifications:{'Nominell effekt':'5 kW','Bredd × höjd × djup':'480 × 550 × 350 mm','Utförande':'Fyrsidig ram'},assetIds:[i1Asset.id],
  documentLinks:[{label:'Produktuppgifter hos Contura',url:source},{label:'Contura i1 – mått och montering (norska)',url:manual}],
};
export const i1Construction: KariConstruction = {
  dimensionsMm:{width:480,height:550,depth:350},dimensionsStatus:'verified',sourceDimensions:'480 × 550 × 350 mm (fyrsidig ram)',conversion:null,
  minimumEnclosureMm:null,fireboard:{thicknessMm:100,verified:true},glbPath:null,builtInWoodCompartment:false,tunnel:false,
};
