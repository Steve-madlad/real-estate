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

export const leaseKeys = {
  all: ['leases'] as const,
};

export const useGetLeases = (options?: UseLeaseOptions) => {
  return useQuery({
    queryFn: getLeases,
    queryKey: leaseKeys.all,
    ...options,
  });
};

export const leasePaymentKeys = {
  all: ['leasePayments'] as const,
  list: (propertyId: string) => [...leasePaymentKeys.all, propertyId],
};

export const useGetLeasePayments = (propertyId: string, options?: UseLeasePaymentsOptions) => {
  return useQuery({
    queryFn: () => getLeasePayments(propertyId),
    queryKey: leasePaymentKeys.list(propertyId),
    ...options,
  });
};
