import CallToActionSection from './components/CallToActionSection';
import DiscoverSection from './components/DiscoverSection';
import FeaturesSection from './components/FeaturesSection';
import HeroSection from './components/HeroSection';

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
