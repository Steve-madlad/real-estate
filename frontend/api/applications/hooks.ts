import { ApplicationWithRelations } from '@/types/prismaTypes';
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from '@tanstack/react-query';
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

export const applicationKeys = {
  all: ['applications'] as const,
};

export const useGetApplications = (options?: UseApplicationsOptions) => {
  return useQuery({
    queryFn: getApplications,
    queryKey: applicationKeys.all,
    ...options,
  });
};

export const useProcessApplications = (options?: UseProcessApplicationOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: ({ id, body }) => processApplication(id, body) as Promise<ApplicationWithRelations>,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};

export const useCreateApplication = (options?: UseCreateApplicationOptions) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...options,
    mutationFn: (body: CreateApplicationBody) => createApplication(body),
    onSuccess: (...args) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      options?.onSuccess?.(...args);
    },
  });
};
