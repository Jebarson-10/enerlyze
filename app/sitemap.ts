import type { MetadataRoute } from 'next';
import {guides} from '@/lib/guides';
import {SITE_URL} from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_URL;
  return [
    { url: base + '/', changeFrequency: 'monthly', priority: 1 },
    { url: base + '/calculator', changeFrequency: 'monthly', priority: 0.9 },
    { url: base + '/business', changeFrequency: 'monthly', priority: 0.8 },
    { url: base + '/shop', changeFrequency: 'monthly', priority: 0.6 },
    { url: base + '/guides', changeFrequency: 'monthly', priority: 0.8 },
    { url: base + '/about', changeFrequency: 'yearly', priority: 0.6 },
    { url: base + '/enerlyzer', changeFrequency: 'yearly', priority: 0.7 },
    { url: base + '/methodology', changeFrequency: 'yearly', priority: 0.7 },
    ...guides.map(guide=>({url:`${base}/guides/${guide.slug}`,lastModified:new Date(`${guide.updated}T00:00:00Z`),changeFrequency:'yearly' as const,priority:0.7})),
  ];
}
