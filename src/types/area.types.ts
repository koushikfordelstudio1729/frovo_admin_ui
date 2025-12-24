// Area Management Types

export interface Area {
  _id: string;
  area_name: string;
  select_machine: string[];
  area_description: string;
  status: 'active' | 'inactive';
  latitude?: number;
  longitude?: number;
  address?: string;
  total_machines?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateAreaPayload {
  area_name: string;
  select_machine: string[];
  area_description: string;
  status: 'active' | 'inactive';
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface UpdateAreaPayload {
  area_name?: string;
  select_machine?: string[];
  area_description?: string;
  status?: 'active' | 'inactive';
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface AreaResponse {
  success: boolean;
  message: string;
  data: Area;
}

export interface AreasResponse {
  success: boolean;
  message: string;
  data: Area[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
}

export interface AreaParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  search?: string;
}
