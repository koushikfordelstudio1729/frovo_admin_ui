export interface Department {
  _id: string;
  name: string;
  systemName: string;
  description: string;
  roles: string[];
  members: string[];
  createdBy: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
  id: string;
  memberCount?: number;
  roleCount?: number;
}

export interface Role {
  _id: string;
  name: string;
  key: string;
  systemRole: string;
  description: string;
  type: string;
  department: string;
  permissions: string[];
  scope: {
    level: string;
    entities: string[];
  };
  uiAccess: string;
  status: string;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface User {
  _id: string;
  id: string;
  email: string;
  name: string;
  departments: Department[];
  roles: Role[];
  status: string;
  mfaEnabled: boolean;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  lastLogin?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}