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

const BASE_VENDOR = "/vendors";
const BASE_VENDOR_ADMIN = `${BASE_VENDOR}/vendor-admin`;
const BASE_COMPANY = `${BASE_VENDOR}/companies`;

// ============================================
// VENDOR ENDPOINTS
// ============================================

export const getVendorDashboard = () =>
  api.get(`${BASE_VENDOR_ADMIN}/dashboard`);

export const getVendorById = (id: string) =>
  api.get(`${BASE_VENDOR_ADMIN}/vendors/${id}/edit`);

export const getVendors = (page = 1, limit = 100) =>
  api.get(`${BASE_VENDOR}?page=${page}&limit=${limit}`);

export const createVendor = (payload: any) =>
  api.post(`${BASE_VENDOR}/create`, payload);

export const updateVendor = (id: string, payload: any) =>
  api.put(`${BASE_VENDOR_ADMIN}/vendors/${id}`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

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

// Legacy function - kept for backwards compatibility
export const getCompanyDetails = (companyRegistrationNumber: string) => {
  return api.post(`${BASE_VENDOR}/companies`, {
    company_registration_number: companyRegistrationNumber,
  });
};
