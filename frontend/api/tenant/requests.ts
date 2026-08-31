import { apiClient } from '@/lib/http-client';
import { getCurrentUser } from 'aws-amplify/auth';
import { PropertyFavoriteStatusResponse } from './types';

const favoriteProperty = async (propertyId: number): Promise<PropertyFavoriteStatusResponse> => {
  const user = await getCurrentUser();
  const userId = user.userId;

  const route = `/tenants/${userId}/favorite/${propertyId}`;
  try {
    const favoritePropertyResponse = await apiClient.post<PropertyFavoriteStatusResponse>(route);
    return favoritePropertyResponse.data;
  } catch (error) {
    throw error;
  }
};

const unfavoriteProperty = async (propertyId: number): Promise<PropertyFavoriteStatusResponse> => {
  const user = await getCurrentUser();
  const userId = user.userId;

  const route = `/tenants/${userId}/favorite/${propertyId}`;
  try {
    const favoritePropertyResponse = await apiClient.delete<PropertyFavoriteStatusResponse>(route);
    return favoritePropertyResponse.data;
  } catch (error) {
    throw error;
  }
};

export { favoriteProperty, unfavoriteProperty };
