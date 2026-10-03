export const MAX_FILES=5;
export const MAX_FILE_SIZE=5*1024*1024;
export const ALLOWED_TYPES=['image/jpeg','image/png','image/webp'];
export function validateFile(file:File):string|null{return !ALLOWED_TYPES.includes(file.type)?'Välj bilder i JPG-, PNG- eller WebP-format.':file.size>MAX_FILE_SIZE?'Varje bild får vara högst 5 MB.':null}
export function hasImageSignature(bytes:Uint8Array,type:string){return type==='image/jpeg'?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:type==='image/png'?bytes.slice(0,8).join(',')==='137,80,78,71,13,10,26,10':type==='image/webp'?String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP':false}
