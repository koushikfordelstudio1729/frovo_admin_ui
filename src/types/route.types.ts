// Route Planning Types

export type FrequencyType = "daily" | "weekly" | "custom";

export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface AreaInfo {
  _id: string;
  area_name: string;
  select_machine: string[];
  status: "active" | "inactive";
  latitude?: number;
  longitude?: number;
  address?: string;
}

export interface Route {
  _id: string;
  route_name: string;
  area_name: AreaInfo | string;
  street_name?: string;
  route_description: string;
  selected_machine: string[];
  frequency_type: FrequencyType;
  weekly_days?: WeekDay[];
  custom_dates?: string[];
  notes?: string;
  machine_sequence?: string[];
  machine_count?: number;
  total_machines?: number;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateRoutePayload {
  route_name: string;
  area_name: string; // area ID
  street_name?: string;
  route_description: string;
  selected_machine: string[];
  frequency_type: FrequencyType;
  weekly_days?: WeekDay[];
  custom_dates?: string[];
  notes?: string;
  machine_sequence?: string[];
}

export interface UpdateRoutePayload {
  route_name?: string;
  street_name?: string;
  route_description?: string;
  selected_machine?: string[];
  frequency_type?: FrequencyType;
  weekly_days?: WeekDay[];
  custom_dates?: string[];
  notes?: string;
  machine_sequence?: string[];
}

export interface RouteResponse {
  success: boolean;
  message: string;
  data: Route;
}

export interface RoutesResponse {
  success: boolean;
  message: string;
  data: Route[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    limit: number;
  };
  count?: number;
}

export interface RouteParams {
  page?: number;
  limit?: number;
  area_id?: string;
  frequency_type?: FrequencyType;
}
