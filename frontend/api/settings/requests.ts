import { apiClient } from '@/lib/http-client';
import { isUserRole } from '@/lib/utils';
import { Manager, Tenant } from '@/types/prismaTypes';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { UserRole } from '@/types';

export type UserUpdateBody = Partial<Tenant | Manager>;
const updateUser = async (body: UserUpdateBody): Promise<User> => {
  const session = await fetchAuthSession();
  const { idToken } = session.tokens ?? {};
  const user = await getCurrentUser();
  const userRole = idToken?.payload['custom:role'] as UserRole;

  if (!isUserRole(userRole)) {
    throw new Error('Missing or invalid user role');
  }

  const route = `/${userRole}s/${user.userId}`;
  try {
    const userDetailsResponse = await apiClient.put<{ data: Tenant | Manager }>(route, body);
    return {
      cognitoInfo: { ...user },
      userInfo: userDetailsResponse.data.data,
      userRole,
    };
  } catch (error) {
    throw error;
  }
};

export { updateUser };
