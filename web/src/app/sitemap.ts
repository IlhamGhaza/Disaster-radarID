import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { getDarwinAdvisories } from '@/lib/advisories';
import { DISASTER_CATEGORIES } from '@/lib/disasters/aggregator';
import { getAllMonitoredVolcanoes } from '@/lib/magma-status';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Core static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/map`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/disasters`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/safety-guide`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/volcanoes`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/advisories`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/data-sources`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Disaster category pages
  const categoryRoutes: MetadataRoute.Sitemap = DISASTER_CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/disasters/${cat.type}`,
    lastModified: now,
    changeFrequency: 'hourly',
    priority: 0.85,
  }));

  // Volcano pages from monitored volcanoes catalog
  const monitoredVolcanoes = getAllMonitoredVolcanoes();
  const volcanoRoutes: MetadataRoute.Sitemap = monitoredVolcanoes.map((v) => ({
    url: `${SITE_URL}/volcanoes/${v.volcanoSlug}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: v.level >= 2 ? 0.8 : 0.7,
  }));

  // Advisories from Darwin VAAC
  let advisoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const data = await getDarwinAdvisories();
    advisoryRoutes = (data.deduplicated || []).map((adv) => ({
      url: `${SITE_URL}/advisories/${adv.id}`,
      lastModified: new Date(adv.dtg),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch {
    // Fallback if feed unreachable
  }

  return [...staticRoutes, ...categoryRoutes, ...volcanoRoutes, ...advisoryRoutes];
}
