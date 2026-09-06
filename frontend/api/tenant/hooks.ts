import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// import { userKeys } from '../auth';
import { PropertiesResponse, PropertyResponse } from '../properties';
import { favoriteProperty, getResidences, getTenant, unfavoriteProperty } from './requests';
import { GetTenantResponse, PropertyFavoriteStatusResponse } from './types';

type UseUpdatePropertyOptions = Omit<
  UseMutationOptions<PropertyFavoriteStatusResponse, AxiosError<{ message: string }>, number>,
  'mutationFn'
>;

type UseGetResidencesOptions = Omit<
  UseQueryOptions<PropertiesResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

type UseGetTenantOptions = Omit<
  UseQueryOptions<GetTenantResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

const tenantKeys = {
  all: ['tenant'] as const,
};

export const useGetTenant = (options?: UseGetTenantOptions) => {
  return useQuery({
    ...options,
    queryKey: tenantKeys.all,
    queryFn: getTenant,
  });
};

export const useGetResidences = (options?: UseGetResidencesOptions) => {
  return useQuery({
    ...options,
    queryKey: tenantKeys.all,
    queryFn: getResidences,
  });
};

export const useFavoriteProperty = (options?: UseUpdatePropertyOptions) => {
  // const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (propertyId: number) => favoriteProperty(propertyId),
    // onSuccess: (...args) => {
    //   queryClient.setQueryData(userKeys.all, args[0]);
    //   options?.onSuccess?.(...args);
    // },
  });
};

export const useUnfavoriteProperty = (options?: UseUpdatePropertyOptions) => {
  // const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (propertyId: number) => unfavoriteProperty(propertyId),
    // onSuccess: (...args) => {
    //   queryClient.setQueryData(userKeys.all, args[0]);
    //   options?.onSuccess?.(...args);
    // },
  });
};
