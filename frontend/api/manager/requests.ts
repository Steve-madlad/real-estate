import { apiClient } from '@/lib/http-client';
import { getCurrentUser } from 'aws-amplify/auth';
import { LeasesResponse } from '../lease';
import { PropertiesResponse } from '../properties';

// const getTenant = async (): Promise<GetTenantResponse> => {
//   const user = await getCurrentUser();

//   const response = await apiClient.get(`/tenants/${user.userId}`);
//   return response.data;
// };

const getProperties = async (): Promise<PropertiesResponse> => {
  const user = await getCurrentUser();
  const userId = user.userId;
  const route = `/managers/${userId}/properties`;

  const response = await apiClient.get(route);
  return response.data;
};

const getPropertyLeases = async (propertyId: string): Promise<LeasesResponse> => {
  const leaseResponse = await apiClient.get<LeasesResponse>(`/property/${propertyId}/leases`);
  return leaseResponse.data;
};

export { getProperties, getPropertyLeases };
