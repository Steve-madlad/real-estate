import { apiClient } from '@/lib/http-client';
import { ApplicationsResponse, ProcessApplicationBody, SingleApplicationResponse } from './types';

const getApplications = async (): Promise<ApplicationsResponse['data']> => {
  const applicationsResponse = await apiClient.get<ApplicationsResponse>('/applications');
  return applicationsResponse.data.data;
};

const processApplication = async (
  id: string,
  body: ProcessApplicationBody,
): Promise<SingleApplicationResponse['data']> => {
  const route = `/applications/${id}/process`;

  const applicationResponse = await apiClient.post<SingleApplicationResponse>(route, body);
  return applicationResponse.data.data;
};

// const getLocation = async (location: string): Promise<LocationResponse> => {
//   const response = await axios.get(
//     `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&fuzzyMatch=true`,
//   );
//   if (response.data.features.length > 0) {
//     const [lng, lat] = response.data.features[0].center;
//     return { lat, lng };
//   }
//   return null;
// };

// const createProperty = async (body: FormData): Promise<PropertyResponse> => {
//   const response = await apiClient.post<PropertyResponse>('/applications', body);
//   return response.data;
// };

export { getApplications, processApplication };
