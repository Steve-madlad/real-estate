import { apiClient } from '@/lib/http-client';
import { getCurrentUser } from 'aws-amplify/auth';
import { PropertiesResponse } from '../properties';
import { GetTenantResponse, PropertyFavoriteStatusResponse } from './types';

const getTenant = async (): Promise<GetTenantResponse> => {
  const user = await getCurrentUser();

  const response = await apiClient.get(`/tenants/${user.userId}`);
  return response.data;
};

const getResidences = async (): Promise<PropertiesResponse> => {
  const user = await getCurrentUser();
  const userId = user.userId;
  const route = `/tenants/${userId}/current-residences`;

  const response = await apiClient.get(route);
  return response.data;
};

const favoriteProperty = async (propertyId: number): Promise<PropertyFavoriteStatusResponse> => {
  const user = await getCurrentUser();
  const userId = user.userId;
  const route = `/tenants/${userId}/favorite/${propertyId}`;

  const favoritePropertyResponse = await apiClient.post<PropertyFavoriteStatusResponse>(route);
  return favoritePropertyResponse.data;
};

const unfavoriteProperty = async (propertyId: number): Promise<PropertyFavoriteStatusResponse> => {
  const user = await getCurrentUser();
  const userId = user.userId;
  const route = `/tenants/${userId}/favorite/${propertyId}`;

  const favoritePropertyResponse = await apiClient.delete<PropertyFavoriteStatusResponse>(route);
  return favoritePropertyResponse.data;
};

export { favoriteProperty, getResidences, getTenant, unfavoriteProperty };
