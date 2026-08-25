import { String } from 'lodash';
import { create } from 'zustand';

export interface FilterState {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  amenities: string[];
  availableFrom: Date | 'any';
  priceRange: [number, number] | [null, null];
  squareFeet: [number, number] | [null, null];
  coordinates: [number, number];
}

type ViewModes = 'grid' | 'list';
export type FilterPartial = Partial<FilterState>;

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
  coordinates: [-118.25, 34.05],
};

export const useFiltersStore = create<FilterStoreProps>((set) => ({
  filters: initialFilters,
  filtersSidebarOpen: false,
  viewMode: 'grid',
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
    })),
  setViewMode: (mode) => set({ viewMode: mode }),
  toggleFiltersSidebar: () => set((state) => ({ filtersSidebarOpen: !state.filtersSidebarOpen })),
  resetFilters: () =>
    set({
      filters: initialFilters,
    }),
}));
