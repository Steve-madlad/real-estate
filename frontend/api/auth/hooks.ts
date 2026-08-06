import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAuthUser } from './requests';
import { AuthUserResponse } from './types';

type UseAuthUserOptions = Omit<
  UseQueryOptions<AuthUserResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

export const userKeys = {
  all: ['user'] as const,
};

export const useGetAuthUser = (options?: UseAuthUserOptions) => {
  return useQuery({
    queryFn: getAuthUser,
    queryKey: userKeys.all,
    ...options,
  });
};
