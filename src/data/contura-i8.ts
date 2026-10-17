import type { MediaAsset, ProductModel, ProductVariant } from './showroom';
import type { KariConstruction } from './kari-construction';
const source = 'https://www.contura.eu/sv-se/kamin/spiskassett-och-kamininsats/contura-i8';
const brochure = 'https://www.contura.eu/download/18.2dab32f7171c2a0e52210c08/1593521458335/kbr_contura_i8_se.pdf';
export const conturaAsset: MediaAsset = {
  id:'contura-i8-product',kind:'product',src:'/images/contura/i8.jpg',alt:'Contura i8 med gjutjärnsram och sidoglas, produktbild',credit:'Contura',sourceUrl:source,modelId:'model-contura-i8',focalPoint:'50% 50%',rights:'manufacturer-source',
  originalUrl:'https://assetstorecontura.nibe.se/hcms/v2.4/entity/dam/327212/storage/MDAzMjcyMTIvMC9wYW5lbC1tZWdhLTc2N3g3NjctanBnLy8vNDk4MzI2Nzk1',
};
export const conturaModel: ProductModel = {
  id:'model-contura-i8',slug:'contura-i8',name:'Contura i8',brand:'Contura',category:'insert',glazing:'corner',glazingOptions:['corner','panorama'],
  tagline:'En insats för din egen omramning.',
  description:'Contura i8 är en spiskassett med gjutjärnsram och sidoglas. Här kan du prova mått, material och placering för en egen omramning.',
  designNotes:['Demon använder ett gemensamt i8-val. Exakt glasutförande väljs senare.','Finns med glas på vänster, höger eller båda sidorna.','3D-vyn är schematisk. Sidoglas och modellens exakta detaljer återges inte ännu.','Inbyggnad, ventilation och säkerhetsavstånd behöver kontrolleras mot Conturas monteringsanvisningar.'],
  coverAssetId:conturaAsset.id,assetIds:[conturaAsset.id],variantIds:['variant-contura-i8'],sourceUrl:source,
};
export const conturaVariant: ProductVariant = {
  id:'variant-contura-i8',modelId:conturaModel.id,name:'Contura i8',sku:null,sourceUrl:source,sourceName:'Contura',verifiedOn:'2026-10-17',
  specifications:{'Nominell effekt':'7 kW','Bredd × höjd × djup':'735 × 530 × 365 mm','Glasutförande':'Väljs senare – gemensamt demoval'},
  assetIds:[conturaAsset.id],issues:['3D-vyn är en principskiss; exakt glasutförande väljs senare.'],
  documentLinks:[{label:'Produktuppgifter hos Contura',url:source},{label:'Contura i8/i8G – produktbroschyr med mått',url:brochure}],
};
export const conturaConstruction: KariConstruction = {
  dimensionsMm:{width:735,height:530,depth:365},dimensionsStatus:'verified',sourceDimensions:'735 × 530 × 365 mm',conversion:null,
  minimumEnclosureMm:null,fireboard:null,glbPath:null,builtInWoodCompartment:false,tunnel:false,
};
