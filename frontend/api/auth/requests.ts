import { apiClient } from '@/lib/http-client';
import { Manager, Tenant } from '@/types/prismaTypes';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

type UserRole = 'manager' | 'tenant';

const isUserRole = (value: unknown): value is UserRole =>
  value === 'manager' || value === 'tenant';

const getAuthUser = async (): Promise<User> => {
  const session = await fetchAuthSession();
  const { idToken } = session.tokens ?? {};
  const user = await getCurrentUser();
  const userRole = idToken?.payload['custom:role'] as string;

  if (!isUserRole(userRole)) {
    throw new Error('Missing or invalid user role');
  }

  const route = `/${userRole}/${user.userId}`;

  const response = await apiClient.get<Tenant | Manager>(route);
  return {
    cognitoInfo: { ...user },
    userInfo: response.data,
    userRole,
  };
};

export { getAuthUser };
