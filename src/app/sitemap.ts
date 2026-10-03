import { siteUrl } from '@/lib/site';
import type { MetadataRoute } from 'next';
import { models,showroomScenes } from '@/data/showroom';
export default function sitemap():MetadataRoute.Sitemap{const base=siteUrl;return ['','/showroom','/kollektion','/om-kratki-pro','/kontakt','/integritet',...models.map(m=>`/kollektion/${m.slug}`),...showroomScenes.map(s=>`/showroom/${s.slug}`)].map(path=>({url:`${base}${path}`,changeFrequency:'monthly',priority:path?0.7:1}))}
