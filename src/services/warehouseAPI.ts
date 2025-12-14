import { api } from './api';
import { apiConfig } from '@/config/admin';
import type {
  WarehousesResponse,
  WarehouseResponse,
  CreateWarehousePayload,
  UpdateWarehousePayload,
  WarehouseSearchParams,
} from '@/types';

export const warehouseAPI = {
  // Get all warehouses with pagination and optional filters
  getWarehouses: async (params?: WarehouseSearchParams) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const url = `${apiConfig.endpoints.warehouses.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<WarehousesResponse>(url);
  },

  // Get warehouse by ID
  getWarehouseById: async (id: string) => {
    return api.get<WarehouseResponse>(apiConfig.endpoints.warehouses.getById(id));
  },

  // Create new warehouse
  createWarehouse: async (data: CreateWarehousePayload) => {
    return api.post<WarehouseResponse>(apiConfig.endpoints.warehouses.create, data);
  },

  // Update warehouse
  updateWarehouse: async (id: string, data: UpdateWarehousePayload) => {
    return api.put<WarehouseResponse>(apiConfig.endpoints.warehouses.update(id), data);
  },

  // Delete warehouse
  deleteWarehouse: async (id: string) => {
    return api.delete<WarehouseResponse>(apiConfig.endpoints.warehouses.delete(id));
  },

  // Reassign warehouse manager
  reassignManager: async (id: string, managerId: string) => {
    return api.put<WarehouseResponse>(apiConfig.endpoints.warehouses.update(id), {
      manager: managerId,
    });
  },

  // Deactivate warehouse
  deactivateWarehouse: async (id: string) => {
    return api.put<WarehouseResponse>(apiConfig.endpoints.warehouses.update(id), {
      isActive: false,
    });
  },

  // Activate warehouse
  activateWarehouse: async (id: string) => {
    return api.put<WarehouseResponse>(apiConfig.endpoints.warehouses.update(id), {
      isActive: true,
    });
  },

  // Get warehouse manager's assigned warehouse
  getMyWarehouse: async () => {
    return api.get<WarehouseResponse>(apiConfig.endpoints.warehouses.myWarehouse);
  },
};
