import type { Metadata } from 'next';
import HeroSection from './components/HeroSection';
import FeaturedListingsSection from './components/FeaturedListingsSection';
import FeaturesSection from './components/FeaturesSection';
import DiscoverSection from './components/DiscoverSection';
import CallToActionSection from './components/CallToActionSection';

export const metadata: Metadata = {
  title: { absolute: 'Rentiful | Find Your Next Rental Home' },
  description:
    'Discover and rent verified luxury apartments, modern townhouses, and stylish homes with seamless online applications.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Rentiful | Find Your Next Rental Home',
    description:
      'Discover and rent verified luxury apartments, modern townhouses, and stylish homes with seamless online applications.',
  },
};

export default function HomePage() {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <FeaturedListingsSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
    </div>
  );
}
