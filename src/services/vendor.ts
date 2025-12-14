import { api } from "./api";

const BASE_VENDOR = "/vendors";
const BASE_VENDOR_ADMIN = `${BASE_VENDOR}/vendor-admin`;

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

export const getCompanies = (page = 1, limit = 10) =>
  api.get(`/vendors/companies?page=${page}&limit=${limit}`);

export const createCompany = (payload: any) =>
  api.post(`/vendors/companies`, payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  export const getCompanyDetails = (companyRegistrationNumber: string) =>
    api.post(`${BASE_VENDOR}/companies`, {
      company_registration_number: companyRegistrationNumber,
    });
