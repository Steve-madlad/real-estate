import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// import { userKeys } from '../auth';
import { LeasesResponse } from '../lease';
import { PropertiesResponse } from '../properties';
import { getProperties, getPropertyLeases } from './requests';

type UseGetResidencesOptions = Omit<
  UseQueryOptions<PropertiesResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

const tenantKeys = {
  all: ['manager'] as const,
};

type UseLeaseOptions = Omit<
  UseQueryOptions<LeasesResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;
export const useGetPropertyLeases = (propertyId: string, options?: UseLeaseOptions) => {
  return useQuery({
    queryFn: () => getPropertyLeases(propertyId),
    queryKey: tenantKeys.all,
    ...options,
  });
};

export const useGetManagerProperties = (options?: UseGetResidencesOptions) => {
  return useQuery({
    ...options,
    queryKey: ['residences'],
    queryFn: getProperties,
  });
};
