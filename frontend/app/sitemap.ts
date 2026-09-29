import { getPublicPropertyIds, SITE_URL } from '@/lib/seo';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const propertyIds = await getPublicPropertyIds();

  return [
    {
      url: SITE_URL,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/search?propertyType=Apartment`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/search?propertyType=Villa`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/search?propertyType=Townhouse`,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...propertyIds.map((id) => ({
      url: `${SITE_URL}/listing/${id}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
