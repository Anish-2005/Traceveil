import type { MetadataRoute } from 'next';
import { seoConfig } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  if (!seoConfig.shouldIndex) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
      sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
      host: seoConfig.siteUrl,
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/docs',
          '/docs/quick-start',
          '/docs/architecture',
          '/docs/ingestion',
          '/docs/risk-scoring',
          '/docs/threat-detection',
          '/docs/api/auth',
          '/docs/api/endpoints',
          '/docs/api/sdks',
        ],
        disallow: [
          '/login',
          '/dashboard',
          '/analytics',
          '/entities',
          '/events',
          '/models',
          '/users',
          '/api/',
        ],
      },
    ],
    sitemap: `${seoConfig.siteUrl}/sitemap.xml`,
    host: seoConfig.siteUrl,
  };
}

