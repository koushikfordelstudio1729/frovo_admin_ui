import { ApiResponse } from "./api.types";

// Vendor Types
export type VendorType = "snacks" | "beverages" | "dairy" | "bakery" | "frozen" | "fresh";

export type VendorCategory = "consumables" | "raw_materials" | "packaging" | "services";

export type PaymentTerms = "net_30" | "net_60" | "net_90" | "advance" | "cod";

export type PaymentMethods = "neft" | "rtgs" | "upi" | "cheque" | "cash";

export type BillingCycle = "monthly" | "quarterly" | "weekly" | "biweekly";

export type VendorStatusCycle = "procurement" | "production" | "delivery" | "inactive";

export type VendorStatus = "active" | "inactive" | "suspended" | "blacklisted";

export type VerificationStatus = "pending" | "verified" | "in-review" | "failed" | "rejected" | "approved" | "draft";

export type RiskRating = "low" | "medium" | "high";

// Vendor Interfaces
export interface VendorDocument {
  document_type: string;
  document_url: string;
  uploaded_at: string;
}

export interface CreatedBy {
  name: string;
  email: string;
  id: string;
}

export interface Vendor {
  _id: string;
  vendor_name: string;
  vendor_billing_name: string;
  vendor_type: VendorType[];
  vendor_category: VendorCategory;
  material_categories_supplied: string[];
  primary_contact_name: string;
  contact_phone: string;
  vendor_email: string;
  vendor_address: string;
  vendor_id: string;
  cin: string;
  warehouse_id: string | null;
  bank_account_number: string;
  ifsc_code: string;
  payment_terms: PaymentTerms;
  payment_methods: PaymentMethods;
  gst_number: string;
  pan_number: string;
  tds_rate: number;
  billing_cycle: BillingCycle;
  vendor_status_cycle: VendorStatusCycle;
  vendor_status: VendorStatus;
  verification_status: VerificationStatus;
  risk_rating: RiskRating;
  risk_notes: string;
  contract_terms: string;
  contract_expiry_date: string;
  contract_renewal_date: string;
  internal_notes: string;
  createdBy: CreatedBy;
  verified_by?: CreatedBy;
  documents: VendorDocument[];
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateVendorPayload {
  vendor_name: string;
  vendor_billing_name: string;
  vendor_type: VendorType[];
  vendor_category: VendorCategory;
  material_categories_supplied: string[];
  primary_contact_name: string;
  contact_phone: string;
  vendor_email: string;
  vendor_address: string;
  cin: string;
  warehouse_id?: string | null;
  bank_account_number: string;
  ifsc_code: string;
  payment_terms: PaymentTerms;
  payment_methods: PaymentMethods;
  gst_number: string;
  pan_number: string;
  tds_rate: number;
  billing_cycle: BillingCycle;
  vendor_status_cycle?: VendorStatusCycle;
  vendor_status?: VendorStatus;
  verification_status?: VerificationStatus;
  risk_rating: RiskRating;
  risk_notes?: string;
  contract_terms?: string;
  contract_expiry_date: string;
  contract_renewal_date: string;
  internal_notes?: string;
}

export interface UpdateVendorPayload {
  vendor_name?: string;
  vendor_billing_name?: string;
  vendor_type?: VendorType[];
  vendor_category?: VendorCategory;
  material_categories_supplied?: string[];
  primary_contact_name?: string;
  contact_phone?: string;
  vendor_email?: string;
  vendor_address?: string;
  warehouse_id?: string | null;
  bank_account_number?: string;
  ifsc_code?: string;
  payment_terms?: PaymentTerms;
  payment_methods?: PaymentMethods;
  gst_number?: string;
  pan_number?: string;
  tds_rate?: number;
  billing_cycle?: BillingCycle;
  vendor_status_cycle?: VendorStatusCycle;
  vendor_status?: VendorStatus;
  verification_status?: VerificationStatus;
  risk_rating?: RiskRating;
  risk_notes?: string;
  contract_terms?: string;
  contract_expiry_date?: string;
  contract_renewal_date?: string;
  internal_notes?: string;
}

export interface VendorFilters {
  page?: number;
  limit?: number;
  verification_status?: VerificationStatus | "";
  risk_rating?: RiskRating | "";
  vendor_category?: VendorCategory | "";
  search?: string;
}

export interface VendorListResponse {
  success: boolean;
  data: {
    vendors: Vendor[];
    total: number;
    page: number;
    pages: number;
  };
}

export interface BulkVendorPayload {
  vendors: CreateVendorPayload[];
}

export interface BulkVendorResult {
  index: number;
  vendor_name: string;
  vendor_id: string;
  cin: string;
  data: Vendor;
}

export interface BulkVendorResponse {
  success: boolean;
  message: string;
  data: {
    successful: BulkVendorResult[];
    failed: Array<{
      index: number;
      vendor_name: string;
      error: string;
    }>;
  };
}

// Validation Patterns
export interface VendorValidationPattern {
  pattern: RegExp;
  message: string;
  example: string;
}

export const VENDOR_VALIDATION_PATTERNS: Record<string, VendorValidationPattern> = {
  IFSC: {
    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
    message: "IFSC code must be 11 characters (e.g., HDFC0001234)",
    example: "HDFC0001234"
  },
  PHONE: {
    pattern: /^[+]?[0-9]{10,15}$/,
    message: "Phone number must be 10-15 digits with optional + prefix",
    example: "+919876543210"
  },
  PAN: {
    pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    message: "PAN must be in format: AABCP0634E",
    example: "AABCP0634E"
  },
  ACCOUNT_NUMBER: {
    pattern: /^[0-9]{9,18}$/,
    message: "Account number must be 9-18 digits",
    example: "1234567890123456"
  }
};

export const validateVendorField = (
  field: keyof typeof VENDOR_VALIDATION_PATTERNS,
  value: string
): { isValid: boolean; error?: string } => {
  const validation = VENDOR_VALIDATION_PATTERNS[field];
  if (!validation) {
    return { isValid: true };
  }

  const isValid = validation.pattern.test(value);
  return {
    isValid,
    error: isValid ? undefined : validation.message
  };
};

// Options for dropdowns
export const VENDOR_TYPE_OPTIONS = [
  { label: "Snacks", value: "snacks" },
  { label: "Beverages", value: "beverages" },
  { label: "Dairy", value: "dairy" },
  { label: "Bakery", value: "bakery" },
  { label: "Frozen", value: "frozen" },
  { label: "Fresh", value: "fresh" }
];

export const VENDOR_CATEGORY_OPTIONS = [
  { label: "Consumables", value: "consumables" },
  { label: "Raw Materials", value: "raw_materials" },
  { label: "Packaging", value: "packaging" },
  { label: "Services", value: "services" }
];

export const PAYMENT_TERMS_OPTIONS = [
  { label: "Net 30", value: "net_30" },
  { label: "Net 60", value: "net_60" },
  { label: "Net 90", value: "net_90" },
  { label: "Advance", value: "advance" },
  { label: "Cash on Delivery", value: "cod" }
];

export const PAYMENT_METHODS_OPTIONS = [
  { label: "NEFT", value: "neft" },
  { label: "RTGS", value: "rtgs" },
  { label: "UPI", value: "upi" },
  { label: "Cheque", value: "cheque" },
  { label: "Cash", value: "cash" }
];

export const BILLING_CYCLE_OPTIONS = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Weekly", value: "weekly" },
  { label: "Bi-weekly", value: "biweekly" }
];

export const VENDOR_STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Suspended", value: "suspended" },
  { label: "Blacklisted", value: "blacklisted" }
];

export const VERIFICATION_STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "In Review", value: "in-review" },
  { label: "Failed", value: "failed" },
  { label: "Rejected", value: "rejected" },
  { label: "Approved", value: "approved" }
];

export const RISK_RATING_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" }
];
