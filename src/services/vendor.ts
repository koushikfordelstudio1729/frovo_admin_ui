import { api } from "./api";
import { ApiResponse } from "@/types/api.types";
import {
  CreateCompanyPayload,
  UpdateCompanyPayload,
  CompanyPaginationParams,
  CompanyListResponse,
  CompanySearchResponse,
  CompanyExistsResponse,
  CompanyWithVendorsResponse,
  VendorCompany
} from "@/types/vendor.types";
import {
  CreateVendorPayload,
  UpdateVendorPayload,
  VendorFilters,
  VendorListResponse,
  BulkVendorPayload,
  BulkVendorResponse,
  Vendor
} from "@/types/vendor-data.types";

const BASE_VENDOR = "/vendors";
const BASE_VENDOR_ADMIN = `${BASE_VENDOR}/vendor-admin`;
const BASE_COMPANY = `${BASE_VENDOR}/companies`;

// ============================================
// VENDOR ENDPOINTS
// ============================================

/**
 * Get paginated list of vendors with filters
 * @param filters - Filter and pagination parameters
 * @returns Promise with vendor list and pagination info
 */
export const getVendors = (filters?: VendorFilters) => {
  const {
    page = 1,
    limit = 10,
    verification_status = "",
    risk_rating = "",
    vendor_category = "",
    search = ""
  } = filters || {};

  return api.get<VendorListResponse>(
    `${BASE_VENDOR}?page=${page}&limit=${limit}&verification_status=${verification_status}&risk_rating=${risk_rating}&vendor_category=${vendor_category}&search=${search}`
  );
};

/**
 * Get vendor details by MongoDB ID
 * @param id - Vendor MongoDB _id
 * @returns Promise with vendor details
 */
export const getVendorById = (id: string) => {
  return api.get<ApiResponse<Vendor>>(`${BASE_VENDOR}/${id}`);
};

/**
 * Get vendor details by vendor_id
 * @param vendorId - Vendor custom ID (e.g., VEND-352815-VLX)
 * @returns Promise with vendor details
 */
export const getVendorByVendorId = (vendorId: string) => {
  return api.get<ApiResponse<Vendor>>(
    `${BASE_VENDOR}/vendor-id/${encodeURIComponent(vendorId)}`
  );
};

/**
 * Create a new vendor
 * @param payload - Vendor creation data
 * @returns Promise with created vendor data
 */
export const createVendor = (payload: CreateVendorPayload) => {
  return api.post<ApiResponse<Vendor>>(`${BASE_VENDOR}/create`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Bulk create vendors
 * @param payload - Array of vendors to create
 * @returns Promise with bulk creation results
 */
export const bulkCreateVendors = (payload: BulkVendorPayload) => {
  return api.post<BulkVendorResponse>(`${BASE_VENDOR}/bulk-create`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Update vendor details by MongoDB ID
 * @param id - Vendor MongoDB _id
 * @param payload - Fields to update
 * @returns Promise with updated vendor data
 */
export const updateVendor = (id: string, payload: UpdateVendorPayload) => {
  return api.put<ApiResponse<Vendor>>(`${BASE_VENDOR}/${id}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Delete vendor by MongoDB ID
 * @param id - Vendor MongoDB _id
 * @returns Promise with success message
 */
export const deleteVendor = (id: string) => {
  return api.delete<ApiResponse<null>>(`${BASE_VENDOR}/${id}`);
};

// ============================================
// VENDOR VERIFICATION ENDPOINTS
// ============================================

/**
 * Verify or reject a vendor
 * @param id - Vendor MongoDB _id
 * @param payload - Verification status and notes
 * @returns Promise with updated vendor data
 */
export const verifyVendor = (
  id: string,
  payload: {
    verification_status: "verified" | "rejected" | "pending" | "in-review" | "approved" | "failed";
    notes?: string;
  }
) => {
  return api.patch<ApiResponse<Vendor>>(`${BASE_VENDOR}/${id}/verify`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Bulk verify or reject vendors
 * @param payload - Array of vendor IDs and verification status
 * @returns Promise with bulk verification results
 */
export const bulkVerifyVendors = (payload: {
  vendor_ids: string[];
  verification_status: "verified" | "rejected";
  rejection_reason?: string;
}) => {
  return api.post<ApiResponse<any>>(`${BASE_VENDOR}/bulk-verify`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// ============================================
// VENDOR DOCUMENT ENDPOINTS
// ============================================

/**
 * Upload document for a vendor
 * @param id - Vendor MongoDB _id
 * @param formData - FormData with file and metadata
 * @returns Promise with updated vendor data including new document
 */
export const uploadVendorDocument = (id: string, formData: FormData) => {
  return api.post<ApiResponse<Vendor>>(`${BASE_VENDOR}/${id}/documents`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

/**
 * Get all documents for a vendor
 * @param id - Vendor MongoDB _id
 * @returns Promise with array of documents
 */
export const getVendorDocuments = (id: string) => {
  return api.get<ApiResponse<any[]>>(`${BASE_VENDOR}/${id}/documents`);
};

/**
 * Get single document for a vendor
 * @param id - Vendor MongoDB _id
 * @param documentId - Document _id
 * @returns Promise with document details
 */
export const getVendorDocument = (id: string, documentId: string) => {
  return api.get<ApiResponse<any>>(`${BASE_VENDOR}/${id}/documents/${documentId}`);
};

/**
 * Delete document from vendor
 * @param id - Vendor MongoDB _id
 * @param documentId - Document _id
 * @returns Promise with success message
 */
export const deleteVendorDocument = (id: string, documentId: string) => {
  return api.delete<ApiResponse<null>>(`${BASE_VENDOR}/${id}/documents/${documentId}`);
};

// ============================================
// AUDIT TRAIL ENDPOINTS
// ============================================

/**
 * Get vendor audit trail
 * @param id - Vendor MongoDB _id
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 50)
 * @returns Promise with audit trail data
 */
export const getVendorAuditTrail = (id: string, page = 1, limit = 50) => {
  return api.get<ApiResponse<{
    audits: any[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  }>>(`${BASE_VENDOR}/${id}/audit-trail?page=${page}&limit=${limit}`);
};

/**
 * Get company audit trail
 * @param id - Company MongoDB _id
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 50)
 * @returns Promise with audit trail data
 */
export const getCompanyAuditTrail = (id: string, page = 1, limit = 50) => {
  return api.get<ApiResponse<{
    audits: any[];
    total: number;
    page: number;
    pages: number;
    limit: number;
  }>>(`${BASE_COMPANY}/${id}/audit-trail?page=${page}&limit=${limit}`);
};

// Legacy endpoints - DISABLED (404 error)
// export const getVendorDashboard = () =>
//   api.get(`${BASE_VENDOR_ADMIN}/dashboard`);

export const getAuditTrails = () => api.get("audit-trails");

// ============================================
// COMPANY ENDPOINTS
// ============================================

/**
 * Get paginated list of companies with search and sorting
 * @param params - Pagination parameters (page, limit, search, sortBy, sortOrder)
 * @returns Promise with company list and pagination info
 */
export const getCompanies = (params?: Partial<CompanyPaginationParams>) => {
  const {
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    sortOrder = "desc"
  } = params || {};

  return api.get<CompanyListResponse>(
    `${BASE_COMPANY}?page=${page}&limit=${limit}&search=${search}&sortBy=${sortBy}&sortOrder=${sortOrder}`
  );
};

/**
 * Search companies by name or email
 * @param query - Search query string
 * @param limit - Maximum number of results (default: 10)
 * @returns Promise with matching companies
 */
export const searchCompanies = (query: string, limit: number = 10) => {
  return api.get<CompanySearchResponse>(
    `${BASE_COMPANY}/search?q=${encodeURIComponent(query)}&limit=${limit}`
  );
};

/**
 * Get company details by CIN
 * @param cin - Company Identification Number
 * @returns Promise with company details
 */
export const getCompanyByCIN = (cin: string) => {
  return api.get<ApiResponse<VendorCompany>>(
    `${BASE_COMPANY}/${encodeURIComponent(cin)}`
  );
};

/**
 * Create a new company
 * @param payload - Company creation data
 * @returns Promise with created company data
 */
export const createCompany = (payload: CreateCompanyPayload) => {
  return api.post<ApiResponse<VendorCompany>>(BASE_COMPANY, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

/**
 * Update company details by CIN
 * @param cin - Company Identification Number
 * @param payload - Fields to update
 * @returns Promise with updated company data
 */
export const updateCompany = (cin: string, payload: UpdateCompanyPayload) => {
  return api.put<ApiResponse<VendorCompany>>(
    `${BASE_COMPANY}/${encodeURIComponent(cin)}`,
    payload,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

/**
 * Delete company by CIN
 * @param cin - Company Identification Number
 * @returns Promise with deleted company data
 */
export const deleteCompany = (cin: string) => {
  return api.delete<ApiResponse<VendorCompany>>(
    `${BASE_COMPANY}/${encodeURIComponent(cin)}`
  );
};

/**
 * Check if company exists by CIN
 * @param cin - Company Identification Number
 * @returns Promise with existence status
 */
export const checkCompanyExists = (cin: string) => {
  return api.get<CompanyExistsResponse>(
    `${BASE_COMPANY}/${encodeURIComponent(cin)}/exists`
  );
};

/**
 * Get company with vendor statistics
 * @param cin - Company Identification Number
 * @returns Promise with company details and vendor statistics
 */
export const getCompanyWithVendors = (cin: string) => {
  return api.get<CompanyWithVendorsResponse>(
    `${BASE_COMPANY}/${encodeURIComponent(cin)}/vendors`
  );
};

// ============================================
// USER PROFILE ENDPOINTS
// ============================================

/**
 * Get current user's vendor profile with statistics
 * @returns Promise with user info, statistics, and created vendors
 */
export const getUserProfile = () => {
  return api.get<ApiResponse<{
    user_info: {
      user_id: string;
      total_vendors_created: number;
    };
    statistics: {
      total_vendors: number;
      pending_vendors: number;
      verified_vendors: number;
      rejected_vendors: number;
      failed_vendors: number;
    };
    vendors: Vendor[];
  }>>(`${BASE_VENDOR}/profile/me`);
};

// Legacy function - kept for backwards compatibility
export const getCompanyDetails = (companyRegistrationNumber: string) => {
  return api.post(`${BASE_VENDOR}/companies`, {
    company_registration_number: companyRegistrationNumber,
  });
};
