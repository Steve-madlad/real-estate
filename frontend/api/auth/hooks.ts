import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getAuthUser } from './requests';
import { AuthUserResponse } from './types';

interface UseAuthUserProps {
  options?: Omit<
    UseQueryOptions<AuthUserResponse, AxiosError<{ message: string }>, string>,
    'queryFn'
  >;
}

export const userKeys = {
  all: ['user'] as const,
};

export const useGetAuthUser = (options?: UseAuthUserProps) => {
  return useQuery({
    queryFn: getAuthUser,
    queryKey: userKeys.all,
    ...options,
  });
};
