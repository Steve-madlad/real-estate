import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getProperties } from './requests';
import { PropertiesResponse } from './types';

type UsePropertiesOptions = Omit<
  UseQueryOptions<PropertiesResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

export const userKeys = {
  all: ['properties'] as const,
};

export const useGetProperties = (options?: UsePropertiesOptions) => {
  return useQuery({
    queryFn: getProperties,
    queryKey: userKeys.all,
    ...options,
  });
};
