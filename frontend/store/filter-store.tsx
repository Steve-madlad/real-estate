import { AmenityEnum } from '@/lib/constants';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface FilterState {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  amenities: string[];
  availableFrom: Date | 'any';
  priceRange: Array<number | null>;
  squareFeet: [number | null, number | null];
  coordinates: [number, number];
}

type ViewModes = 'grid' | 'list';
export type FilterPartial = Partial<FilterState>;

const bedAndBathValues = new Set(['any', '1', '2', '3']);
const propertyTypeValues = new Set(['any', '1', '2', '3', '4', '5']);
const amenityValues = new Set(Object.values(AmenityEnum));

const parseNumber = (value: string | null) => {
  if (value === null || value === '' || value === 'any' || value === 'null') return null;

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const parseRange = (value: string | null): [number | null, number | null] | undefined => {
  if (value === null) return undefined;

  const parts = value.split(',');
  if (parts.length !== 2) return undefined;

  const min = parseNumber(parts[0]);
  const max = parseNumber(parts[1]);
  if (min === undefined || max === undefined) return undefined;

  return [min, max];
};

const parseCoordinates = (value: string | null): [number, number] | undefined => {
  const range = parseRange(value);
  if (!range) return undefined;

  const [latitude, longitude] = range;
  if (latitude === null || longitude === null) return undefined;

  return [latitude, longitude];
};

export function parseFilterParams(params: URLSearchParams): FilterPartial {
  const parsed: FilterPartial = {};
  const location = params.get('location')?.trim();
  const beds = params.get('beds');
  const baths = params.get('baths');
  const propertyType = params.get('propertyType');
  const amenities = params.get('amenities');
  const availableFrom = params.get('availableFrom');
  const serializedPriceRange = params.get('priceRange');
  const priceRange = serializedPriceRange
    ? parseRange(serializedPriceRange)
    : params.has('priceMin') || params.has('priceMax')
      ? parseRange(`${params.get('priceMin') ?? 'any'},${params.get('priceMax') ?? 'any'}`)
      : undefined;
  const squareFeet = parseRange(params.get('squareFeet'));
  const coordinates = parseCoordinates(params.get('coordinates'));

  if (location) parsed.location = location;
  if (beds && bedAndBathValues.has(beds)) parsed.beds = beds;
  if (baths && bedAndBathValues.has(baths)) parsed.baths = baths;
  if (propertyType && propertyTypeValues.has(propertyType)) parsed.propertyType = propertyType;
  if (amenities) {
    const values = amenities.split(',');
    if (
      values.every((amenity): amenity is AmenityEnum => amenityValues.has(amenity as AmenityEnum))
    ) {
      parsed.amenities = values;
    }
  }
  if (availableFrom === 'any') {
    parsed.availableFrom = 'any';
  } else if (availableFrom && !Number.isNaN(Date.parse(availableFrom))) {
    parsed.availableFrom = new Date(availableFrom);
  }
  if (priceRange) parsed.priceRange = priceRange;
  if (squareFeet) parsed.squareFeet = squareFeet;
  if (coordinates) parsed.coordinates = coordinates;

  return parsed;
}

interface FilterStoreProps {
  filters: FilterState;
  filtersSidebarOpen: boolean;
  viewMode: ViewModes;
  setFilters: (filters: FilterPartial) => void;
  setViewMode: (mode: ViewModes) => void;
  toggleFiltersSidebar: () => void;
  resetFilters: () => void;
}

export const initialFilters: FilterState = {
  location: 'Los Angeles',
  beds: 'any',
  baths: 'any',
  propertyType: 'any',
  amenities: [],
  availableFrom: 'any',
  priceRange: [null, null],
  squareFeet: [null, null],
  coordinates: [34.05, -118.25],
};

export const useFiltersStore = create<FilterStoreProps>()(
  devtools(
    (set) => ({
      filters: initialFilters,
      filtersSidebarOpen: false,
      viewMode: 'grid',
      setFilters: (filters) => {
        set((state) => ({
          filters: { ...state.filters, ...filters },
        }));
      },
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleFiltersSidebar: () =>
        set((state) => ({ filtersSidebarOpen: !state.filtersSidebarOpen })),
      resetFilters: () =>
        set({
          filters: initialFilters,
        }),
    }),
    {
      name: 'filters store',
    },
  ),
);
