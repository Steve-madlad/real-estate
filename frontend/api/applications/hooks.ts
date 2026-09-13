import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { createApplication, getApplications, processApplication } from './requests';
import {
  ApplicationsResponse,
  CreateApplicationBody,
  ProcessApplicationVariables,
  SingleApplicationResponse,
} from './types';

type UseApplicationsOptions = Omit<
  UseQueryOptions<ApplicationsResponse['data'], AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

type UseProcessApplicationOptions = Omit<
  UseMutationOptions<
    SingleApplicationResponse['data'],
    AxiosError<{ message: string }>,
    ProcessApplicationVariables
  >,
  'mutationFn'
>;

type UseCreateApplicationOptions = Omit<
  UseMutationOptions<
    SingleApplicationResponse,
    AxiosError<{ message: string }>,
    CreateApplicationBody
  >,
  'mutationFn'
>;

export const userKeys = {
  all: ['properties'] as const,
};

export const useGetApplications = (options?: UseApplicationsOptions) => {
  return useQuery({
    queryFn: getApplications,
    queryKey: userKeys.all,
    ...options,
  });
};

export const useProcessApplications = (options?: UseProcessApplicationOptions) => {
  return useMutation({
    mutationFn: ({ id, body }) => processApplication(id, body),
    ...options,
  });
};

export const useCreateApplication = (options?: UseCreateApplicationOptions) => {
  return useMutation({
    mutationFn: (body: CreateApplicationBody) => createApplication(body),
    ...options,
  });
};
