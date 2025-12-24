import { api } from "./api";
import {
  CheckInPayload,
  CheckInResponse,
  RouteProgressResponse,
  ReassignPayload,
  ReassignResponse,
  StatisticsResponse,
} from "@/types/tracking.types";

export const trackingAPI = {
  /**
   * Record a check-in for a machine (completed or skipped)
   */
  checkIn: async (payload: CheckInPayload): Promise<CheckInResponse> => {
    const response = await api.post<CheckInResponse>(
      "/area-route/tracking/check-in",
      payload
    );
    return response.data;
  },

  /**
   * Get route progress for today or specific date
   * @param routeId - Route ID
   * @param date - Optional date in YYYY-MM-DD format
   * @param agentId - Optional agent ID to filter by agent
   */
  getRouteProgress: async (
    routeId: string,
    date?: string,
    agentId?: string
  ): Promise<RouteProgressResponse> => {
    const params: any = {};
    if (date) params.date = date;
    if (agentId) params.agent_id = agentId;

    const response = await api.get<RouteProgressResponse>(
      `/area-route/tracking/progress/${routeId}`,
      { params }
    );
    return response.data;
  },

  /**
   * Reassign machines to a different agent
   */
  reassignMachines: async (
    payload: ReassignPayload
  ): Promise<ReassignResponse> => {
    const response = await api.post<ReassignResponse>(
      "/area-route/tracking/reassign",
      payload
    );
    return response.data;
  },

  /**
   * Get statistics for areas and routes
   */
  getStatistics: async (): Promise<StatisticsResponse> => {
    const response = await api.get<StatisticsResponse>("/area-route/statistics");
    return response.data;
  },
};
