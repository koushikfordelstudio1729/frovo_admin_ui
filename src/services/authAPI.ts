import { api } from './api';
import { apiConfig } from '../config';
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  RefreshTokenResponse,
  CurrentUserResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
  LogoutResponse
} from '../types';

export const authAPI = {
  login: (credentials: LoginCredentials) => {
    return api.post<AuthResponse>(apiConfig.endpoints.auth.login, credentials);
  },

  register: (userData: RegisterData) => {
    return api.post<AuthResponse>(apiConfig.endpoints.auth.register, userData);
  },

  logout: () => {
    return api.post<LogoutResponse>(apiConfig.endpoints.auth.logout);
  },

  verifyToken: () => {
    return api.get(apiConfig.endpoints.auth.verify);
  },

  refreshToken: (refreshToken: string) => {
    return api.post<RefreshTokenResponse>(apiConfig.endpoints.auth.refresh, {
      refreshToken,
    });
  },

  getCurrentUser: () => {
    return api.get<CurrentUserResponse>(apiConfig.endpoints.auth.me);
  },

  changePassword: (data: ChangePasswordRequest) => {
    return api.post<ChangePasswordResponse>(apiConfig.endpoints.auth.changePassword, data);
  },
};