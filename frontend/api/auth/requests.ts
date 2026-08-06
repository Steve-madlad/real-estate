import { apiClient } from '@/lib/http-client';
import { Manager, Tenant } from '@/types/prismaTypes';
import { AuthUser, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import axios from 'axios';
import { UserRole } from './types';
import { isUserRole } from '@/lib/utils';

const getAuthUser = async (): Promise<User> => {
  const session = await fetchAuthSession();
  const { idToken } = session.tokens ?? {};
  const user = await getCurrentUser();
  const userRole = idToken?.payload['custom:role'] as UserRole;

  if (!isUserRole(userRole)) {
    throw new Error('Missing or invalid user role');
  }

  const route = `/${userRole}s/${user.userId}`;
  try {
    const userDetailsResponse = await apiClient.get<{ data: Tenant | Manager }>(route);
    return {
      cognitoInfo: { ...user },
      userInfo: userDetailsResponse.data.data,
      userRole,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      const newUser = await createUser(user, idToken, userRole);
      return {
        cognitoInfo: { ...user },
        userInfo: newUser,
        userRole,
      };
    }

    throw error;
  }
};

const createUser = async (user: AuthUser, idToken: any, userRole: UserRole) => {
  const response = await apiClient.post(`/${userRole}s`, {
    cognitoId: user.userId,
    name: user.username,
    email: idToken?.payload?.email || '',
    phoneNumber: '',
  });

  if (response.status !== 201) {
    throw new Error('Failed to create user');
  }

  return response.data;
};

export { getAuthUser };
