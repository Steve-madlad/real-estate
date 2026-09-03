import { PropertyWithLocationCoordinates } from '@/types/prismaTypes';

export type PropertiesResponse = {
  success: boolean;
  data: PropertyWithLocationCoordinates[];
  message: string;
};

export type PropertyResponse = {
  success: boolean;
  data: PropertyWithLocationCoordinates;
  message: string;
};

export interface PropertyParams {
  favoriteIds?: string[];
  priceMin?: number;
  priceMax?: number;
  beds?: string;
  baths?: string;
  propertyType?: string;
  squareFeetMin?: number;
  squareFeetMax?: number;
  amenities?: string;
  availableFrom?: Date | 'any';
  latitude?: number;
  longitude?: number;
}

export type LocationResponse = { lat: number; lng: number } | null;
