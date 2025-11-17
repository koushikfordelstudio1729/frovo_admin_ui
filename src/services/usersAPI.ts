import { api } from './api';
import type { UsersResponse, UserQueryParams } from '../types';

export const usersAPI = {
  getUsers: (params?: UserQueryParams) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.role) queryParams.append('role', params.role);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';

    return api.get<UsersResponse>(endpoint);
  },

  searchUsers: (query: string, params?: Omit<UserQueryParams, 'search'>) => {
    const queryParams = new URLSearchParams();

    queryParams.append('q', query);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.role) queryParams.append('role', params.role);

    const queryString = queryParams.toString();
    return api.get<UsersResponse>(`/users/search?${queryString}`);
  },
};
