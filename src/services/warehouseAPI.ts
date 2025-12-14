import { api } from './api';
import { apiConfig } from '@/config/api.config';
import type {
  WarehousesResponse,
  WarehouseResponse,
  CreateWarehousePayload,
  UpdateWarehousePayload,
  WarehouseSearchParams,
  DashboardResponse,
  DashboardParams,
  PurchaseOrderResponse,
  PurchaseOrdersResponse,
  CreatePurchaseOrderPayload,
  UpdatePOStatusPayload,
  PurchaseOrderParams,
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

    const url = `${apiConfig.endpoints.admin.warehouses.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<WarehousesResponse>(url);
  },

  // Get warehouse by ID
  getWarehouseById: async (id: string) => {
    return api.get<WarehouseResponse>(apiConfig.endpoints.admin.warehouses.getById(id));
  },

  // Create new warehouse
  createWarehouse: async (data: CreateWarehousePayload) => {
    return api.post<WarehouseResponse>(apiConfig.endpoints.admin.warehouses.create, data);
  },

  // Update warehouse
  updateWarehouse: async (id: string, data: UpdateWarehousePayload) => {
    return api.put<WarehouseResponse>(apiConfig.endpoints.admin.warehouses.update(id), data);
  },

  // Delete warehouse
  deleteWarehouse: async (id: string) => {
    return api.delete<WarehouseResponse>(apiConfig.endpoints.admin.warehouses.delete(id));
  },

  // Reassign warehouse manager
  reassignManager: async (id: string, managerId: string) => {
    return api.put<WarehouseResponse>(apiConfig.endpoints.admin.warehouses.update(id), {
      manager: managerId,
    });
  },

  // Deactivate warehouse
  deactivateWarehouse: async (id: string) => {
    return api.put<WarehouseResponse>(apiConfig.endpoints.admin.warehouses.update(id), {
      isActive: false,
    });
  },

  // Activate warehouse
  activateWarehouse: async (id: string) => {
    return api.put<WarehouseResponse>(apiConfig.endpoints.admin.warehouses.update(id), {
      isActive: true,
    });
  },

  // Get warehouse manager's assigned warehouse
  getMyWarehouse: async () => {
    return api.get<WarehouseResponse>(apiConfig.endpoints.warehouse.myWarehouse);
  },

  // Get warehouse dashboard data
  getDashboard: async (params?: DashboardParams) => {
    const queryParams = new URLSearchParams();

    if (params?.date) queryParams.append('date', params.date);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.partner) queryParams.append('partner', params.partner);

    const url = `${apiConfig.endpoints.warehouse.dashboard}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<DashboardResponse>(url);
  },

  // Purchase Order APIs
  // Get all purchase orders with optional filters
  getPurchaseOrders: async (params?: PurchaseOrderParams) => {
    const queryParams = new URLSearchParams();

    if (params?.po_status) queryParams.append('po_status', params.po_status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.vendor) queryParams.append('vendor', params.vendor);

    const url = `${apiConfig.endpoints.warehouse.purchaseOrders.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<PurchaseOrdersResponse>(url);
  },

  // Get purchase order by ID
  getPurchaseOrderById: async (id: string) => {
    return api.get<PurchaseOrderResponse>(apiConfig.endpoints.warehouse.purchaseOrders.getById(id));
  },

  // Create new purchase order
  createPurchaseOrder: async (data: CreatePurchaseOrderPayload) => {
    return api.post<PurchaseOrderResponse>(apiConfig.endpoints.warehouse.purchaseOrders.create, data);
  },

  // Update purchase order status
  updatePurchaseOrderStatus: async (id: string, data: UpdatePOStatusPayload) => {
    return api.patch<PurchaseOrderResponse>(apiConfig.endpoints.warehouse.purchaseOrders.updateStatus(id), data);
  },

  // Delete purchase order
  deletePurchaseOrder: async (id: string) => {
    return api.delete<PurchaseOrderResponse>(apiConfig.endpoints.warehouse.purchaseOrders.delete(id));
  },
};
