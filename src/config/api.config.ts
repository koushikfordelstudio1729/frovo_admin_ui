import { env } from './admin/environment';

// Common API configuration shared across all modules
export const apiConfig = {
  baseURL: env.apiUrl,
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000,

  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  statusCodes: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
  },

  endpoints: {
    // Auth endpoints (shared across all modules)
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh-token',
      verify: '/auth/verify',
      me: '/auth/me',
      changePassword: '/auth/change-password',
      forgotPassword: '/auth/forgot-password',
      resetPassword: '/auth/reset-password',
    },

    // User endpoints (shared)
    user: {
      profile: '/user/profile',
      updateProfile: '/user/profile',
    },

    // Admin-specific endpoints
    admin: {
      permissions: {
        list: '/permissions',
        search: '/permissions/search',
        byModule: (module: string) => `/permissions/module/${module}`,
      },
      roles: '/roles',
      departments: '/departments',
      users: {
        list: '/users',
        search: '/users/search',
        create: '/users',
        getById: (id: string) => `/users/${id}`,
        update: (id: string) => `/users/${id}`,
        delete: (id: string) => `/users/${id}`,
        updateStatus: (id: string) => `/users/${id}/status`,
        updatePassword: (id: string) => `/users/${id}/password`,
        getPermissions: (id: string) => `/users/${id}/permissions`,
        assignRoles: (id: string) => `/users/${id}/roles`,
        removeRole: (id: string, roleId: string) => `/users/${id}/roles/${roleId}`,
      },
      accessRequests: '/access-requests',
      auditLogs: '/audit-logs',
      warehouses: {
        list: '/warehouse/warehouses',
        create: '/warehouse/warehouses',
        getById: (id: string) => `/warehouse/warehouses/${id}`,
        update: (id: string) => `/warehouse/warehouses/${id}`,
        delete: (id: string) => `/warehouse/warehouses/${id}`,
      },
    },

    // Warehouse-specific endpoints
    warehouse: {
      myWarehouse: '/warehouse/warehouses/my-warehouse',
      dashboard: '/warehouse/dashboard',
      purchaseOrders: {
        list: '/warehouse/inbound/purchase-orders',
        create: '/warehouse/inbound/purchase-orders',
        getById: (id: string) => `/warehouse/inbound/purchase-orders/${id}`,
        updateStatus: (id: string) => `/warehouse/inbound/purchase-orders/${id}/status`,
        delete: (id: string) => `/warehouse/inbound/purchase-orders/${id}`,
      },
      grn: {
        list: '/warehouse/grn',
        create: (poId: string) => `/warehouse/purchase-orders/${poId}/grn`,
        getById: (id: string) => `/warehouse/grn/${id}`,
        updateStatus: (id: string) => `/warehouse/grn/${id}/status`,
      },
      dispatchOrders: {
        list: '/warehouse/outbound/dispatches',
        create: '/warehouse/outbound/dispatch',
        getById: (id: string) => `/warehouse/outbound/dispatches/${id}`,
        updateStatus: (id: string) => `/warehouse/outbound/dispatches/${id}/status`,
      },
      fieldAgents: {
        list: '/warehouse/field-agents',
        create: '/warehouse/field-agents',
      },
      qcTemplates: {
        list: '/warehouse/qc/templates',
        create: '/warehouse/qc/templates',
        getById: (id: string) => `/warehouse/qc/templates/${id}`,
        update: (id: string) => `/warehouse/qc/templates/${id}`,
        delete: (id: string) => `/warehouse/qc/templates/${id}`,
      },
      returns: {
        queue: '/warehouse/returns/queue',
        create: '/warehouse/returns',
        approve: (id: string) => `/warehouse/returns/${id}/approve`,
        reject: (id: string) => `/warehouse/returns/${id}/reject`,
      },
      inventory: {
        dashboard: (warehouseId: string) => `/warehouse/inventory/dashboard/${warehouseId}`,
        stats: (warehouseId: string) => `/warehouse/inventory/stats/${warehouseId}`,
        getById: (id: string) => `/warehouse/inventory/${id}`,
        update: (id: string) => `/warehouse/inventory/${id}`,
        archive: (id: string) => `/warehouse/inventory/${id}/archive`,
        unarchive: (id: string) => `/warehouse/inventory/${id}/unarchive`,
        archived: (warehouseId: string) => `/warehouse/inventory/archived/${warehouseId}`,
        bulkArchive: '/warehouse/inventory/bulk-archive',
        bulkUnarchive: '/warehouse/inventory/bulk-unarchive',
      },
      reports: {
        types: '/warehouse/reports/types',
        inventorySummary: '/warehouse/reports/inventory-summary',
        purchaseOrders: '/warehouse/reports/purchase-orders',
        inventoryTurnover: '/warehouse/reports/inventory-turnover',
        qcSummary: '/warehouse/reports/qc-summary',
        efficiency: '/warehouse/reports/efficiency',
        stockAgeing: '/warehouse/reports/stock-ageing',
        generic: '/warehouse/reports',
        export: '/warehouse/reports/export',
      },
      expenses: {
        create: '/warehouse/expenses',
        list: '/warehouse/expenses',
        getById: (id: string) => `/warehouse/expenses/${id}`,
        update: (id: string) => `/warehouse/expenses/${id}`,
        uploadBill: (id: string) => `/warehouse/expenses/${id}/upload-bill`,
        delete: (id: string) => `/warehouse/expenses/${id}`,
        updateStatus: (id: string) => `/warehouse/expenses/${id}/status`,
        updatePaymentStatus: (id: string) => `/warehouse/expenses/${id}/payment-status`,
        summary: '/warehouse/expenses/summary',
        monthlyTrend: '/warehouse/expenses/trend/monthly',
      },
    },

    // Vendor-specific endpoints
    vendor: {
      list: '/vendors',
    },

    // Route/Area management endpoints
    route: {
      area: {
        list: '/area-route/area',
        create: '/area-route/area',
        getById: (id: string) => `/area-route/area/${id}`,
        update: (id: string) => `/area-route/area/${id}`,
        delete: (id: string) => `/area-route/area/${id}`,
      },

      // Route planning endpoints
      routePlanning: {
        list: '/area-route/route',
        create: '/area-route/route',
        getById: (id: string) => `/area-route/route/${id}`,
        getByArea: (areaId: string) => `/area-route/route/area/${areaId}`,
        update: (id: string) => `/area-route/route/${id}`,
        delete: (id: string) => `/area-route/route/${id}`,
      },
    },
  },
};

// Export for backward compatibility with existing code
export { apiConfig as default };
