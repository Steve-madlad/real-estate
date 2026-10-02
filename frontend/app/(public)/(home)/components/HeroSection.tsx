'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Building2,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFiltersStore } from '@/store/filter-store';

const TRENDING_SEARCHES = [
  'New York',
  'Los Angeles',
  'Miami',
  'Austin',
  'Seattle',
  'San Francisco',
];

export default function HeroSection() {
  const { filters, setFilters } = useFiltersStore();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('All');
  const [locationLoading, setLocationLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (queryToSearch?: string) => {
    const q = queryToSearch !== undefined ? queryToSearch : searchQuery;
    if (!q.trim() && propertyType === 'All') {
      router.push('/search');
      return;
    }

    try {
      setLocationLoading(true);
      const params = new URLSearchParams();
      if (q.trim()) {
        params.set('location', q.trim());
        setFilters({ ...filters, location: q.trim() });
      }
      if (propertyType !== 'All') {
        params.set('propertyType', propertyType);
      }

      router.push(`/search?${params.toString()}`);
    } catch (error) {
      console.error('Search navigation error', error);
      toast.error('Could not process search. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  return (
    <section className="relative flex min-h-[92vh] w-full items-center justify-center overflow-hidden bg-zinc-950 text-white">
      {/* Background Image with Dark Vignette & Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/landing-splash.jpg"
          alt="Luxury modern rental home hero"
          fill
          priority
          sizes="100vw"
          className="scale-105 object-cover object-center opacity-85 transition-transform duration-1000 ease-out dark:opacity-65"
        />
        <div className="dark:from-background absolute inset-0 bg-gradient-to-t from-black/50 via-black/25 to-black/40 dark:via-black/50 dark:to-black/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/15 to-black/35 dark:via-black/40 dark:to-black/80" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        {/* Floating Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/90 shadow-xl backdrop-blur-md"
        >
          <Sparkles className="text-secondary size-3.5 animate-pulse" />
          <span>The Modern Way to Rent Real Estate</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl text-4xl leading-[1.1] font-black tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Find Your Next Home <br />
          <span className="bg-gradient-to-r from-rose-400 via-amber-300 to-rose-400 bg-clip-text text-transparent">
            Without the Hassle
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-2xl text-base leading-relaxed font-normal text-white/80 sm:text-lg md:text-xl"
        >
          Explore thousands of verified apartments, luxury villas, and townhomes. Apply online in
          minutes with transparent pricing.
        </motion.p>

        {/* Interactive Search Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-background/95 text-foreground mt-8 w-full max-w-3xl rounded-3xl border border-white/20 p-3 shadow-2xl backdrop-blur-xl sm:p-4 dark:border-white/10"
        >
          {/* Quick Property Type Tabs */}
          <div className="border-border/60 mb-3 flex scrollbar-none items-center gap-1.5 overflow-x-auto border-b pb-3 text-xs">
            {['All', 'Apartment', 'Villa', 'Townhouse', 'Cottage', 'Rooms'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setPropertyType(type)}
                className={`shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 font-medium transition-all ${
                  propertyType === type
                    ? 'bg-secondary text-secondary-foreground font-semibold shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {type === 'All' ? '✨ All Rentals' : type}
              </button>
            ))}
          </div>

          {/* Search Inputs Row */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSearch();
            }}
            className="flex flex-col items-center gap-2 sm:flex-row"
          >
            <div className="relative w-full flex-1">
              <MapPin className="text-secondary absolute top-1/2 left-3.5 size-4.5 -translate-y-1/2" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where to? (e.g. Los Angeles, Downtown, Seattle)"
                className="border-border/80 bg-background placeholder:text-muted-foreground focus-visible:ring-secondary/40 h-12 w-full rounded-2xl pr-4 pl-10 text-sm font-medium"
              />
            </div>

            <Button
              type="submit"
              disabled={locationLoading}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 w-full shrink-0 cursor-pointer gap-2 rounded-2xl px-7 font-bold shadow-md transition-transform active:scale-95 sm:w-auto"
            >
              {locationLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="size-4" />
                  <span>Search</span>
                </>
              )}
            </Button>
          </form>

          {/* Trending Searches Row */}
          <div className="text-muted-foreground mt-3 flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs sm:justify-start">
            <span className="text-foreground/80 font-semibold">Trending:</span>
            {TRENDING_SEARCHES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => {
                  setSearchQuery(city);
                  void handleSearch(city);
                }}
                className="hover:bg-muted hover:text-secondary cursor-pointer rounded-lg px-2 py-0.5 transition-colors"
              >
                {city}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Live Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid max-w-xl grid-cols-3 gap-4 text-center text-white/90 sm:gap-8"
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xl font-black text-white sm:text-2xl">
              <Building2 className="text-secondary size-4.5" /> 12,000+
            </div>
            <span className="mt-0.5 text-xs font-medium text-white/70">Verified Listings</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xl font-black text-white sm:text-2xl">
              <Users className="text-secondary size-4.5" /> 98%
            </div>
            <span className="mt-0.5 text-xs font-medium text-white/70">Tenant Satisfaction</span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-xl font-black text-white sm:text-2xl">
              <ShieldCheck className="text-secondary size-4.5" /> 100%
            </div>
            <span className="mt-0.5 text-xs font-medium text-white/70">Direct Applications</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
