'use client';

import { LocationResponse, useGetLocation } from '@/api/properties';
import { useUpdateFiltersUrl } from '@/hooks/useUpdateUrl';
import { cn, k } from '@/lib/utils';
import { useFiltersStore } from '@/store/filter-store';
import { Building, Funnel, Grid, House, List, Search, Trees } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { MdOutlineHouse } from 'react-icons/md';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { Select } from './ui/custom/Select';
import { Input } from './ui/input';

const minPriceOpitons = [
  { label: 'Any Min Price', value: 'any' },
  { label: `${k(500)}+`, value: '500' },
  { label: `${k(1000)}+`, value: '1000' },
  { label: `${k(1500)}+`, value: '1500' },
  { label: `${k(2000)}+`, value: '2000' },
  { label: `${k(3000)}+`, value: '3000' },
  { label: `${k(5000)}+`, value: '5000' },
  { label: `${k(10000)}+`, value: '10000' },
];

const maxPriceOpitons = [
  { label: 'Any Max Price', value: 'any' },
  { label: `${k(1000)}+`, value: '1000' },
  { label: `${k(2000)}+`, value: '2000' },
  { label: `${k(3000)}+`, value: '3000' },
  { label: `${k(5000)}+`, value: '5000' },
  { label: `${k(10000)}+`, value: '10000' },
];

const bedOptions = [
  { label: 'Any Beds', value: 'any' },
  { label: '1+ bed', value: '1' },
  { label: '2+ beds', value: '2' },
  { label: '3+ beds', value: '3' },
];

const bathOptions = [
  { label: 'Any baths', value: 'any' },
  { label: '1+ bath', value: '1' },
  { label: '2+ baths', value: '2' },
  { label: '3+ baths', value: '3' },
];

const propertyTypeOptions = [
  {
    label: (
      <>
        <House /> Rooms
      </>
    ),
    value: 'any',
  },
  {
    label: (
      <>
        <MdOutlineHouse /> Tiny House
      </>
    ),
    value: '1',
  },
  {
    label: (
      <>
        <Building /> Apartment
      </>
    ),
    value: '2',
  },
  {
    label: (
      <>
        <House /> Villa
      </>
    ),
    value: '3',
  },
  {
    label: (
      <>
        <House /> TownHouse
      </>
    ),
    value: '4',
  },
  {
    label: (
      <>
        <Trees /> Cottage
      </>
    ),
    value: '5',
  },
];

export default function FiltersBar() {
  const params = useSearchParams();
  const { filters, setFilters, viewMode, setViewMode, filtersSidebarOpen, toggleFiltersSidebar } =
    useFiltersStore();
  const locationParam = params.get('location');
  const [searchInput, setSearchInput] = useState<string>(locationParam || filters.location);

  const updateUrl = useUpdateFiltersUrl();
  const onSuccess = useCallback((data: LocationResponse) => {
    if (data) {
      console.log('filters check', data.lng, data.lat);
      setFilters({ ...filters, location: data.location, coordinates: [data?.lat, data?.lng] });
      updateUrl({ location: data.location });
    }
  }, []);

  const {
    data: location,
    isLoading: locationLoading,
    refetch,
  } = useGetLocation(searchInput, {
    enabled: false,
    onSuccess,
    onError: (error) => {
      toast.error('Failed to fetch location. Please try again.');
      console.error('Location fetch error:', error);
    },
  });

  type FilterKey =
    'location' | 'beds' | 'baths' | 'squareFeet' | 'priceMin' | 'priceMax' | 'propertyType';
  const handleFilterChange = (key: FilterKey, value: string | number | null) => {
    let newValue = value;
    const index = key === 'priceMin' ? 0 : 1;
    if (key === 'priceMin' || key === 'priceMax') {
      newValue = value === 'any' ? null : Number(value);
    } else {
      newValue = value === 'any' ? 'any' : value;
    }

    const newFilters = Object.fromEntries(
      Object.entries({ ...filters, [key]: newValue }).filter(
        ([key, value]) =>
          key !== 'priceRange' &&
          value !== '' &&
          !(Array.isArray(value) && value.every((v) => v === null)),
      ),
    );
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleLoactionSearch = () => {
    refetch();
  };

  useEffect(() => {
    if (locationParam === filters.location) {
      handleLoactionSearch();
    }
  }, [filters.location, locationParam]);

  return (
    <div className="flex-center py-5">
      <div className="flex-center gap-4 p-2">
        {/* Search Location */}
        <Button
          variant="outline"
          onClick={toggleFiltersSidebar}
          className={cn(
            'border-primary-400 hover:bg-primary-700 hover:text-primary-100 gap-2 rounded-xl',
            filtersSidebarOpen && 'bg-primary-700 text-primary-100',
          )}
        >
          <Funnel size={16} />
          All Filters
        </Button>

        {/* Search Location */}
        <div className="align-center">
          <Input
            className="border-primary-400 w-40 rounded-l-xl rounded-r-none border-r-0"
            placeholder="Search Location"
            defaultValue={filters.location}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button
            onClick={handleLoactionSearch}
            className="none hover:bg-primary-700 hover:text-primary-50 -translate-x-0.5 rounded-l-none rounded-r-xl py-4 shadow-none"
          >
            <Search className="size-4" />
          </Button>
        </div>

        {/* Price Range */}
        <div className="flex gap-4">
          {/* Min Price */}
          <Select
            value={filters.priceRange[0]?.toString() || 'any'}
            placeholder="Any Min Price"
            onChange={(val) => handleFilterChange('priceMin', val)}
            options={minPriceOpitons}
          />

          {/* Max Price */}
          <Select
            value={filters.priceRange[1]?.toString() || 'any'}
            placeholder="Any Max Price"
            onChange={(val) => handleFilterChange('priceMax', val)}
            options={maxPriceOpitons}
          />
        </div>

        {/* Beds */}
        <div className="flex gap-1">
          <Select
            value={filters.beds}
            placeholder="Beds"
            onChange={(val) => handleFilterChange('beds', val)}
            options={bedOptions}
          />
        </div>

        {/* Baths */}
        <div className="flex gap-1">
          {/* Min Price */}
          <Select
            value={filters.baths}
            placeholder="Baths"
            onChange={(val) => handleFilterChange('baths', val)}
            options={bathOptions}
          />
        </div>

        {/* Property Type */}
        <div className="flex gap-1">
          {/* Min Price */}
          <Select
            value={filters.propertyType}
            placeholder="Property Type"
            onChange={(val) => handleFilterChange('propertyType', val)}
            options={propertyTypeOptions}
          />
        </div>
      </div>

      <div className="flex-center gap-4 p-2">
        <div className="flex rounded-xl border">
          <Button
            variant="ghost"
            onClick={() => setViewMode('list')}
            className={cn(
              'hover:bg-primary-600 hover:text-primary-100 rounded-none rounded-l-xl px-3 py-1',
              viewMode === 'list' && 'bg-primary-700 text-primary-50',
            )}
          >
            <List className="size-5"></List>
          </Button>
          <Button
            variant="ghost"
            onClick={() => setViewMode('grid')}
            className={cn(
              'hover:bg-primary-600 hover:text-primary-100 rounded-none rounded-r-xl px-3 py-1',
              viewMode === 'grid' && 'bg-primary-700 text-primary-50',
            )}
          >
            <Grid className="size-5"></Grid>
          </Button>
        </div>
      </div>
    </div>
  );
}
