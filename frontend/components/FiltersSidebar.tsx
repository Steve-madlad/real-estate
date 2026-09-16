import { useUpdateFiltersUrl } from '@/hooks/useUpdateUrl';
import { AmenityEnum, AmenityIcons, PropertyTypeIcons } from '@/lib/constants';
import { cn, formatEnumString } from '@/lib/utils';
import { FilterPartial, FilterState, initialFilters, useFiltersStore } from '@/store/filter-store';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { DatePickerInput } from './ui/custom/DatePicker';
import { Select } from './ui/custom/Select';
import { SliderRange } from './ui/custom/Slider';
import { Input } from './ui/input';
import { Label } from './ui/label';

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

const propertyTypeOptions = Object.entries(PropertyTypeIcons).map(([type, Icon], index) => ({
  type,
  value: index === 0 ? 'any' : String(index),
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
  const { filters, setFilters, filtersSidebarOpen, resetFilters } = useFiltersStore();
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
    <div>
      <div className="h-full overflow-auto rounded-lg bg-white px-4 pb-10">
        <div className="col space-y-6">
          {/* Location */}
          <div>
            <h4 className="mb-2 font-bold">Location</h4>
            <div className="align-center">
              <Input
                placeholder="Enter location"
                value={locationInput}
                onChange={(e) => onLocationInputChange(e.target.value)}
                className="rounded-l-xl rounded-r-none border-r-0"
              />
              <Button
                onClick={onLocationSearch}
                className="border-l-none rounded-l-none rounded-r-xl border-black shadow-none"
              >
                <Search className="size-4" />
              </Button>
            </div>
          </div>

          {/* Property Type */}
          <div>
            <h4 className="mb-2 font-bold">Property Type</h4>
            <div className="grid grid-cols-2 gap-4">
              {propertyTypeOptions.map(({ type, value, Icon }) => (
                <div
                  key={value}
                  onClick={() => setLocalFilters((prev) => ({ ...prev, propertyType: value }))}
                  className={cn(
                    'col-full-center rounded-xl border p-4',
                    localFilters.propertyType === value ? 'border-black' : 'border-gray-200',
                  )}
                >
                  <Icon className="mb-2 size-6" />
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range  */}
          <div>
            <h4 className="mb-2 font-bold">Price Range Monthly</h4>
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
            <div className="just-between mt-2">
              <span>{localFilters.priceRange[0] ?? 0}</span>
              <span>{localFilters.priceRange[1] ?? 10000}</span>
            </div>
          </div>

          {/* Beds & Baths */}
          <div className="flex gap-4">
            <div className="flex-1">
              <h4 className="mb-2 font-bold">Beds</h4>
              <Select
                value={localFilters.beds}
                placeholder="Beds"
                onChange={(val) => setLocalFilters((prev) => ({ ...prev, beds: val ?? prev.beds }))}
                options={bedOptions}
              />
            </div>

            <div className="flex-1">
              <h4 className="mb-2 font-bold">Baths</h4>
              <Select
                value={localFilters.baths}
                placeholder="Baths"
                onChange={(val) =>
                  setLocalFilters((prev) => ({ ...prev, baths: val ?? prev.baths }))
                }
                options={bathOptions}
              />
            </div>
          </div>

          {/* Square Feet  */}
          <div>
            <h4 className="mb-2 font-bold">Square Feet</h4>
            <SliderRange
              min={50}
              max={10000}
              step={100}
              value={[localFilters.squareFeet[0] ?? 50, localFilters.squareFeet[1] ?? 10000]}
              onChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  squareFeet: value as [number, number],
                }))
              }
            />
            <div className="just-between mt-2">
              <span>{localFilters.squareFeet[0] ?? 0}</span>
              <span>{localFilters.squareFeet[1] ?? 5000}</span>
            </div>
          </div>

          {/* Amenities  */}
          <div>
            <h4 className="font-bold-mb-2">Amenities</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
                <div
                  key={amenity}
                  className={cn(
                    'align-center space-x-2 rounded-lg border p-2 hover:cursor-pointer',
                    localFilters.amenities.includes(amenity as AmenityEnum)
                      ? 'border-black'
                      : 'border-gray-200',
                  )}
                  onClick={() => handleAmenityChange(amenity as AmenityEnum)}
                >
                  <Icon className="size-5 hover:cursor-pointer"></Icon>
                  <Label className="hover:cursor-pointer">{formatEnumString(amenity)}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Available From */}
          <div>
            <h4 className="mb-2 font-bold">Available From</h4>
            <DatePickerInput
              value={localFilters.availableFrom !== 'any' ? localFilters.availableFrom : null}
              onChange={(value) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  availableFrom: value ? value : 'any',
                }))
              }
              placeholder="Select a Date"
            />
          </div>

          {/* Apply and Reset button */}
          <div className="mt-6 flex gap-4">
            <Button onClick={handleSubmit} className="bg-primary-700 flex-1 rounded-xl text-white">
              Apply
            </Button>
            <Button onClick={handleReset} variant={'outline'} className="flex-1 rounded-xl">
              Reset Filters
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
