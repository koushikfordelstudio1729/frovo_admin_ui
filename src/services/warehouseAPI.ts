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
  GRNResponse,
  GRNsResponse,
  CreateGRNPayload,
  UpdateGRNStatusPayload,
  GRNParams,
  DispatchOrderResponse,
  DispatchOrdersResponse,
  CreateDispatchOrderPayload,
  UpdateDispatchStatusPayload,
  DispatchOrderParams,
  FieldAgentsResponse,
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
  createPurchaseOrder: async (data: CreatePurchaseOrderPayload | FormData) => {
    // If FormData, we need to let browser set Content-Type with boundary
    const config = data instanceof FormData
      ? {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      : undefined;

    return api.post<PurchaseOrderResponse>(
      apiConfig.endpoints.warehouse.purchaseOrders.create,
      data,
      config
    );
  },

  // Update purchase order status
  updatePurchaseOrderStatus: async (id: string, data: UpdatePOStatusPayload) => {
    return api.patch<PurchaseOrderResponse>(apiConfig.endpoints.warehouse.purchaseOrders.updateStatus(id), data);
  },

  // Delete purchase order
  deletePurchaseOrder: async (id: string) => {
    return api.delete<PurchaseOrderResponse>(apiConfig.endpoints.warehouse.purchaseOrders.delete(id));
  },

  // GRN (Goods Receipt Note) APIs
  // Get all GRNs with optional filters
  getGRNs: async (params?: GRNParams) => {
    const queryParams = new URLSearchParams();

    if (params?.qc_status) queryParams.append('qc_status', params.qc_status);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const url = `${apiConfig.endpoints.warehouse.grn.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<GRNsResponse>(url);
  },

  // Get GRN by ID
  getGRNById: async (id: string) => {
    return api.get<GRNResponse>(apiConfig.endpoints.warehouse.grn.getById(id));
  },

  // Create new GRN for a purchase order
  createGRN: async (poId: string, data: CreateGRNPayload) => {
    return api.post<GRNResponse>(apiConfig.endpoints.warehouse.grn.create(poId), data);
  },

  // Update GRN status
  updateGRNStatus: async (id: string, data: UpdateGRNStatusPayload) => {
    return api.patch<GRNResponse>(apiConfig.endpoints.warehouse.grn.updateStatus(id), data);
  },

  // Dispatch Order APIs
  // Get all dispatch orders with optional filters
  getDispatchOrders: async (params?: DispatchOrderParams) => {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);

    const url = `${apiConfig.endpoints.warehouse.dispatchOrders.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<DispatchOrdersResponse>(url);
  },

  // Get dispatch order by ID
  getDispatchOrderById: async (id: string) => {
    return api.get<DispatchOrderResponse>(apiConfig.endpoints.warehouse.dispatchOrders.getById(id));
  },

  // Create new dispatch order
  createDispatchOrder: async (data: CreateDispatchOrderPayload) => {
    return api.post<DispatchOrderResponse>(apiConfig.endpoints.warehouse.dispatchOrders.create, data);
  },

  // Update dispatch order status
  updateDispatchOrderStatus: async (id: string, data: UpdateDispatchStatusPayload) => {
    return api.patch<DispatchOrderResponse>(apiConfig.endpoints.warehouse.dispatchOrders.updateStatus(id), data);
  },

  // Field Agent APIs
  // Get all field agents
  getFieldAgents: async () => {
    return api.get<FieldAgentsResponse>(apiConfig.endpoints.warehouse.fieldAgents.list);
  },
};
