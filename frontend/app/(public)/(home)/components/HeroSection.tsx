'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFiltersStore } from '@/store/filter-store';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function HeroSection() {
  const { filters, setFilters } = useFiltersStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const router = useRouter();

  const handleRouter = async () => {
    if (!searchQuery) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery.trim())}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&fuzzyMatch=true`,
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        setFilters({ ...filters, location: searchQuery.trim() });
        const params = new URLSearchParams({
          location: searchQuery.trim(),
        });

        router.push(`/search?${params.toString()}`);
      }
    } catch (error) {
      console.error('Location search failed', error);
      toast.error('Location search failed');
    }
  };

  return (
    <section className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />

      <div className="abs-fill pointer-events-none bg-black/60" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="abs-center text-center"
      >
        <div className="mx-auto max-w-4xl px-16 sm:px-12">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="mb-8 text-xl text-white">
            Explore our wide range of rental properties tailored to fit your lifestyle and needs!
          </p>

          <div className="just-center">
            <Input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
              }}
              placeholder="Search by city, neighborhood or address"
              className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white pl-4"
            />

            <Button
              onClick={handleRouter}
              className="bg-secondary-500 hover:bg-secondary-600 h-12 rounded-none rounded-r-xl border-none text-white"
            >
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
