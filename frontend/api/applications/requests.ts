import { apiClient } from '@/lib/http-client';
import {
  ApplicationsResponse,
  CreateApplicationBody,
  ProcessApplicationBody,
  SingleApplicationResponse,
} from './types';

const getApplications = async (): Promise<ApplicationsResponse['data']> => {
  const applicationsResponse = await apiClient.get<ApplicationsResponse>('/applications');
  return applicationsResponse.data.data;
};

const processApplication = async (
  id: number,
  body: ProcessApplicationBody,
): Promise<SingleApplicationResponse['data']> => {
  const route = `/applications/${id}/process`;

  const applicationResponse = await apiClient.post<SingleApplicationResponse>(route, body);
  return applicationResponse.data.data;
};

const createApplication = async (
  body: CreateApplicationBody,
): Promise<SingleApplicationResponse> => {
  const response = await apiClient.post<SingleApplicationResponse>('/applications', body);
  return response.data;
};

export { getApplications, processApplication, createApplication };
