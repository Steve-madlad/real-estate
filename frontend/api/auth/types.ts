import { Manager, Tenant, TenantWithFavorites } from '@/types/prismaTypes';

export interface AuthUserResponse {
  success: boolean;
  data: TenantWithFavorites | Manager;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: Tenant | Manager;
}
