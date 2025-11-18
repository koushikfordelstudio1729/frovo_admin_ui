import { env } from './environment';

export const apiConfig = {
  baseURL: env.apiUrl,
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,
  
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  endpoints: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh',
      verify: '/auth/verify',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    user: {
      profile: '/user/profile',
      updateProfile: '/user/profile',
      changePassword: '/user/change-password',
    },
  },

  statusCodes: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },
};