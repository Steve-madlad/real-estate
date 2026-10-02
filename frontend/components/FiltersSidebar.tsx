'use client';

import { useState } from 'react';
import { Search, X, RotateCcw, Check, Sparkles } from 'lucide-react';
import { useUpdateFiltersUrl } from '@/hooks/useUpdateUrl';
import { AmenityEnum, AmenityIcons, PropertyTypeIcons } from '@/lib/constants';
import { cn, formatEnumString } from '@/lib/utils';
import { FilterPartial, FilterState, initialFilters, useFiltersStore } from '@/store/filter-store';
import { Button } from './ui/button';
import { DatePickerInput } from './ui/custom/DatePicker';
import { SliderRange } from './ui/custom/Slider';
import { Input } from './ui/input';
import { Label } from './ui/label';

const bedOptions = [
  { label: 'Any Beds', value: 'any' },
  { label: '1+ bed', value: '1' },
  { label: '2+ beds', value: '2' },
  { label: '3+ beds', value: '3' },
  { label: '4+ beds', value: '4' },
];

const bathOptions = [
  { label: 'Any baths', value: 'any' },
  { label: '1+ bath', value: '1' },
  { label: '2+ baths', value: '2' },
  { label: '3+ baths', value: '3' },
];

const propertyTypeOptions = Object.entries(PropertyTypeIcons).map(([type, Icon], index) => ({
  type,
  value: type,
  Icon,
}));

interface FiltersSidebarProps {
  locationInput: string;
  onLocationInputChange: (value: string) => void;
  onLocationSearch: () => void;
  initialFilterValues: FilterPartial;
}

export default function FiltersSidebar({
  locationInput,
  onLocationInputChange,
  onLocationSearch,
  initialFilterValues,
}: FiltersSidebarProps) {
  const { filters, setFilters, filtersSidebarOpen, toggleFiltersSidebar, resetFilters } =
    useFiltersStore();
  const [localFilters, setLocalFilters] = useState<FilterState>({
    ...filters,
    ...initialFilterValues,
    location: locationInput,
    availableFrom:
      initialFilterValues.availableFrom ??
      (filters.availableFrom === 'any' ? new Date() : filters.availableFrom),
  });

  const updateUrl = useUpdateFiltersUrl();

  const handleSubmit = () => {
    const { location: _location, coordinates: _coordinates, ...sidebarFilters } = localFilters;
    setFilters(sidebarFilters);
    updateUrl({
      ...sidebarFilters,
      priceMin: sidebarFilters.priceRange[0],
      priceMax: sidebarFilters.priceRange[1],
      location: filters.location,
    });

    if (locationInput.trim()) {
      onLocationSearch();
    }
  };

  const handleReset = () => {
    resetFilters();
    onLocationInputChange(initialFilters.location);
    setLocalFilters({ ...initialFilters, availableFrom: new Date() });
    updateUrl({});
  };

  const handleAmenityChange = (amenity: AmenityEnum) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  if (!filtersSidebarOpen) return null;

  return (
    <div className="border-border/80 bg-card text-card-foreground h-full overflow-y-auto rounded-2xl border p-5 shadow-sm">
      <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-secondary size-4" />
          <h3 className="text-foreground text-base font-bold tracking-tight">Detailed Filters</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFiltersSidebar}
          className="text-muted-foreground hover:text-foreground size-8 rounded-full"
        >
          <X className="size-4" />
          <span className="sr-only">Close filters</span>
        </Button>
      </div>

      <div className="space-y-6">
        {/* Property Type Grid */}
        <div>
          <Label className="text-muted-foreground mb-2.5 block text-xs font-bold tracking-wider uppercase">
            Property Type
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {propertyTypeOptions.map(({ type, value, Icon }) => {
              const isSelected = localFilters.propertyType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      propertyType: isSelected ? '' : value,
                    }))
                  }
                  className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-xl border p-3 text-xs font-medium transition-all',
                    isSelected
                      ? 'border-secondary bg-secondary/10 text-secondary font-bold shadow-xs'
                      : 'border-border/70 hover:border-border hover:bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="mb-1.5 size-5" />
                  <span>{type}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Monthly Price
            </Label>
            <span className="text-foreground text-xs font-semibold">
              ${localFilters.priceRange[0]?.toLocaleString() || '0'} – $
              {localFilters.priceRange[1]?.toLocaleString() || '10,000+'}
            </span>
          </div>
          <div className="px-1 pt-2">
            <SliderRange
              min={500}
              max={10000}
              step={100}
              value={[localFilters.priceRange[0] ?? 500, localFilters.priceRange[1] ?? 10000]}
              onChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  priceRange: value as [number, number],
                }))
              }
            />
          </div>
        </div>

        {/* Beds & Baths selection */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
              Beds
            </Label>
            <div className="flex flex-col gap-1">
              {bedOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      beds: opt.value === 'any' ? '' : opt.value,
                    }))
                  }
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg border px-3 py-1.5 text-left text-xs font-medium transition-colors',
                    (opt.value === 'any' && !localFilters.beds) || localFilters.beds === opt.value
                      ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                      : 'border-border/60 hover:bg-muted text-muted-foreground',
                  )}
                >
                  <span>{opt.label}</span>
                  {((opt.value === 'any' && !localFilters.beds) ||
                    localFilters.beds === opt.value) && <Check className="text-secondary size-3" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground mb-2 block text-xs font-bold tracking-wider uppercase">
              Baths
            </Label>
            <div className="flex flex-col gap-1">
              {bathOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      baths: opt.value === 'any' ? '' : opt.value,
                    }))
                  }
                  className={cn(
                    'flex cursor-pointer items-center justify-between rounded-lg border px-3 py-1.5 text-left text-xs font-medium transition-colors',
                    (opt.value === 'any' && !localFilters.baths) || localFilters.baths === opt.value
                      ? 'border-secondary bg-secondary/10 text-secondary font-bold'
                      : 'border-border/60 hover:bg-muted text-muted-foreground',
                  )}
                >
                  <span>{opt.label}</span>
                  {((opt.value === 'any' && !localFilters.baths) ||
                    localFilters.baths === opt.value) && (
                    <Check className="text-secondary size-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <Label className="text-muted-foreground mb-2.5 block text-xs font-bold tracking-wider uppercase">
            Amenities & Features
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(AmenityIcons).map(([amenity, Icon]) => {
              const isSelected = localFilters.amenities.includes(amenity as AmenityEnum);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityChange(amenity as AmenityEnum)}
                  className={cn(
                    'flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-all',
                    isSelected
                      ? 'border-secondary bg-secondary/10 text-secondary font-semibold shadow-xs'
                      : 'border-border/70 hover:border-border hover:bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="size-3.5" />
                  <span>{formatEnumString(amenity)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="border-border/60 flex items-center gap-2 border-t pt-4">
          <Button
            onClick={handleSubmit}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground flex-1 cursor-pointer rounded-xl font-bold shadow-xs"
          >
            Apply Filters
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-border/80 text-muted-foreground hover:text-foreground cursor-pointer gap-1.5 rounded-xl text-xs"
          >
            <RotateCcw className="size-3.5" /> Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
