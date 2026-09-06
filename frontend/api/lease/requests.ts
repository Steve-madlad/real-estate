import { apiClient } from '@/lib/http-client';
import { LeasePaymentsResponse, LeasesResponse } from './types';

const getLeases = async (): Promise<LeasesResponse> => {
  const leaseResponse = await apiClient.get<LeasesResponse>('/lease');
  return leaseResponse.data;
};

const getLeasePayments = async (): Promise<LeasePaymentsResponse> => {
  const leasePaymentsResponse = await apiClient.get<LeasePaymentsResponse>('/lease/payments');
  return leasePaymentsResponse.data;
};

export { getLeasePayments, getLeases };
