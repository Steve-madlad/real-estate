import { PropertyWithLocationCoordinates } from '@/types/prismaTypes';
import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { createProperty, getLocation, getProperties, getProperty } from './requests';
import {
  CreatePropertyBody,
  LocationResponse,
  PropertiesResponse,
  PropertyParams,
  PropertyResponse,
} from './types';

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

type UseCreatePopertyOptions = Omit<
  UseMutationOptions<PropertyResponse, AxiosError<{ message: string }>, CreatePropertyBody>,
  'mutationFn'
>;

export const userKeys = {
  all: ['properties'] as const,
};

export const useGetProperty = (id: string, options?: UsePropertyOptions) => {
  return useQuery({
    queryFn: () => getProperty(id),
    queryKey: userKeys.all,
    ...options,
  });
};

export const useGetProperties = (params?: PropertyParams, options?: UsePropertiesOptions) => {
  return useQuery({
    queryFn: () => getProperties(params),
    queryKey: userKeys.all,
    ...options,
  });
};

export const useGetLocation = (location: string, options?: UseLocationOptions) => {
  const query = useQuery({
    queryFn: () => getLocation(location),
    queryKey: userKeys.all,
    ...options,
  });

  const { onSuccess, onError } = options || {};

  useEffect(() => {
    if (query.isSuccess && query.data && onSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data]);

  useEffect(() => {
    if (query.isError && query.error && onError) {
      onError(query.error);
    }
  }, [query.isError, query.error]);

  return query;
};

export const useCreateProperty = (options?: UseCreatePopertyOptions) => {
  return useMutation({
    mutationFn: (body: CreatePropertyBody) => createProperty(body),
    ...options,
  });
};
