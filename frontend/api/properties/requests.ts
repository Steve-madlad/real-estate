import { apiClient } from '@/lib/http-client';
import { PropertiesResponse, PropertyParams } from './types';

const getProperties = async (params?: PropertyParams): Promise<PropertiesResponse> => {
  const route = `/property`;

  const propertiesResponse = await apiClient.get<PropertiesResponse>(route, { params });
  return propertiesResponse.data;
};

export { getProperties };
