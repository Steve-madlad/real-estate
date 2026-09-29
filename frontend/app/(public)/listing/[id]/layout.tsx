import { DEFAULT_OG_IMAGE, getSeoProperty } from '@/lib/seo';
import type { Metadata } from 'next';

type ListingLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: ListingLayoutProps): Promise<Metadata> {
  const { id } = await params;
  const property = await getSeoProperty(id);
  const canonical = `/listing/${encodeURIComponent(id)}`;
  const location = [property?.location?.city, property?.location?.state].filter(Boolean).join(', ');
  const title = property
    ? `${property.name}${location ? ` for Rent in ${location}` : ' for Rent'}`
    : 'Rental Listing';
  const description =
    property?.description.trim().slice(0, 160) ||
    'View this rental property and explore its details.';
  const image = property?.photoUrls?.[0] || DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default function ListingLayout({ children }: ListingLayoutProps) {
  return children;
}
