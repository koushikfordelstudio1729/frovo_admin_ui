import { api } from './api';
import { apiConfig } from '@/config/api.config';
import {
  CreateRoutePayload,
  UpdateRoutePayload,
  RouteResponse,
  RouteListResponse,
  RouteByAreaResponse,
} from '@/types/route.types';

export const routeAPI = {
  // Get all routes with pagination
  getAllRoutes: async (page: number = 1, limit: number = 10): Promise<RouteListResponse> => {
    const response = await api.get<RouteListResponse>(
      `${apiConfig.endpoints.route.routePlanning.list}?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  // Get route by ID
  getRouteById: async (id: string): Promise<RouteResponse> => {
    const response = await api.get<RouteResponse>(
      apiConfig.endpoints.route.routePlanning.getById(id)
    );
    return response.data;
  },

  // Get routes by area ID
  getRoutesByArea: async (areaId: string): Promise<RouteByAreaResponse> => {
    const response = await api.get<RouteByAreaResponse>(
      apiConfig.endpoints.route.routePlanning.getByArea(areaId)
    );
    return response.data;
  },

  // Create new route (handles daily, weekly, and custom)
  createRoute: async (payload: CreateRoutePayload): Promise<RouteResponse> => {
    const response = await api.post<RouteResponse>(
      apiConfig.endpoints.route.routePlanning.create,
      payload
    );
    return response.data;
  },

  // Update existing route
  updateRoute: async (id: string, payload: UpdateRoutePayload): Promise<RouteResponse> => {
    const response = await api.put<RouteResponse>(
      apiConfig.endpoints.route.routePlanning.update(id),
      payload
    );
    return response.data;
  },

  // Delete route
  deleteRoute: async (id: string): Promise<RouteResponse> => {
    const response = await api.delete<RouteResponse>(
      apiConfig.endpoints.route.routePlanning.delete(id)
    );
    return response.data;
  },

  // Helper method to create daily route
  createDailyRoute: async (
    route_name: string,
    area_name: string,
    route_description: string,
    selected_machine: string[],
    notes?: string,
    machine_sequence?: string[]
  ): Promise<RouteResponse> => {
    return routeAPI.createRoute({
      route_name,
      area_name,
      route_description,
      selected_machine,
      frequency_type: 'daily',
      notes,
      machine_sequence,
    });
  },

  // Helper method to create weekly route
  createWeeklyRoute: async (
    route_name: string,
    area_name: string,
    route_description: string,
    selected_machine: string[],
    weekly_days: string[],
    notes?: string,
    machine_sequence?: string[]
  ): Promise<RouteResponse> => {
    return routeAPI.createRoute({
      route_name,
      area_name,
      route_description,
      selected_machine,
      frequency_type: 'weekly',
      weekly_days,
      notes,
      machine_sequence,
    });
  },

  // Helper method to create custom route
  createCustomRoute: async (
    route_name: string,
    area_name: string,
    route_description: string,
    selected_machine: string[],
    custom_dates: string[],
    notes?: string
  ): Promise<RouteResponse> => {
    return routeAPI.createRoute({
      route_name,
      area_name,
      route_description,
      selected_machine,
      frequency_type: 'custom',
      custom_dates,
      notes,
    });
  },
};
