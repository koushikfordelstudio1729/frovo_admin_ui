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
    name: string | undefined;
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
  sortOrder?: "asc" | "desc";
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
  type: "inbound" | "outbound";
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

// Purchase Order Types
export interface POLineItem {
  _id?: string;
  line_no: number;
  sku: string;
  productName: string;
  quantity: number;
  category: string;
  pack_size: string;
  uom: string;
  unit_price: number;
  expected_delivery_date: string;
  location: string;
  images?: AttachmentFile[];
}

export interface VendorDetails {
  vendor_name: string;
  vendor_billing_name: string;
  vendor_email: string;
  vendor_phone: string;
  vendor_category: string;
  gst_number: string;
  verification_status: string;
  vendor_address: string;
  vendor_contact: string;
  vendor_id: string;
}

export interface VendorInfo {
  _id: string;
  vendor_name: string;
  vendor_email: string;
}

export interface Vendor {
  _id: string;
  vendor_name: string;
  vendor_billing_name: string;
  vendor_type: string[];
  vendor_category: string;
  primary_contact_name: string;
  contact_phone: string;
  vendor_email: string;
  vendor_address: string;
  vendor_id: string;
  cin?: string;
  company_registration_number?: string;
  bank_account_number: string;
  ifsc_code: string;
  payment_terms: string;
  payment_methods: string;
  gst_number: string;
  pan_number: string;
  tds_rate: number;
  billing_cycle: string;
  vendor_status_cycle: string;
  verification_status: string;
  risk_rating: string;
  risk_notes: string;
  contract_terms: string;
  contract_expiry_date: string;
  contract_renewal_date: string;
  internal_notes: string;
  createdBy: CreatedByInfo;
  verified_by?: CreatedByInfo;
  documents: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface VendorsResponse {
  success: boolean;
  data: {
    vendors: Vendor[];
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface CreatedByInfo {
  name: string;
  email: string;
  id: string;
}

export type POStatus =
  | "draft"
  | "approved"
  | "received"
  | "delivered"
  | "cancelled";

export interface AttachmentFile {
  _id: string;
  file_name: string;
  file_url: string;
  cloudinary_public_id?: string;
  file_size: number;
  mime_type: string;
  uploaded_at?: string;
}

export interface PurchaseOrder {
  _id: string;
  po_number: string;
  po_line_items: POLineItem[];
  vendor: VendorInfo | null;
  vendor_details: VendorDetails;
  warehouse?: string;
  po_status: POStatus;
  po_raised_date: string;
  remarks: string;
  attachment?: string;
  attachments?: AttachmentFile[];
  createdBy: CreatedByInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreatePurchaseOrderPayload {
  vendor: string;
  warehouse: string;
  po_raised_date: string;
  po_status: POStatus;
  remarks: string;
  po_line_items: Omit<POLineItem, "_id">[];
  attachments?: File[];
}

export interface UpdatePOStatusPayload {
  po_status: POStatus;
  remarks?: string;
}

export interface PurchaseOrderResponse {
  success: boolean;
  message: string;
  data: PurchaseOrder;
  timestamp: string;
}

export interface PurchaseOrdersResponse {
  success: boolean;
  message: string;
  data: PurchaseOrder[];
  timestamp: string;
}

export interface PurchaseOrderParams {
  po_status?: POStatus;
  startDate?: string;
  endDate?: string;
  vendor?: string;
  warehouseId?: string;
}

// GRN (Goods Receipt Note) Types
export type QCStatus = "excellent" | "moderate" | "bad";

export interface GRNLineItem {
  _id?: string;
  line_no: number;
  sku: string;
  productName: string;
  quantity: number;
  category: string;
  pack_size: string;
  uom: string;
  unit_price: number;
  expected_delivery_date: string;
  location: string;
  received_quantity?: number;
  accepted_quantity?: number;
  rejected_quantity?: number;
}

export interface GRNQuantityItem {
  sku: string;
  received_quantity: number;
  accepted_quantity: number;
  rejected_quantity: number;
  expiry_date: string;
  item_remarks?: string;
}

export interface GRN {
  _id: string;
  delivery_challan: string;
  transporter_name: string;
  vehicle_number: string;
  recieved_date: string;
  remarks: string;
  scanned_challan: string;
  qc_status: QCStatus;
  vendor_details: VendorDetails;
  purchase_order: PurchaseOrder;
  vendor: Vendor;
  grn_line_items: GRNLineItem[];
  createdBy: CreatedByInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateGRNPayload {
  document: File; // File upload for scanned challan
  delivery_challan: string;
  transporter_name: string;
  vehicle_number: string;
  qc_status: QCStatus;
  received_date?: string; // Optional
  remarks?: string; // Optional
  quantities?: GRNQuantityItem[]; // Optional - for future enhancement
}

export interface UpdateGRNStatusPayload {
  qc_status: QCStatus;
  remarks?: string;
}

export interface GRNResponse {
  success: boolean;
  message: string;
  data: GRN;
  timestamp: string;
}

export interface GRNsResponse {
  success: boolean;
  message: string;
  data: GRN[];
  timestamp: string;
}

export interface GRNParams {
  qc_status?: QCStatus;
  startDate?: string;
  endDate?: string;
  warehouse?: string;
}

// Dispatch Order Types
export type DispatchStatus =
  | "pending"
  | "in_transit"
  | "delivered"
  | "cancelled";

export interface DispatchProduct {
  _id?: string;
  sku: string;
  quantity: number;
}

export interface FieldAgent {
  _id: string;
  name: string;
  assignedRoutes: string[];
  isActive: boolean;
  createdBy: {
    name: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface DispatchOrder {
  _id: string;
  dispatchId: string;
  destination: string;
  products: DispatchProduct[];
  assignedAgent: {
    _id: string;
    name: string;
    assignedRoutes?: string[];
    isActive?: boolean;
  };
  notes: string;
  status: DispatchStatus;
  createdBy: CreatedByInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateDispatchOrderPayload {
  dispatchId: string;
  destination: string;
  products: DispatchProduct[];
  assignedAgent: string;
  warehouse: string;
  notes: string;
  status?: DispatchStatus;
}

export interface UpdateDispatchStatusPayload {
  status: DispatchStatus;
}

export interface DispatchOrderResponse {
  success: boolean;
  message: string;
  data: DispatchOrder;
  timestamp: string;
}

export interface DispatchOrdersResponse {
  success: boolean;
  message: string;
  data: DispatchOrder[];
  timestamp: string;
}

export interface DispatchOrderParams {
  status?: DispatchStatus;
}

export interface CreateFieldAgentPayload {
  name: string;
  assignedRoutes: string[];
}

export interface FieldAgentResponse {
  success: boolean;
  message: string;
  data: FieldAgent;
  timestamp: string;
}

export interface FieldAgentsResponse {
  success: boolean;
  message: string;
  data: FieldAgent[];
  timestamp: string;
}

export interface FieldAgentParams {
  isActive?: boolean;
}

// QC Template Types
export interface QCParameter {
  _id?: string;
  name: string;
  value: string;
}

export interface QCTemplate {
  _id: string;
  title: string;
  sku: string;
  parameters: QCParameter[];
  isActive: boolean;
  createdBy: CreatedByInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateQCTemplatePayload {
  title: string;
  sku: string;
  parameters: Omit<QCParameter, "_id">[];
}

export interface UpdateQCTemplatePayload {
  title?: string;
  sku?: string;
  parameters?: Omit<QCParameter, "_id">[];
}

export interface QCTemplateResponse {
  success: boolean;
  message: string;
  data: QCTemplate;
  timestamp: string;
}

export interface QCTemplatesResponse {
  success: boolean;
  message: string;
  data: QCTemplate[];
  timestamp: string;
}

export interface QCTemplateParams {
  sku?: string;
}

// Return Order Types
export type ReturnStatus = "pending" | "approved" | "rejected";
export type ReturnType = "damaged" | "expired" | "quality_issue" | "other";

export interface ReturnOrderVendor {
  _id: string;
  vendor_name: string;
  vendor_email: string;
}

export interface ReturnOrder {
  _id: string;
  batchId: string;
  sku?: string;
  productName?: string;
  vendor: ReturnOrderVendor | null;
  reason: string;
  quantity: number;
  status: ReturnStatus;
  returnType: ReturnType;
  images: string[];
  createdBy: CreatedByInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateReturnOrderPayload {
  batchId: string;
  vendor: string;
  warehouse: string;
  reason: string;
  quantity: number;
  returnType?: ReturnType;
}

export interface ReturnOrderResponse {
  success: boolean;
  message: string;
  data: ReturnOrder;
  timestamp: string;
}

export interface ReturnQueueResponse {
  success: boolean;
  message: string;
  data: ReturnOrder[];
  timestamp: string;
}

export interface ReturnQueueParams {
  status?: ReturnStatus;
  returnType?: ReturnType;
}

// Inventory Types
export type InventoryStatus =
  | "active"
  | "low_stock"
  | "out_of_stock"
  | "archived";
export type ExpiryStatus = "expiring_soon" | "expired" | "normal";

export interface InventoryLocation {
  zone: string;
  aisle: string;
  rack: string;
  bin: string;
}

export interface InventoryWarehouse {
  _id: string;
  name: string;
  code: string;
}

export interface InventoryItem {
  _id: string;
  sku: string;
  productName: string;
  batchId: string;
  warehouse: InventoryWarehouse;
  quantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  age: number;
  status: InventoryStatus;
  isArchived: boolean;
  location: InventoryLocation;
  expiryDate?: string;
  archivedAt?: string;
  createdBy: CreatedByInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface InventoryStats {
  totalItems: number;
  activeItems: number;
  archivedItems: number;
  lowStockItems: number;
  expiredItems: number;
  nearExpiryItems: number;
  totalStockValue: number;
  statusBreakdown: {
    [key: string]: number;
  };
}

export interface InventoryDashboardData {
  inventory: InventoryItem[];
  total: number;
  page: number;
  totalPages: number;
  filters: Record<string, any>;
}

export interface InventoryDashboardResponse {
  success: boolean;
  message: string;
  data: InventoryDashboardData;
  timestamp: string;
}

export interface InventoryStatsResponse {
  success: boolean;
  message: string;
  data: InventoryStats;
  timestamp: string;
}

export interface InventoryItemResponse {
  success: boolean;
  message: string;
  data: InventoryItem;
  timestamp: string;
}

export interface InventoryDashboardParams {
  page?: number;
  limit?: number;
  status?: string;
  expiryStatus?: string;
  sku?: string;
  batchId?: string;
}

export interface UpdateInventoryItemPayload {
  quantity?: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  expiryDate?: string;
  location?: InventoryLocation;
}

export interface BulkArchivePayload {
  inventoryIds: string[];
}

export interface ArchivedInventoryData {
  inventory: InventoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ArchivedInventoryResponse {
  success: boolean;
  message: string;
  data: ArchivedInventoryData;
  timestamp: string;
}

// Report Types
export interface ReportType {
  value: string;
  label: string;
}

export interface ReportTypesResponse {
  success: boolean;
  message: string;
  data: ReportType[];
  timestamp: string;
}

// Inventory Summary Report
export interface InventorySummaryData {
  totalSKUs: number;
  stockOutSKUs: number;
  totalPOs: number;
  pendingPOs: number;
  pendingRefills: number;
  completedRefills: number;
  totalStockValue: number;
  lowStockItems: number;
  nearExpirySKUs: number;
  stockAccuracy: number;
}

export interface InventorySummaryReport {
  summary: InventorySummaryData;
  inventoryDetails: InventoryItem[];
  generatedOn: string;
  filters: {
    warehouse: string;
  };
}

export interface InventorySummaryResponse {
  success: boolean;
  message: string;
  data: InventorySummaryReport;
  timestamp: string;
}

// Purchase Orders Report
export interface PurchaseOrdersSummary {
  totalPOs: number;
  pendingPOs: number;
  approvedPOs: number;
  rejectedPOs: number;
  totalPOValue: number;
  averagePOValue: number;
}

export interface PurchaseOrdersReport {
  summary: PurchaseOrdersSummary;
  purchaseOrders: PurchaseOrder[];
  generatedOn: string;
  filters: {
    warehouse: string;
  };
}

export interface PurchaseOrdersReportResponse {
  success: boolean;
  message: string;
  data: PurchaseOrdersReport;
  timestamp: string;
}

// Inventory Turnover Report
export interface InventoryTurnoverItem {
  _id: string;
  sku: string;
  productName: string;
  category: string;
  currentQuantity: number;
  averageStock: number;
  totalReceived: number;
  stockOutCount: number;
  lastUpdated: string;
  turnoverRate: number;
}

export interface InventoryTurnoverSummary {
  totalSKUs: number;
  averageTurnover: number;
  highTurnoverItems: number;
  lowTurnoverItems: number;
}

export interface InventoryTurnoverReport {
  report: string;
  data: InventoryTurnoverItem[];
  summary: InventoryTurnoverSummary;
  generatedOn: string;
  filters: {
    warehouse: string;
  };
}

export interface InventoryTurnoverResponse {
  success: boolean;
  message: string;
  data: InventoryTurnoverReport;
  timestamp: string;
}

// QC Summary Report
export interface QCSummaryData {
  _id: string;
  count: number;
}

export interface QCSummary {
  totalReceivings: number;
  passRate: number;
  failedCount: number;
  pendingCount: number;
  totalValue: number;
}

export interface QCSummaryReport {
  report: string;
  data: QCSummaryData[];
  details: PurchaseOrder[];
  summary: QCSummary;
  generatedOn: string;
  filters: {
    warehouse: string;
  };
}

export interface QCSummaryResponse {
  success: boolean;
  message: string;
  data: QCSummaryReport;
  timestamp: string;
}

// Efficiency Report
export interface EfficiencyInventory {
  _id: null;
  avgUtilization: number;
  lowStockCount: number;
  totalItems: number;
}

export interface EfficiencyReport {
  report: string;
  dispatchEfficiency: Record<string, any>;
  inventoryEfficiency: EfficiencyInventory;
  overallScore: number;
  generatedOn: string;
  filters: {
    warehouse: string;
  };
}

export interface EfficiencyResponse {
  success: boolean;
  message: string;
  data: EfficiencyReport;
  timestamp: string;
}

// Stock Ageing Report
export interface StockAgeingBuckets {
  "0-30 days": number;
  "31-60 days": number;
  "61-90 days": number;
  "90+ days": number;
}

export interface StockAgeingReport {
  report: string;
  ageingBuckets: StockAgeingBuckets;
  totalItems: number;
  generatedOn: string;
}

export interface StockAgeingResponse {
  success: boolean;
  message: string;
  data: StockAgeingReport;
  timestamp: string;
}

// Generic Report Response
export interface GenericReportResponse {
  success: boolean;
  message: string;
  data: any;
  timestamp: string;
}

// Export Report Params
export interface ExportReportParams {
  type: string;
  format: "csv" | "json";
  warehouseId: string;
}

// Expense Types
export type ExpenseCategory =
  | "transport"
  | "supplies"
  | "equipment"
  | "staffing"
  | "maintenance"
  | "utilities"
  | "other";
export type ExpenseStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "paid" | "unpaid" | "partially_paid";

export interface CreateExpensePayload {
  category: ExpenseCategory;
  amount: number;
  vendor: string;
  date: string;
  description: string;
  billUrl?: string;
  assignedAgent: string;
  warehouseId: string;
}

export interface UpdateExpensePayload {
  category?: ExpenseCategory;
  amount?: number;
  vendor?: string;
  date?: string;
  description?: string;
  billUrl?: string;
  assignedAgent?: string;
}

export interface UpdateExpenseStatusPayload {
  status: ExpenseStatus;
}

export interface UpdatePaymentStatusPayload {
  paymentStatus: PaymentStatus;
}

export interface Expense {
  _id: string;
  category: ExpenseCategory;
  amount: number;
  vendor: {
    _id: string;
    vendor_name: string;
    vendor_email: string;
  };
  date: string;
  description: string;
  billUrl?: string;
  status: ExpenseStatus;
  assignedAgent: {
    _id: string;
    name: string;
  };
  warehouseId: {
    _id: string;
    name: string;
    code: string;
  };
  paymentStatus: PaymentStatus;
  createdBy: {
    name: string;
    email: string;
    id: string;
  };
  approvedAt?: string;
  approvedBy?: {
    name: string;
    email: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ExpenseResponse {
  success: boolean;
  message: string;
  data: Expense;
  timestamp: string;
}

export interface ExpensesResponse {
  success: boolean;
  message: string;
  data: Expense[];
  timestamp: string;
}

export interface ExpenseSummary {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  byCategory: Record<string, number>;
  byMonth: Record<string, number>;
  paymentSummary: {
    paid: number;
    unpaid: number;
    partially_paid: number;
  };
}

export interface ExpenseSummaryResponse {
  success: boolean;
  message: string;
  data: ExpenseSummary;
  timestamp: string;
}

export interface MonthlyExpenseTrend {
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  expenseCount: number;
  period: string;
}

export interface MonthlyExpenseTrendResponse {
  success: boolean;
  message: string;
  data: MonthlyExpenseTrend[];
  timestamp: string;
}
