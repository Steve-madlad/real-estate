import type { Metadata } from 'next';
import CallToActionSection from './components/CallToActionSection';
import DiscoverSection from './components/DiscoverSection';
import FeaturesSection from './components/FeaturesSection';
import HeroSection from './components/HeroSection';

export const metadata: Metadata = {
  title: 'Find Your Next Rental Home',
  description: 'Explore homes and apartments for rent and find a place that feels right for you.',
  alternates: { canonical: '/' },
};

export default function page() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
    </>
  );
}
