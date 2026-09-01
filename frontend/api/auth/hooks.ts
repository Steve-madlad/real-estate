import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getAuthUser } from './requests';

type AuthUserData = Awaited<ReturnType<typeof getAuthUser>>;

type UseAuthUserOptions = Omit<UseQueryOptions<AuthUserData>, 'queryFn' | 'queryKey'>;

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
