import { APIResonse } from '@/types';
import { Lease, LeaseWithPayments } from '@/types/prismaTypes';

export type LeasesResponse = APIResonse<Lease[]>;
export type LeasePaymentsResponse = APIResonse<LeaseWithPayments[]>;
