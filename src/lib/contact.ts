export const contactEmail = 'glittergruvanab@gmail.com';
export const formspreeEndpoint = 'https://formspree.io/f/mbgdvppa';
export type ContactFields = { name: string; email: string; message: string; draftSummary?: string; draftUrl?: string; website?: string };
export function contactPayload(fields: ContactFields) {
  const name=fields.name.trim(), email=fields.email.trim(), message=fields.message.trim();
  if (!name || name.length>100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || !message || message.length>5000) throw new Error('Fyll i namn, en giltig e-postadress och ett meddelande.');
  return {name,email,message,_subject:'Förfrågan – Stockholm Vedspisar',_gotcha:fields.website??'',...(fields.draftSummary?{utkast:fields.draftSummary,utkast_lank:fields.draftUrl??''}:{})};
}
export async function submitContact(fields: ContactFields, request: typeof fetch = fetch) {
  const payload=contactPayload(fields);
  const response=await request(formspreeEndpoint,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
  if (!response.ok) throw new Error(response.status===429?'För många försök. Vänta en stund eller mejla oss direkt.':'Meddelandet kunde inte skickas. Försök igen eller använd din mejlapp.');
}
