import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { userKeys } from '../auth';
import { updateUser, UserUpdateBody } from './requests';
import { UpdatedUserResponse } from './types';

type UseUpdateUserOptions = Omit<
  UseMutationOptions<UpdatedUserResponse, AxiosError<{ message: string }>, UserUpdateBody>,
  'mutationFn'
>;

export const useUpdateUser = (options?: UseUpdateUserOptions) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: updateUser,
    onSuccess: (...args) => {
      queryClient.setQueryData(userKeys.all, args[0]);
      options?.onSuccess?.(...args);
    },
  });
};
