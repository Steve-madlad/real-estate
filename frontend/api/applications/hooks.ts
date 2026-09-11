import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getApplications, processApplication } from './requests';
import {
  ApplicationsResponse,
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

// export const useCreateProperty = (options?: UseCreatePopertyOptions) => {
//   return useMutation({
//     mutationFn: (body: FormData) => createProperty(body),
//     ...options,
//   });
// };
