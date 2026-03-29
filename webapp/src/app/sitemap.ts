import type { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo';

const publicRoutes = [
  '',
  '/docs',
  '/docs/quick-start',
  '/docs/architecture',
  '/docs/ingestion',
  '/docs/risk-scoring',
  '/docs/threat-detection',
  '/docs/api/auth',
  '/docs/api/endpoints',
  '/docs/api/sdks',
];

export default function sitemap(): MetadataRoute.Sitemap {
  if (!seoConfig.shouldIndex) {
    return [];
  }

  const now = new Date();

  return publicRoutes.map((route) => ({
    url: `${seoConfig.siteUrl}${route || '/'}`,
    lastModified: now,
    changeFrequency: route.startsWith('/docs') ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : route === '/docs' ? 0.9 : 0.7,
  }));
}

