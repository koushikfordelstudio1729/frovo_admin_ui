export interface UserRole {
  name: string;
  key: string;
  systemRole: string;
  id: string;
}

export interface UserDepartment {
  name: string;
  systemName: string;
  id: string;
  memberCount?: number;
  roleCount?: number;
}

export interface RefreshToken {
  token: string;
  createdAt: string;
  expiresAt: string;
  ipAddress: string;
  userAgent: string;
  _id: string;
  id: string;
}

export interface CreatedBy {
  name: string;
  email: string;
  id: string;
}

export interface UserListItem {
  name: string;
  email: string;
  phone?: string;
  departments: UserDepartment[];
  roles: UserRole[];
  status: string;
  mfaEnabled: boolean;
  createdBy: CreatedBy | null;
  refreshTokens: RefreshToken[];
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  id: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface UsersResponse {
  success: boolean;
  message: string;
  data: UserListItem[];
  pagination: PaginationMeta;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  status?: string;
  role?: string;
}
