import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { LeasesResponse } from '../lease';
import { PropertiesResponse } from '../properties';
import { getProperties, getPropertyLeases } from './requests';

type UseGetManagerPropertiesOptions = Omit<
  UseQueryOptions<PropertiesResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

type UseLeaseOptions = Omit<
  UseQueryOptions<LeasesResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

const propertyLeaseKeys = {
  all: ['propertyLeases'] as const,
  list: (propertyId: string) => [...propertyLeaseKeys.all, propertyId],
};

export const useGetPropertyLeases = (propertyId: string, options?: UseLeaseOptions) => {
  return useQuery({
    queryFn: () => getPropertyLeases(propertyId),
    queryKey: propertyLeaseKeys.all,
    ...options,
  });
};

const managerPropertyKeys = {
  all: ['managerProperties'] as const,
};

export const useGetManagerProperties = (options?: UseGetManagerPropertiesOptions) => {
  return useQuery({
    ...options,
    queryKey: managerPropertyKeys.all,
    queryFn: getProperties,
  });
};
