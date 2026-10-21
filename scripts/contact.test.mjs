import test from 'node:test';
import assert from 'node:assert/strict';
import { contactPayload, submitContact, formspreeEndpoint } from '../src/lib/contact.ts';
const fields={name:' Test ',email:'test@example.com',message:' En fråga '};
test('payload trims fields and omits an unselected draft',()=>{
 const p=contactPayload(fields);assert.equal(p.name,'Test');assert.equal(p.message,'En fråga');assert.equal('utkast' in p,false);
});
test('selected draft includes summary and link',()=>{
 const p=contactPayload({...fields,draftSummary:'Puts',draftUrl:'https://example.com/designa'});assert.equal(p.utkast,'Puts');assert.equal(p.utkast_lank,'https://example.com/designa');
});
test('invalid fields never reach delivery',async()=>{
 let called=false;await assert.rejects(submitContact({...fields,email:'invalid'},async()=>{called=true;return new Response();}));assert.equal(called,false);
});
test('submission uses configured endpoint',async()=>{
 await submitContact(fields,async(url,options)=>{assert.equal(url,formspreeEndpoint);assert.equal(options.method,'POST');assert.equal(JSON.parse(options.body).email,fields.email);return new Response('{}',{status:200});});
});
test('server and network errors never become success',async()=>{
 await assert.rejects(submitContact(fields,async()=>new Response('{}',{status:422})),/kunde inte skickas/);
 await assert.rejects(submitContact(fields,async()=>new Response('{}',{status:429})),/För många/);
 await assert.rejects(submitContact(fields,async()=>{throw new TypeError('offline');}),/offline/);
});
