import { getPublicPropertyIds, SITE_URL } from '@/lib/seo';
import type { MetadataRoute } from 'next';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/search`, changeFrequency: 'daily', priority: 0.8 },
  ];
  const propertyIds = await getPublicPropertyIds();

  return [
    ...pages,
    ...propertyIds.map((id) => ({
      url: `${SITE_URL}/listing/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
