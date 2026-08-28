import { apiClient } from '@/lib/http-client';
import { Property } from '@/types/prismaTypes';
import { PropertiesResponse } from './types';

const getProperties = async (): Promise<PropertiesResponse> => {
  const route = `/property`;
  try {
    const propertiesResponse = await apiClient.get<{ data: Property[] }>(route);
    return {
      properties: propertiesResponse.data.data,
    };
  } catch (error) {
    throw error;
  }
};

export { getProperties };
