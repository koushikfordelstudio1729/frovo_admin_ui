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
  FieldAgentResponse,
  CreateFieldAgentPayload,
  FieldAgentParams,
  QCTemplateResponse,
  QCTemplatesResponse,
  CreateQCTemplatePayload,
  UpdateQCTemplatePayload,
  QCTemplateParams,
  ReturnOrderResponse,
  ReturnQueueResponse,
  CreateReturnOrderPayload,
  ReturnQueueParams,
  InventoryDashboardResponse,
  InventoryStatsResponse,
  InventoryItemResponse,
  InventoryDashboardParams,
  UpdateInventoryItemPayload,
  BulkArchivePayload,
  ArchivedInventoryResponse,
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
  // Get all field agents with optional filters
  getFieldAgents: async (params?: FieldAgentParams) => {
    const queryParams = new URLSearchParams();

    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const url = `${apiConfig.endpoints.warehouse.fieldAgents.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<FieldAgentsResponse>(url);
  },

  // Create new field agent
  createFieldAgent: async (data: CreateFieldAgentPayload) => {
    return api.post<FieldAgentResponse>(apiConfig.endpoints.warehouse.fieldAgents.create, data);
  },

  // QC Template APIs
  // Get all QC templates with optional filters
  getQCTemplates: async (params?: QCTemplateParams) => {
    const queryParams = new URLSearchParams();

    if (params?.sku) queryParams.append('sku', params.sku);

    const url = `${apiConfig.endpoints.warehouse.qcTemplates.list}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<QCTemplatesResponse>(url);
  },

  // Get QC template by ID
  getQCTemplateById: async (id: string) => {
    return api.get<QCTemplateResponse>(apiConfig.endpoints.warehouse.qcTemplates.getById(id));
  },

  // Create new QC template
  createQCTemplate: async (data: CreateQCTemplatePayload) => {
    return api.post<QCTemplateResponse>(apiConfig.endpoints.warehouse.qcTemplates.create, data);
  },

  // Update QC template
  updateQCTemplate: async (id: string, data: UpdateQCTemplatePayload) => {
    return api.put<QCTemplateResponse>(apiConfig.endpoints.warehouse.qcTemplates.update(id), data);
  },

  // Delete QC template
  deleteQCTemplate: async (id: string) => {
    return api.delete<QCTemplateResponse>(apiConfig.endpoints.warehouse.qcTemplates.delete(id));
  },

  // Return Order APIs
  // Get return queue with optional filters
  getReturnQueue: async (params?: ReturnQueueParams) => {
    const queryParams = new URLSearchParams();

    if (params?.status) queryParams.append('status', params.status);
    if (params?.returnType) queryParams.append('returnType', params.returnType);

    const url = `${apiConfig.endpoints.warehouse.returns.queue}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ReturnQueueResponse>(url);
  },

  // Create new return order
  createReturnOrder: async (data: CreateReturnOrderPayload) => {
    return api.post<ReturnOrderResponse>(apiConfig.endpoints.warehouse.returns.create, data);
  },

  // Approve return order
  approveReturn: async (id: string) => {
    return api.patch<ReturnOrderResponse>(apiConfig.endpoints.warehouse.returns.approve(id), {});
  },

  // Reject return order
  rejectReturn: async (id: string) => {
    return api.patch<ReturnOrderResponse>(apiConfig.endpoints.warehouse.returns.reject(id), {});
  },

  // Inventory APIs
  // Get inventory dashboard with pagination and filters
  getInventoryDashboard: async (warehouseId: string, params?: InventoryDashboardParams) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.status) queryParams.append('status', params.status);
    if (params?.expiryStatus) queryParams.append('expiryStatus', params.expiryStatus);
    if (params?.sku) queryParams.append('sku', params.sku);
    if (params?.batchId) queryParams.append('batchId', params.batchId);

    const url = `${apiConfig.endpoints.warehouse.inventory.dashboard(warehouseId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<InventoryDashboardResponse>(url);
  },

  // Get inventory statistics for a warehouse
  getInventoryStats: async (warehouseId: string) => {
    return api.get<InventoryStatsResponse>(apiConfig.endpoints.warehouse.inventory.stats(warehouseId));
  },

  // Get inventory item by ID
  getInventoryItemById: async (id: string) => {
    return api.get<InventoryItemResponse>(apiConfig.endpoints.warehouse.inventory.getById(id));
  },

  // Update inventory item
  updateInventoryItem: async (id: string, data: UpdateInventoryItemPayload) => {
    return api.put<InventoryItemResponse>(apiConfig.endpoints.warehouse.inventory.update(id), data);
  },

  // Archive inventory item
  archiveInventoryItem: async (id: string) => {
    return api.patch<InventoryItemResponse>(apiConfig.endpoints.warehouse.inventory.archive(id), {});
  },

  // Unarchive inventory item
  unarchiveInventoryItem: async (id: string) => {
    return api.patch<InventoryItemResponse>(apiConfig.endpoints.warehouse.inventory.unarchive(id), {});
  },

  // Get archived inventory with pagination
  getArchivedInventory: async (warehouseId: string, params?: InventoryDashboardParams) => {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const url = `${apiConfig.endpoints.warehouse.inventory.archived(warehouseId)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return api.get<ArchivedInventoryResponse>(url);
  },

  // Bulk archive inventory items
  bulkArchiveInventory: async (data: BulkArchivePayload) => {
    return api.post<InventoryItemResponse>(apiConfig.endpoints.warehouse.inventory.bulkArchive, data);
  },

  // Bulk unarchive inventory items
  bulkUnarchiveInventory: async (data: BulkArchivePayload) => {
    return api.post<InventoryItemResponse>(apiConfig.endpoints.warehouse.inventory.bulkUnarchive, data);
  },

  // Report APIs
  // Get all report types
  getReportTypes: async () => {
    return api.get<any>(apiConfig.endpoints.warehouse.reports.types);
  },

  // Get inventory summary report
  getInventorySummaryReport: async (warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.reports.inventorySummary}?warehouseId=${warehouseId}`;
    return api.get<any>(url);
  },

  // Get purchase orders report
  getPurchaseOrdersReport: async (warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.reports.purchaseOrders}?warehouseId=${warehouseId}`;
    return api.get<any>(url);
  },

  // Get inventory turnover report
  getInventoryTurnoverReport: async (warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.reports.inventoryTurnover}?warehouseId=${warehouseId}`;
    return api.get<any>(url);
  },

  // Get QC summary report
  getQCSummaryReport: async (warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.reports.qcSummary}?warehouseId=${warehouseId}`;
    return api.get<any>(url);
  },

  // Get efficiency report
  getEfficiencyReport: async (warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.reports.efficiency}?warehouseId=${warehouseId}`;
    return api.get<any>(url);
  },

  // Get stock ageing report
  getStockAgeingReport: async (warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.reports.stockAgeing}?warehouseId=${warehouseId}`;
    return api.get<any>(url);
  },

  // Get generic report
  getGenericReport: async (type: string, warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.reports.generic}?type=${type}&warehouseId=${warehouseId}`;
    return api.get<any>(url);
  },

  // Export report
  exportReport: async (type: string, format: 'csv' | 'json', warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.reports.export}?type=${type}&format=${format}&warehouseId=${warehouseId}`;

    if (format === 'csv') {
      // For CSV, we need to handle it differently to download the file
      return api.get(url, {
        responseType: 'blob',
      });
    }

    return api.get<any>(url);
  },

  // Expense APIs
  // Create expense
  createExpense: async (data: any) => {
    return api.post<any>(apiConfig.endpoints.warehouse.expenses.create, data);
  },

  // Get all expenses
  getExpenses: async (warehouseId: string, filters?: { category?: string; status?: string }) => {
    let url = `${apiConfig.endpoints.warehouse.expenses.list}?warehouseId=${warehouseId}`;

    if (filters?.category) {
      url += `&category=${filters.category}`;
    }
    if (filters?.status) {
      url += `&status=${filters.status}`;
    }

    return api.get<any>(url);
  },

  // Get expense by ID
  getExpenseById: async (id: string) => {
    return api.get<any>(apiConfig.endpoints.warehouse.expenses.getById(id));
  },

  // Update expense
  updateExpense: async (id: string, data: any) => {
    return api.put<any>(apiConfig.endpoints.warehouse.expenses.update(id), data);
  },

  // Upload bill for expense
  uploadExpenseBill: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('document', file);

    return api.post<any>(
      apiConfig.endpoints.warehouse.expenses.uploadBill(id),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  // Delete expense
  deleteExpense: async (id: string) => {
    return api.delete<any>(apiConfig.endpoints.warehouse.expenses.delete(id));
  },

  // Update expense status
  updateExpenseStatus: async (id: string, data: any) => {
    return api.patch<any>(apiConfig.endpoints.warehouse.expenses.updateStatus(id), data);
  },

  // Update expense payment status
  updateExpensePaymentStatus: async (id: string, data: any) => {
    return api.patch<any>(apiConfig.endpoints.warehouse.expenses.updatePaymentStatus(id), data);
  },

  // Get expense summary
  getExpenseSummary: async (warehouseId: string) => {
    const url = `${apiConfig.endpoints.warehouse.expenses.summary}?warehouseId=${warehouseId}`;
    return api.get<any>(url);
  },

  // Get monthly expense trend
  getMonthlyExpenseTrend: async (warehouseId: string, months: number = 12) => {
    const url = `${apiConfig.endpoints.warehouse.expenses.monthlyTrend}?warehouseId=${warehouseId}&months=${months}`;
    return api.get<any>(url);
  },

  // Vendor APIs
  // Get all vendors
  getVendors: async () => {
    return api.get<any>(apiConfig.endpoints.vendor.list);
  },
};
