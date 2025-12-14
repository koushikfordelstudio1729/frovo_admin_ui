export interface WarehouseManager {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface WarehouseCreatedBy {
  _id: string;
  name: string;
  email: string;
}

export interface Warehouse {
  _id: string;
  name: string;
  code: string;
  partner: string;
  location: string;
  capacity: number;
  manager: WarehouseManager | null;
  isActive: boolean;
  createdBy: WarehouseCreatedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateWarehousePayload {
  name: string;
  code: string;
  partner: string;
  location: string;
  capacity: number;
  manager: string; // USER_ID
}

export interface UpdateWarehousePayload {
  name?: string;
  code?: string;
  partner?: string;
  location?: string;
  capacity?: number;
  manager?: string; // USER_ID
  isActive?: boolean;
}

export interface WarehousePagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface WarehousesResponse {
  success: boolean;
  message: string;
  data: {
    warehouses: Warehouse[];
    pagination: WarehousePagination;
  };
  timestamp: string;
}

export interface WarehouseManagerDetails {
  _id: string;
  name: string;
  email: string;
  phone: string;
  roles: Array<{
    id: string;
    name: string;
    key: string;
  }>;
  permissions: string[];
}

export interface WarehouseResponse {
  success: boolean;
  message: string;
  data: {
    warehouse: Warehouse;
    manager: WarehouseManagerDetails;
  };
  timestamp: string;
}

export interface WarehouseSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Dashboard Types
export interface DashboardKPIs {
  inbound: number;
  outbound: number;
  pendingQC: number;
  todayDispatches: number;
}

export interface DashboardAlert {
  type: string;
  message: string;
  count: number;
}

export interface RecentActivity {
  type: 'inbound' | 'outbound';
  message: string;
  timestamp: string;
  user: string;
}

export interface PendingVsRefill {
  days: string[];
  pendingPercentages: number[];
  refillPercentages: number[];
}

export interface DashboardFilters {
  categories: string[];
  partners: string[];
}

export interface WarehouseInfo {
  name: string;
  pendingBatches: number;
}

export interface DashboardData {
  kpis: DashboardKPIs;
  alerts: DashboardAlert[];
  recentActivities: RecentActivity[];
  pendingVsRefill: PendingVsRefill;
  filters: DashboardFilters;
  warehouseInfo: WarehouseInfo;
}

export interface DashboardResponse {
  success: boolean;
  message: string;
  data: DashboardData;
  timestamp: string;
}

export interface DashboardParams {
  date?: string; // 'today' | 'this_week' | 'this_month' | specific date
  category?: string;
  partner?: string;
}
