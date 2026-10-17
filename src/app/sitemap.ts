import { siteUrl } from '@/lib/site';
import type { MetadataRoute } from 'next';
import { insertModels } from '@/data/insert-catalog';
export default function sitemap():MetadataRoute.Sitemap{return ['','/kollektion','/om-kratki-pro','/kontakt','/integritet',...insertModels.map(m=>'/kollektion/'+m.slug)].map(path=>({url:siteUrl+path,changeFrequency:'monthly',priority:path?0.7:1}))}
