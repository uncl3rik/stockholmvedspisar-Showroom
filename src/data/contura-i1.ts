import type { MediaAsset, ProductModel, ProductVariant } from './showroom';
import type { KariConstruction } from './kari-construction';
const source = 'https://www.contura.eu/sv-se/kamin/spiskassett-och-kamininsats/contura-i1';
const manual = 'https://www.contura.eu/download/18.1e24a2d619275abc03e503/1740731783768/iav_Contura_i1_no.pdf';
export const i1Asset: MediaAsset = { id:'contura-i1-product',kind:'drawing',src:'/images/inserts/staende.svg',alt:'Stående insats, måttsatt principskiss',credit:'Stockholm Vedspisar · principskiss',sourceUrl:source,modelId:'model-contura-i1',focalPoint:'50% 50%',rights:'permission-confirmed' };
export const i1Model: ProductModel = {
  id:'model-contura-i1',slug:'staende',name:'Stående',brand:'',category:'insert',glazing:'front',tagline:'Stående proportioner med frontglas.',
  description:'En neutral utgångspunkt för en egen platsbyggd eldstad. Utforska proportioner, glas och omramning.',
  designNotes:['Yttermåtten styr skissens proportioner.','Glas, ram och omramning visas schematiskt.','Skissen är inte ett bygg- eller installationsunderlag.'],
  coverAssetId:i1Asset.id,assetIds:[i1Asset.id],variantIds:['variant-contura-i1'],sourceUrl:source,
};
export const i1Variant: ProductVariant = {
  id:'variant-contura-i1',modelId:i1Model.id,name:'Stående',sku:null,sourceUrl:source,sourceName:'Contura',verifiedOn:'2026-10-21',
  specifications:{'Nominell effekt':'5 kW','Bredd × höjd × djup':'480 × 550 × 350 mm','Utförande':'Fyrsidig ram'},assetIds:[i1Asset.id],
  documentLinks:[{label:'Produktuppgifter hos Contura',url:source},{label:'Contura i1 – mått och montering (norska)',url:manual}],
};
export const i1Construction: KariConstruction = {
  sideGlazing:false,dimensionsMm:{width:480,height:550,depth:350},dimensionsStatus:'verified',sourceDimensions:'480 × 550 × 350 mm (fyrsidig ram)',conversion:null,
  minimumEnclosureMm:null,fireboard:{thicknessMm:100,verified:true},glbPath:null,builtInWoodCompartment:false,tunnel:false,
};
