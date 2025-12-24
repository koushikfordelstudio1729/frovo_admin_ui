// Tracking Types

export type CheckInStatus = "completed" | "pending" | "skipped";

export interface CheckInPayload {
  route_id: string;
  machine_id: string;
  agent_id: string;
  status: CheckInStatus;
  planned_sequence: number;
  actual_sequence: number;
  notes?: string;
}

export interface CheckInData {
  route_id: string;
  machine_id: string;
  agent_id: string;
  status: CheckInStatus;
  planned_sequence: number;
  actual_sequence: number;
  notes?: string;
  date: string;
  _id: string;
  check_in_time: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CheckInResponse {
  success: boolean;
  message: string;
  data: CheckInData;
}

export interface MachineProgress {
  machine_id: string;
  planned_sequence: string;
  check_in_status: CheckInStatus;
  check_in_time: string | null;
  deviation_alert: string | null;
}

export interface RouteProgressSummary {
  total_machines: number;
  completed: number;
  pending: number;
  skipped: number;
}

export interface RouteInfo {
  route_id: string;
  route_name: string;
  area_name: {
    _id: string;
    area_name: string;
  };
  date: string;
}

export interface RouteProgressData {
  route_info: RouteInfo;
  summary: RouteProgressSummary;
  machine_progress: MachineProgress[];
}

export interface RouteProgressResponse {
  success: boolean;
  message: string;
  data: RouteProgressData;
}

export interface ReassignPayload {
  route_id: string;
  machine_ids: string[];
  original_agent_id: string;
  reassigned_agent_id: string;
  reason?: string;
}

export interface ReassignmentData {
  route_id: string;
  machine_id: string;
  original_agent_id: string;
  reassigned_agent_id: string;
  reassignment_date: string;
  reason?: string;
  _id: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface ReassignResponse {
  success: boolean;
  message: string;
  data: {
    reassignment_count: number;
    reassignments: ReassignmentData[];
  };
}

export interface AreaWithRouteCount {
  _id: string;
  routeCount: number;
  areaId: string;
  areaName: string;
  areaStatus: string;
}

export interface StatisticsData {
  areas: {
    total: number;
    active: number;
    inactive: number;
  };
  routes: {
    total: number;
    daily: number;
    weekly: number;
    monthly: number;
  };
  areasWithRouteCount: AreaWithRouteCount[];
  summary: {
    averageRoutesPerArea: string;
    activeAreasPercentage: string;
  };
}

export interface StatisticsResponse {
  success: boolean;
  message: string;
  data: StatisticsData;
}
