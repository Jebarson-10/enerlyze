import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.enerlyze.in';
  return [
    { url: base + '/', changeFrequency: 'monthly', priority: 1 },
    { url: base + '/calculator', changeFrequency: 'monthly', priority: 0.9 },
    { url: base + '/business', changeFrequency: 'monthly', priority: 0.8 },
    { url: base + '/shop', changeFrequency: 'monthly', priority: 0.6 },
  ];
}
