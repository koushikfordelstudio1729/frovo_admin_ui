import { api } from './api';
import { apiConfig } from '@/config/api.config';
import type {
  AreasResponse,
  AreaResponse,
  CreateAreaPayload,
  UpdateAreaPayload,
  AreaParams,
} from '@/types';

export const areaAPI = {
  // Get all areas with pagination and optional filters
  getAreas: async (params?: AreaParams) => {
    const response = await api.get<AreasResponse>(apiConfig.endpoints.area.list, {
      params,
    });
    return response.data;
  },

  // Get area by ID
  getAreaById: async (id: string) => {
    const response = await api.get<AreaResponse>(
      apiConfig.endpoints.area.getById(id)
    );
    return response.data;
  },

  // Create new area
  createArea: async (payload: CreateAreaPayload) => {
    const response = await api.post<AreaResponse>(
      apiConfig.endpoints.area.create,
      payload
    );
    return response.data;
  },

  // Update area
  updateArea: async (id: string, payload: UpdateAreaPayload) => {
    const response = await api.put<AreaResponse>(
      apiConfig.endpoints.area.update(id),
      payload
    );
    return response.data;
  },

  // Delete/Deactivate area (sets status to inactive)
  deleteArea: async (id: string) => {
    const response = await api.delete<AreaResponse>(
      apiConfig.endpoints.area.delete(id)
    );
    return response.data;
  },
};
