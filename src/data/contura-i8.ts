import type { MediaAsset, ProductModel, ProductVariant } from './showroom';
import type { KariConstruction } from './kari-construction';
const source = 'https://www.contura.eu/sv-se/kamin/spiskassett-och-kamininsats/contura-i8';
const brochure = 'https://www.contura.eu/download/18.2dab32f7171c2a0e52210c08/1593521458335/kbr_contura_i8_se.pdf';
export const conturaAsset: MediaAsset = {
  id:'contura-i8-product',kind:'drawing',src:'/images/inserts/liggande.svg',alt:'Liggande insats, måttsatt principskiss',credit:'Stockholm Vedspisar · principskiss',sourceUrl:source,modelId:'model-contura-i8',focalPoint:'50% 50%',rights:'permission-confirmed',
};
export const conturaModel: ProductModel = {
  id:'model-contura-i8',slug:'liggande',name:'Liggande',brand:'',category:'insert',glazing:'front',glazingOptions:['front','corner','panorama'],
  tagline:'Frontglas, en eller två glassidor.',
  description:'En neutral utgångspunkt för en egen platsbyggd eldstad. Utforska proportioner, glas och omramning.',
  designNotes:['Yttermåtten styr skissens proportioner.','Glas, ram och omramning visas schematiskt.','Skissen är inte ett bygg- eller installationsunderlag.'],
  coverAssetId:conturaAsset.id,assetIds:[conturaAsset.id],variantIds:['variant-contura-i8'],sourceUrl:source,
};
export const conturaVariant: ProductVariant = {
  id:'variant-contura-i8',modelId:conturaModel.id,name:'Liggande',sku:null,sourceUrl:source,sourceName:'Contura',verifiedOn:'2026-10-17',
  specifications:{'Nominell effekt':'7 kW','Bredd × höjd × djup':'735 × 530 × 365 mm','Glasutförande':'Front, front + en sida eller front + båda sidor'},
  assetIds:[conturaAsset.id],issues:['Glasutförandena är designval för en neutral principskiss.'],
  documentLinks:[{label:'Produktuppgifter hos Contura',url:source},{label:'Contura i8/i8G – produktbroschyr med mått',url:brochure}],
};
export const conturaConstruction: KariConstruction = {
  sideGlazing:true,dimensionsMm:{width:735,height:530,depth:365},dimensionsStatus:'verified',sourceDimensions:'735 × 530 × 365 mm',conversion:null,
  minimumEnclosureMm:null,fireboard:null,glbPath:null,builtInWoodCompartment:false,tunnel:false,
};
