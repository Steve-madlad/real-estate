import { APIResonse } from '@/types';
import { TenantWithFavorites } from '@/types/prismaTypes';

export interface PropertyFavoriteStatusResponse {
  success: boolean;
  message: string;
  data: { propertyId: number; isFavorited: boolean };
}

export type GetTenantResponse = APIResonse<TenantWithFavorites>;
