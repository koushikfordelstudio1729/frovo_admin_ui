import { api } from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
  message: string;
}

export const authAPI = {
  login: (credentials: LoginCredentials) => {
    return api.post<AuthResponse>('/auth/login', credentials);
  },

  register: (userData: RegisterData) => {
    return api.post<AuthResponse>('/auth/register', userData);
  },

  logout: () => {
    return api.post('/auth/logout');
  },

  verifyToken: () => {
    return api.get('/auth/verify');
  },

  refreshToken: () => {
    return api.post('/auth/refresh');
  },
};