'use client';

import { LocationResponse, useGetLocation } from '@/api/properties';
import FiltersBar from '@/components/FiltersBar';
import FiltersSidebar from '@/components/FiltersSidebar';
import Listings from '@/components/Listings';
import { useUpdateFiltersUrl } from '@/hooks/useUpdateUrl';
import { NAVBAR_HEIGHT } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { parseFilterParams, useFiltersStore } from '@/store/filter-store';
import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import Map from './components/Map';

export default function SearchPage() {
  return (
    <Suspense>
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
    <div
      className="col mx-auto w-full px-5"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, marginTop: `${NAVBAR_HEIGHT}px` }}
    >
      <FiltersBar
        locationInput={locationInput}
        onLocationInputChange={setLocationInput}
        onLocationSearch={() => searchLocation()}
      />
      <div className="just-between mb-5 flex-1 gap-3 overflow-hidden">
        <div
          className={cn(
            'h-full overflow-auto transition-all duration-300 ease-in-out',
            filtersSidebarOpen ? 'visible w-3/12 opacity-100' : 'invisible w-0 opacity-0',
          )}
        >
          <FiltersSidebar
            locationInput={locationInput}
            onLocationInputChange={setLocationInput}
            onLocationSearch={() => searchLocation()}
            initialFilterValues={initialFilterValues}
          />
        </div>
        <Map />
        <div className="basis-4/12 overflow-y-auto">
          <Listings />
        </div>
      </div>
    </div>
  );
}
