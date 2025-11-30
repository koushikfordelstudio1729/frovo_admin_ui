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
      refresh: '/auth/refresh-token',
      verify: '/auth/verify',
      me: '/auth/me',
      changePassword: '/auth/change-password',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },
    user: {
      profile: '/user/profile',
      updateProfile: '/user/profile',
    },
    permissions: '/permissions',
    roles: '/roles',
    departments: '/departments',
    users: {
      list: '/users',
      search: '/users/search',
      create: '/users',
      getById: (id: string) => `/users/${id}`,
      update: (id: string) => `/users/${id}`,
      delete: (id: string) => `/users/${id}`,
      updateStatus: (id: string) => `/users/${id}/status`,
      updatePassword: (id: string) => `/users/${id}/password`,
      getPermissions: (id: string) => `/users/${id}/permissions`,
      assignRoles: (id: string) => `/users/${id}/roles`,
      removeRole: (id: string, roleId: string) => `/users/${id}/roles/${roleId}`,
    },
    accessRequests: '/access-requests',
    auditLogs: '/audit-logs',
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