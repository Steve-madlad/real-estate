import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { getLeasePayments, getLeases } from './requests';
import { LeasePaymentsResponse, LeasesResponse } from './types';

type UseLeaseOptions = Omit<
  UseQueryOptions<LeasesResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

type UseLeasePaymentsOptions = Omit<
  UseQueryOptions<LeasePaymentsResponse, AxiosError<{ message: string }>>,
  'queryFn' | 'queryKey'
>;

export const userKeys = {
  all: ['properties'] as const,
};

export const useGetLeases = (options?: UseLeaseOptions) => {
  return useQuery({
    queryFn: getLeases,
    queryKey: userKeys.all,
    ...options,
  });
};

export const useGetLeasePayments = (propertyId: string, options?: UseLeasePaymentsOptions) => {
  return useQuery({
    queryFn: () => getLeasePayments(propertyId),
    queryKey: userKeys.all,
    ...options,
  });
};
