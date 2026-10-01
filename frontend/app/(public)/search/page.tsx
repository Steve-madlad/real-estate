'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { MapPin, Map as MapIcon, List, SlidersHorizontal } from 'lucide-react';
import { LocationResponse, useGetLocation } from '@/api/properties';
import FiltersBar from '@/components/FiltersBar';
import FiltersSidebar from '@/components/FiltersSidebar';
import Listings from '@/components/Listings';
import { useUpdateFiltersUrl } from '@/hooks/useUpdateUrl';
import { cn } from '@/lib/utils';
import { parseFilterParams, useFiltersStore } from '@/store/filter-store';
import { Button } from '@/components/ui/button';
import Map from './components/Map';

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-64px)] w-full items-center justify-center">
          <div className="border-secondary size-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      }
    >
      <Search />
    </Suspense>
  );
}

function Search() {
  const params = useSearchParams();
  const { filters, setFilters, filtersSidebarOpen } = useFiltersStore();
  const location = params.get('location');
  const initialFilterValues = parseFilterParams(params);
  const [locationInput, setLocationInput] = useState(location || filters.location);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const updateUrl = useUpdateFiltersUrl();

  const onLocationSuccess = useCallback(
    (data: LocationResponse) => {
      if (!data) return;
      setFilters({ location: data.location, coordinates: [data.lat, data.lng] });
      updateUrl({ location: data.location });
    },
    [setFilters, updateUrl],
  );

  const { refetch: searchLocation } = useGetLocation(locationInput, {
    enabled: false,
    onSuccess: onLocationSuccess,
    onError: () => {
      toast.error('Failed to fetch location. Please try again.');
    },
  });

  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (Object.keys(initialFilterValues).length > 0) {
      setFilters(initialFilterValues);
    }

    if (initialFilterValues.location) {
      searchLocation();
    }
  }, [params, searchLocation, setFilters]);

  return (
    <div className="relative flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden px-3 sm:px-6">
      {/* Top Filter Bar */}
      <FiltersBar
        locationInput={locationInput}
        onLocationInputChange={setLocationInput}
        onLocationSearch={() => searchLocation()}
      />

      {/* Main Split Interface */}
      <div className="relative flex flex-1 gap-4 overflow-hidden py-3">
        {/* Under xl breakpoint (< 1280px): Modal Dialog */}
        {filtersSidebarOpen && (
          <div
            className="animate-in fade-in-0 fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-xs duration-200 sm:p-6 xl:hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                useFiltersStore.getState().toggleFiltersSidebar();
              }
            }}
          >
            <div className="bg-card border-border animate-in zoom-in-95 flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border shadow-2xl duration-200">
              <FiltersSidebar
                locationInput={locationInput}
                onLocationInputChange={setLocationInput}
                onLocationSearch={() => searchLocation()}
                initialFilterValues={initialFilterValues}
              />
            </div>
          </div>
        )}

        {/* xl breakpoint and above (>= 1280px): Inline Collapsible Sidebar */}
        {filtersSidebarOpen && (
          <div className="animate-in slide-in-from-left z-10 hidden h-full w-80 shrink-0 duration-200 xl:block">
            <FiltersSidebar
              locationInput={locationInput}
              onLocationInputChange={setLocationInput}
              onLocationSearch={() => searchLocation()}
              initialFilterValues={initialFilterValues}
            />
          </div>
        )}

        {/* Map Column (Hidden on mobile when in list view) */}
        <div
          className={cn(
            'border-border/80 relative h-full flex-1 overflow-hidden rounded-2xl border',
            mobileView === 'list' ? 'hidden md:flex' : 'flex w-full',
          )}
        >
          <Map />
        </div>

        {/* Listings Column (Hidden on mobile when in map view) */}
        <div
          className={cn(
            'h-full shrink-0 overflow-hidden',
            mobileView === 'map'
              ? 'hidden md:block md:w-[420px] lg:w-[480px]'
              : 'w-full md:w-[420px] lg:w-[480px]',
          )}
        >
          <Listings />
        </div>
      </div>

      {/* Floating Mobile Toggle (Show Map / Show List) */}
      <div className="fixed bottom-6 left-1/2 z-30 -translate-x-1/2 md:hidden">
        <Button
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="bg-foreground text-background hover:bg-foreground/90 border-border/40 gap-2 rounded-full border px-5 py-2.5 text-xs font-bold shadow-2xl backdrop-blur-md"
        >
          {mobileView === 'list' ? (
            <>
              <MapIcon className="text-secondary size-4" />
              <span>Show Map</span>
            </>
          ) : (
            <>
              <List className="text-secondary size-4" />
              <span>Show List</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
