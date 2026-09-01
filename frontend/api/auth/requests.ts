import { apiClient } from '@/lib/http-client';
import { isUserRole } from '@/lib/utils';
import { UserRole } from '@/types';
import { Manager, TenantWithFavorites } from '@/types/prismaTypes';
import { AuthUser, fetchAuthSession, getCurrentUser, JWT } from 'aws-amplify/auth';
import axios from 'axios';
import { AuthUserResponse, CreateUserResponse } from './types';

const getAuthUser = async (): Promise<User<TenantWithFavorites>> => {
  const session = await fetchAuthSession();
  const { idToken } = session.tokens ?? {};
  const userRole = idToken?.payload['custom:role'] as UserRole;
  const user = await getCurrentUser();

  if (!isUserRole(userRole)) {
    throw new Error('Missing or invalid user role');
  }

  const route = `/${userRole}s/${user.userId}`;
  try {
    const userDetailsResponse = await apiClient.get<AuthUserResponse>(route);
    if (userRole === 'tenant') {
      return {
        userRole: 'tenant',
        cognitoInfo: { ...user },
        userInfo: userDetailsResponse.data.data as TenantWithFavorites,
      };
    } else {
      return {
        userRole: 'manager',
        cognitoInfo: { ...user },
        userInfo: userDetailsResponse.data.data as Manager,
      };
    }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404 && idToken) {
      const newUser = await createUser(user, idToken, userRole);
      if (userRole === 'tenant') {
        return {
          userRole: 'tenant',
          cognitoInfo: { ...user },
          userInfo: newUser.data as TenantWithFavorites,
        };
      } else {
        return {
          userRole: 'manager',
          cognitoInfo: { ...user },
          userInfo: newUser.data as Manager,
        };
      }
    }

    throw error;
  }
};

const createUser = async (
  user: AuthUser,
  idToken: JWT,
  userRole: UserRole,
): Promise<CreateUserResponse> => {
  const response = await apiClient.post(`/${userRole}s`, {
    cognitoId: user.userId,
    name: user.username,
    email: idToken?.payload.email || '',
    phoneNumber: '',
  });

  if (response.status !== 201) {
    throw new Error('Failed to create user');
  }

  return response.data;
};

export { getAuthUser };
