import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { PropertiesResponse, propertyKeys } from '../properties';
import { favoriteProperty, getResidences, getTenant, unfavoriteProperty } from './requests';
import { GetTenantResponse, PropertyFavoriteStatusResponse } from './types';

type UseUpdatePropertyOptions = Omit<
  UseMutationOptions<PropertyFavoriteStatusResponse, AxiosError<{ message: string }>, number>,
  'mutationFn'
>;

type UseGetResidencesOptions = Omit<
  UseQueryOptions<PropertiesResponse['data'], AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

type UseGetTenantOptions = Omit<
  UseQueryOptions<GetTenantResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

export const tenantKeys = {
  all: ['tenants'] as const,
};

export const useGetTenant = (options?: UseGetTenantOptions) => {
  return useQuery({
    ...options,
    queryKey: tenantKeys.all,
    queryFn: getTenant,
  });
};

export const residenceKeys = {
  all: ['residences'] as const,
};

export const useGetResidences = (options?: UseGetResidencesOptions) => {
  return useQuery({
    ...options,
    queryKey: residenceKeys.all,
    queryFn: getResidences,
  });
};

export const useFavoriteProperty = (options?: UseUpdatePropertyOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      options?.onSuccess?.(...args);
    },
    mutationFn: (propertyId: number) => favoriteProperty(propertyId),
  });
};

export const useUnfavoriteProperty = (options?: UseUpdatePropertyOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: tenantKeys.all });
      options?.onSuccess?.(...args);
    },
    mutationFn: (propertyId: number) => unfavoriteProperty(propertyId),
  });
};
