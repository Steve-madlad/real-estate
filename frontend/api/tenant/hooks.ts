import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
// import { userKeys } from '../auth';
import { favoriteProperty, unfavoriteProperty } from './requests';
import { PropertyFavoriteStatusResponse } from './types';

type UseUpdatePropertyOptions = Omit<
  UseMutationOptions<PropertyFavoriteStatusResponse, AxiosError<{ message: string }>, number>,
  'mutationFn'
>;

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
