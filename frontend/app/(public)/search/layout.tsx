import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Rental Homes',
  description: 'Search available apartments and homes for rent.',
  alternates: { canonical: '/search' },
};

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return children;
}
