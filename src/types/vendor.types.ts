import { ApiResponse } from "./api.types";

// Company related types
export type LegalEntityStructure =
  | "Pvt Ltd"
  | "Private Limited Company"
  | "LLP"
  | "Partnership"
  | "Sole Proprietorship"
  | "Public Limited Company";

export type CompanyStatus = "active" | "inactive" | "suspended";

export type RiskRating = "low" | "medium" | "high";

export interface VendorCompany {
  _id: string;
  registered_company_name: string;
  company_address: string;
  office_email: string;
  legal_entity_structure: LegalEntityStructure;
  cin: string;
  gst_number?: string;
  date_of_incorporation: string;
  corporate_website: string;
  directory_signature_name: string;
  din: string;
  company_status: CompanyStatus;
  risk_rating: RiskRating;
  company_registration_number?: string; // Legacy field
  createdAt: string;
  updatedAt: string;
  vendorCount?: number;
  __v?: number;
}

export interface CreateCompanyPayload {
  registered_company_name: string;
  company_address: string;
  office_email: string;
  legal_entity_structure: LegalEntityStructure;
  cin: string;
  gst_number?: string;
  date_of_incorporation: string;
  corporate_website: string;
  directory_signature_name: string;
  din: string;
  company_status: CompanyStatus;
  risk_rating: RiskRating;
}

export interface UpdateCompanyPayload {
  company_status?: CompanyStatus;
  risk_rating?: RiskRating;
  corporate_website?: string;
  company_address?: string;
  office_email?: string;
  directory_signature_name?: string;
  gst_number?: string;
}

export interface CompanyPaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CompanyPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit: number;
}

export interface CompanyListResponse {
  success: boolean;
  message: string;
  data: VendorCompany[];
  pagination: CompanyPagination;
}

export interface CompanySearchResult {
  _id: string;
  registered_company_name: string;
  office_email: string;
}

export interface CompanySearchResponse {
  success: boolean;
  message: string;
  data: CompanySearchResult[];
}

export interface CompanyExistsResponse {
  success: boolean;
  message: string;
  data: {
    exists: boolean;
  };
}

// Vendor Statistics Types
export interface VendorStatusCount {
  pending: number;
  verified: number;
  failed: number;
  rejected: number;
  "in-review": number;
  approved: number;
}

export interface VendorCategoryCount {
  _id: string;
  count: number;
}

export interface VendorRiskCount {
  low: {
    count: number;
    percentage: number;
  };
  medium?: {
    count: number;
    percentage: number;
  };
  high?: {
    count: number;
    percentage: number;
  };
}

export interface TopCategory {
  category: string;
  count: number;
  percentage: number;
}

export interface VendorStatistics {
  total_vendors: number;
  by_status: VendorStatusCount;
  by_category: VendorCategoryCount[];
  by_risk: VendorRiskCount;
  status_percentages: {
    verified: number;
    pending: number;
  };
  top_categories: TopCategory[];
  category_count: number;
  risk_levels_count: number;
}

export interface RecentVendor {
  _id: string;
  vendor_name: string;
  vendor_category: string;
  vendor_id: string;
  verification_status: string;
  risk_rating: RiskRating;
  createdBy: {
    name: string;
    email: string;
    id: string;
  };
  createdAt: string;
}

export interface CompanyOverview {
  company_name: string;
  cin: string;
  vendor_summary: string;
  verification_summary: string;
}

export interface CompanyWithVendorsResponse {
  success: boolean;
  message: string;
  data: {
    company: VendorCompany;
    statistics: VendorStatistics;
    recent_vendors: RecentVendor[];
    overview: CompanyOverview;
  };
}

// Validation Helpers
export interface ValidationPattern {
  pattern: RegExp;
  message: string;
  example: string;
}

export const COMPANY_VALIDATION_PATTERNS: Record<string, ValidationPattern> = {
  CIN: {
    pattern: /^[A-Z]{1}\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/,
    message: "CIN must be in format: L12345MH2020PTC123456",
    example: "U15499DL1989PTC035955"
  },
  GST: {
    pattern: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
    message: "GST number must be in format: 22AAAAA0000A1Z5",
    example: "07AABCP0634E1ZU"
  },
  DIN: {
    pattern: /^\d{8}$/,
    message: "DIN must be 8 digits",
    example: "08845260"
  },
  EMAIL: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
    example: "contact@company.com"
  },
  WEBSITE: {
    pattern: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,}(\/.*)?$/,
    message: "Please enter a valid website URL",
    example: "https://www.company.com"
  }
};

// Form validation helper
export const validateCompanyField = (
  field: keyof typeof COMPANY_VALIDATION_PATTERNS,
  value: string
): { isValid: boolean; error?: string } => {
  const validation = COMPANY_VALIDATION_PATTERNS[field];
  if (!validation) {
    return { isValid: true };
  }

  const isValid = validation.pattern.test(value);
  return {
    isValid,
    error: isValid ? undefined : validation.message
  };
};
