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

export type POStatus = 'draft' | 'approved' | 'received' | 'delivered' | 'cancelled';

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
  po_raised_date: string;
  po_status: POStatus;
  remarks: string;
  po_line_items: Omit<POLineItem, '_id'>[];
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
}

// GRN (Goods Receipt Note) Types
export type QCStatus = 'excellent' | 'moderate' | 'bad';

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
  delivery_challan: string;
  transporter_name: string;
  vehicle_number: string;
  recieved_date: string;
  remarks: string;
  scanned_challan: string;
  qc_status: QCStatus;
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
}

// Dispatch Order Types
export type DispatchStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

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

export interface FieldAgentsResponse {
  success: boolean;
  message: string;
  data: FieldAgent[];
  timestamp: string;
}
