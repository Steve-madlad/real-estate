'use client';

import { useUpdateFiltersUrl } from '@/hooks/useUpdateUrl';
import { cn, k } from '@/lib/utils';
import { useFiltersStore } from '@/store/filter-store';
import { Building, Funnel, Grid, House, List, Search, Trees } from 'lucide-react';
import { useState } from 'react';
import { MdOutlineHouse } from 'react-icons/md';
import { Select } from './form/Select';
import { Button } from './ui/button';
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
  { label: '1 bed', value: '1' },
  { label: '2 beds', value: '2' },
  { label: '3 beds', value: '3' },
];

const bathOptions = [
  { label: 'Any baths', value: 'any' },
  { label: '1 bath', value: '1' },
  { label: '2 baths', value: '2' },
  { label: '3 baths', value: '3' },
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
  // const router = useRouter();
  // const pathname = usePathname();
  const [searchInput, setSearchInput] = useState<string>();
  const { filters, setFilters, viewMode, setViewMode, filtersSidebarOpen, toggleFiltersSidebar } =
    useFiltersStore();

  const updateUrl = useUpdateFiltersUrl();

  type FilterKey = 'priceRange' | 'beds' | 'baths' | 'squareFeet' | 'coordinates' | 'propertyType';
  const handleFilterChange = (
    key: FilterKey,
    value: string | Array<string | number | null> | null,
    isMin?: boolean | null,
  ) => {
    let newValue = value;

    console.log({ value });

    if (key === 'priceRange' || key === 'squareFeet') {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === 'any' ? null : Number(value);
      }
      newValue = currentArrayRange;
      console.log({ newValue });
    } else if (key === 'coordinates') {
      newValue = value === 'any' ? [0, 0] : Array.isArray(value) ? value.map(Number) : '';
    } else {
      newValue = value === 'any' ? 'any' : value;
    }

    const newFilters = { ...filters, [key]: newValue };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleLoactionSearch = () => {};

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
            value="searchInput"
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button
            onClick={handleLoactionSearch}
            className="none border-l-none border-primary-400 hover:bg-primary-700 hover:text-primary-50 rounded-l=none rounded-r-xl border shadow-none"
          >
            <Search className="size-4" />
          </Button>
        </div>

        {/* Price Range */}
        <div className="flex gap-1">
          {/* Min Price */}
          <Select
            value={filters.priceRange[0]?.toString() || 'any'}
            placeHolder="Any Min Price"
            onChange={(val) => handleFilterChange('priceRange', val, true)}
            options={minPriceOpitons}
          />

          {/* Max Price */}
          <Select
            value={filters.priceRange[1]?.toString() || 'any'}
            placeHolder="Any Max Price"
            onChange={(val) => handleFilterChange('priceRange', val, false)}
            options={maxPriceOpitons}
          />
        </div>

        {/* Beds */}
        <div className="flex gap-1">
          <Select
            value={filters.beds}
            placeHolder="Beds"
            onChange={(val) => handleFilterChange('beds', val)}
            options={bedOptions}
          />
        </div>

        {/* Baths */}
        <div className="flex gap-1">
          {/* Min Price */}
          <Select
            value={filters.baths}
            placeHolder="Baths"
            onChange={(val) => handleFilterChange('baths', val)}
            options={bathOptions}
          />
        </div>

        {/* Property Type */}
        <div className="flex gap-1">
          {/* Min Price */}
          <Select
            value={filters.propertyType}
            placeHolder="Property Type"
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
