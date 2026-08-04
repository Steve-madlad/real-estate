import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const session = await fetchAuthSession();
    const { idToken } = session.tokens ?? {};
    if (idToken) {
      config.headers?.set('Authorization', `Bearer ${idToken}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export { apiClient };
