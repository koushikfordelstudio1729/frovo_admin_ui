import { api } from './api';
import { apiConfig } from '../config';
import type { LoginCredentials, RegisterData, AuthResponse, RefreshTokenResponse } from '../types';

export const authAPI = {
  login: (credentials: LoginCredentials) => {
    return api.post<AuthResponse>(apiConfig.endpoints.auth.login, credentials);
  },

  register: (userData: RegisterData) => {
    return api.post<AuthResponse>(apiConfig.endpoints.auth.register, userData);
  },

  logout: () => {
    return api.post(apiConfig.endpoints.auth.logout);
  },

  verifyToken: () => {
    return api.get(apiConfig.endpoints.auth.verify);
  },

  refreshToken: (refreshToken: string) => {
    return api.post<RefreshTokenResponse>(apiConfig.endpoints.auth.refresh, {
      refreshToken,
    });
  },
};