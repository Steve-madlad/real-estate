import { PropertyWithLocationCoordinates } from '@/types/prismaTypes';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { createProperty, getLocation, getProperties, getProperty } from './requests';
import { LocationResponse, PropertiesResponse, PropertyParams, PropertyResponse } from './types';

type UsePropertyOptions = Omit<
  UseQueryOptions<PropertyWithLocationCoordinates, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

type UsePropertiesOptions = Omit<
  UseQueryOptions<PropertiesResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

type UseLocationOptions = Omit<
  UseQueryOptions<LocationResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
> & {
  onSuccess?: (data: LocationResponse) => void;
  onError?: (error: AxiosError<{ message: string }>) => void;
};

type UseCreatepropertyOptions = Omit<
  UseMutationOptions<PropertyResponse, AxiosError<{ message: string }>, FormData>,
  'mutationFn'
>;

export const propertyKeys = {
  all: ['properties'] as const,
  detail: (id: string) => [...propertyKeys.all, id],
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (params?: PropertyParams) => [...propertyKeys.lists(), params],
};

export const useGetProperty = (id: string, options?: UsePropertyOptions) => {
  return useQuery({
    queryFn: () => getProperty(id),
    queryKey: propertyKeys.detail(id),
    ...options,
  });
};

export const useGetProperties = (params?: PropertyParams, options?: UsePropertiesOptions) => {
  return useQuery({
    queryFn: () => getProperties(params),
    queryKey: propertyKeys.list(params),
    ...options,
  });
};

export const locationKeys = {
  all: ['location'] as const,
  detail: (location: string) => [...locationKeys.all, location],
};

export const useGetLocation = (location: string, options?: UseLocationOptions) => {
  const query = useQuery({
    queryFn: () => getLocation(location),
    queryKey: locationKeys.detail(location),
    ...options,
  });

  const { onSuccess, onError } = options || {};

  useEffect(() => {
    if (query.isSuccess && query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  useEffect(() => {
    if (query.isError && query.error && onError) {
      onError(query.error);
    }
  }, [query.isError, query.error, onError]);

  return query;
};

export const useCreateProperty = (options?: UseCreatepropertyOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: FormData) => createProperty(body),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      options?.onSuccess?.(...args);
    },
    ...options,
  });
};
