import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sweetcrust.rw';

// Runtime-only sitemap — no DB calls at build time
export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: BASE_URL + '/patisseries', changeFrequency: 'daily', priority: 0.9 },
    { url: BASE_URL + '/custom-cakes', changeFrequency: 'monthly', priority: 0.8 },
    { url: BASE_URL + '/gallery', changeFrequency: 'monthly', priority: 0.6 },
    { url: BASE_URL + '/contact', changeFrequency: 'monthly', priority: 0.6 },
  ];
}