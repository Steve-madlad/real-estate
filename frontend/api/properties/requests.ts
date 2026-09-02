import { apiClient } from '@/lib/http-client';
import axios from 'axios';
import { LocationResponse, PropertiesResponse, PropertyParams } from './types';

const getProperties = async (params?: PropertyParams): Promise<PropertiesResponse> => {
  const route = `/property`;

  const propertiesResponse = await apiClient.get<PropertiesResponse>(route, { params });
  return propertiesResponse.data;
};

const getLocation = async (location: string): Promise<LocationResponse> => {
  const response = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&fuzzyMatch=true`,
  );
  if (response.data.features.length > 0) {
    const [lng, lat] = response.data.features[0].center;
    return { lat, lng };
  }
  return null;
};

export { getProperties, getLocation };
