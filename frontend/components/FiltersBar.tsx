'use client';

import { useUpdateFiltersUrl } from '@/hooks/useUpdateUrl';
import { cn, k } from '@/lib/utils';
import { FilterState, useFiltersStore } from '@/store/filter-store';
import {
  Building,
  Grid,
  Home,
  List,
  MapPin,
  Search,
  SlidersHorizontal,
  Trees,
  X,
} from 'lucide-react';
import { MdOutlineHouse } from 'react-icons/md';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const minPriceOptions = [
  { label: 'Any Min Price', value: 'any' },
  { label: '$500+', value: '500' },
  { label: `$${k(1000)}+`, value: '1000' },
  { label: `$${k(1500)}+`, value: '1500' },
  { label: `$${k(2000)}+`, value: '2000' },
  { label: `$${k(3000)}+`, value: '3000' },
  { label: `$${k(5000)}+`, value: '5000' },
  { label: `$${k(10000)}+`, value: '10000' },
];

const maxPriceOptions = [
  { label: 'Any Max Price', value: 'any' },
  { label: '$1,000', value: '1000' },
  { label: `$${k(2000)}`, value: '2000' },
  { label: `$${k(3000)}`, value: '3000' },
  { label: `$${k(5000)}`, value: '5000' },
  { label: `$${k(8000)}`, value: '8000' },
  { label: `$${k(15000)}`, value: '15000' },
];

const bedOptions = [
  { label: 'Any Beds', value: 'any' },
  { label: '1+ Bed', value: '1' },
  { label: '2+ Beds', value: '2' },
  { label: '3+ Beds', value: '3' },
  { label: '4+ Beds', value: '4' },
];

const bathOptions = [
  { label: 'Any Baths', value: 'any' },
  { label: '1+ Bath', value: '1' },
  { label: '2+ Baths', value: '2' },
  { label: '3+ Baths', value: '3' },
];

const propertyTypeOptions = [
  { label: 'Any Type', value: 'any' },
  { label: 'Apartment', value: 'Apartment' },
  { label: 'Villa', value: 'Villa' },
  { label: 'Townhouse', value: 'Townhouse' },
  { label: 'Cottage', value: 'Cottage' },
  { label: 'Rooms', value: 'Rooms' },
  { label: 'Tiny House', value: 'Tinyhouse' },
];

interface FiltersBarProps {
  locationInput: string;
  onLocationInputChange: (value: string) => void;
  onLocationSearch: () => void;
}

export default function FiltersBar({
  locationInput,
  onLocationInputChange,
  onLocationSearch,
}: FiltersBarProps) {
  const { filters, setFilters, viewMode, setViewMode, filtersSidebarOpen, toggleFiltersSidebar } =
    useFiltersStore();
  const updateUrl = useUpdateFiltersUrl();

  type FilterKey =
    'location' | 'beds' | 'baths' | 'squareFeet' | 'priceMin' | 'priceMax' | 'propertyType';

  const handleFilterChange = (key: FilterKey, value: string | null) => {
    const isAny = value === 'any' || value === '' || value === null;
    const storeValue = isAny ? 'any' : value!;
    const urlValue = isAny ? null : value;

    const nextPriceRange: [number | null, number | null] = [
      filters.priceRange[0] ?? null,
      filters.priceRange[1] ?? null,
    ];

    if (key === 'priceMin') {
      nextPriceRange[0] = isAny ? null : Number(value);
      setFilters({ priceRange: nextPriceRange });
      updateUrl({ priceMin: nextPriceRange[0], priceMax: nextPriceRange[1] });
      return;
    }

    if (key === 'priceMax') {
      nextPriceRange[1] = isAny ? null : Number(value);
      setFilters({ priceRange: nextPriceRange });
      updateUrl({ priceMin: nextPriceRange[0], priceMax: nextPriceRange[1] });
      return;
    }

    if (key === 'location') {
      setFilters({ location: isAny ? '' : value! });
      updateUrl({ location: urlValue });
      return;
    }

    setFilters({ [key]: storeValue });
    updateUrl({ [key]: urlValue });
  };

  const activeFiltersCount = [
    filters.location ? 1 : 0,
    filters.propertyType && filters.propertyType !== 'any' ? 1 : 0,
    filters.beds && filters.beds !== 'any' ? 1 : 0,
    filters.baths && filters.baths !== 'any' ? 1 : 0,
    filters.priceRange[0] || filters.priceRange[1] ? 1 : 0,
    filters.amenities?.length || 0,
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="border-border/70 bg-background/95 sticky top-0 z-20 flex items-center justify-between gap-3 border-b py-3 backdrop-blur-sm">
      {/* Left controls & Quick Filters */}
      <div className="flex min-w-0 flex-1 scrollbar-none items-center gap-2.5 overflow-x-auto py-1">
        {/* Toggle All Filters Sheet / Sidebar */}
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFiltersSidebar}
          className={cn(
            'border-border/80 h-9 shrink-0 cursor-pointer gap-2 rounded-full px-3.5 text-xs font-semibold transition-all',
            filtersSidebarOpen
              ? 'bg-secondary text-secondary-foreground border-secondary shadow-xs'
              : 'hover:border-secondary/40',
          )}
        >
          <SlidersHorizontal className="size-3.5" />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className="bg-secondary-foreground text-secondary flex size-4.5 items-center justify-center rounded-full text-[10px] font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {/* Location Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onLocationSearch();
          }}
          className="relative w-48 shrink-0 sm:w-60"
        >
          <MapPin className="text-muted-foreground absolute top-1/2 left-3 size-3.5 -translate-y-1/2" />
          <Input
            value={locationInput}
            onChange={(e) => onLocationInputChange(e.target.value)}
            placeholder="City, ZIP, address"
            className="bg-background border-border/80 focus-visible:ring-secondary/40 h-9 rounded-full pr-8 pl-8 text-xs"
          />
          {locationInput ? (
            <button
              type="button"
              onClick={() => {
                onLocationInputChange('');
                handleFilterChange('location', null);
              }}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
            >
              <X className="size-3" />
            </button>
          ) : (
            <button
              type="submit"
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer"
            >
              <Search className="size-3" />
            </button>
          )}
        </form>

        {/* Property Type Dropdown */}
        <div className="hidden shrink-0 sm:block">
          <Select
            value={
              filters.propertyType && filters.propertyType !== 'any' ? filters.propertyType : null
            }
            onValueChange={(val) => handleFilterChange('propertyType', val)}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[120px] cursor-pointer gap-1.5 rounded-full px-3 text-xs transition-colors',
                filters.propertyType && filters.propertyType !== 'any'
                  ? 'border-secondary bg-secondary/10 text-secondary font-semibold shadow-2xs'
                  : 'border-border/80 text-muted-foreground hover:text-foreground',
              )}
            >
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {propertyTypeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Min Price Dropdown */}
        <div className="hidden shrink-0 md:block">
          <Select
            value={filters.priceRange[0] ? filters.priceRange[0].toString() : null}
            onValueChange={(val) => handleFilterChange('priceMin', val)}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[105px] cursor-pointer gap-1.5 rounded-full px-3 text-xs transition-colors',
                filters.priceRange[0]
                  ? 'border-secondary bg-secondary/10 text-secondary font-semibold shadow-2xs'
                  : 'border-border/80 text-muted-foreground hover:text-foreground',
              )}
            >
              <SelectValue placeholder="Min Price" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {minPriceOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Max Price Dropdown */}
        <div className="hidden shrink-0 md:block">
          <Select
            value={filters.priceRange[1] ? filters.priceRange[1].toString() : null}
            onValueChange={(val) => handleFilterChange('priceMax', val)}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[105px] cursor-pointer gap-1.5 rounded-full px-3 text-xs transition-colors',
                filters.priceRange[1]
                  ? 'border-secondary bg-secondary/10 text-secondary font-semibold shadow-2xs'
                  : 'border-border/80 text-muted-foreground hover:text-foreground',
              )}
            >
              <SelectValue placeholder="Max Price" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {maxPriceOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bedrooms Dropdown */}
        <div className="hidden shrink-0 lg:block">
          <Select
            value={filters.beds && filters.beds !== 'any' ? filters.beds.toString() : null}
            onValueChange={(val) => handleFilterChange('beds', val)}
          >
            <SelectTrigger
              className={cn(
                'h-9 w-auto min-w-[90px] cursor-pointer gap-1.5 rounded-full px-3 text-xs transition-colors',
                filters.beds && filters.beds !== 'any'
                  ? 'border-secondary bg-secondary/10 text-secondary font-semibold shadow-2xs'
                  : 'border-border/80 text-muted-foreground hover:text-foreground',
              )}
            >
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {bedOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right: Grid / List view switcher */}
      <div className="flex shrink-0 items-center gap-1">
        <div className="border-border/80 bg-background/50 flex items-center rounded-full border p-0.5">
          <button
            type="button"
            aria-label="List view"
            onClick={() => setViewMode('list')}
            className={cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors',
              viewMode === 'list'
                ? 'bg-secondary text-secondary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <List className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Grid view"
            onClick={() => setViewMode('grid')}
            className={cn(
              'flex size-8 cursor-pointer items-center justify-center rounded-full transition-colors',
              viewMode === 'grid'
                ? 'bg-secondary text-secondary-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            <Grid className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
