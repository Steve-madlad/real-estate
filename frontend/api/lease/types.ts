import { APIResonse } from '@/types';
import { LeaseWithTenantAndProperty, Payment } from '@/types/prismaTypes';

export type LeasesResponse = APIResonse<LeaseWithTenantAndProperty[]>;
export type LeasePaymentsResponse = APIResonse<Payment[]>;
