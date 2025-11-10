export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  SETTINGS: "/settings",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
} as const;

import { PERMISSION_GROUPS, PermissionsState } from "@/types/permissions.types";
import { SecuritySettings } from "@/types/security.types";

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: "Invalid email or password",
  EMAIL_EXISTS: "Email already exists",
  TOKEN_EXPIRED: "Session has expired, please login again",
  UNAUTHORIZED: "You are not authorized to access this resource",
  NETWORK_ERROR: "Network error, please check your connection",
  SERVER_ERROR: "Server error, please try again later",
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: "This field is required",
  INVALID_EMAIL: "Please enter a valid email address",
  INVALID_PASSWORD: "Password must be at least 8 characters",
  PASSWORDS_DONT_MATCH: "Passwords do not match",
  INVALID_NAME: "Name must be between 2 and 50 characters",
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: "frovo_auth_token",
  USER: "frovo_user_data",
  THEME: "frovo_theme",
  PREFERENCES: "frovo_user_preferences",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    VERIFY: "/auth/verify",
  },
  USER: {
    PROFILE: "/user/profile",
    UPDATE_PROFILE: "/user/profile",
    CHANGE_PASSWORD: "/user/change-password",
  },
} as const;

export const FORM_FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
  NAME: "name",
  FIRST_NAME: "firstName",
  LAST_NAME: "lastName",
} as const;

// Permission Management

export const DEFAULT_PERMISSIONS: PermissionsState = {
  [PERMISSION_GROUPS.MACHINE]: [
    { key: "machine:view", checked: true },
    { key: "machine:edit", checked: false },
    { key: "machine:delete", checked: false },
  ],
  [PERMISSION_GROUPS.ORDERS]: [
    { key: "order:view", checked: false },
    { key: "order:refund", checked: true },
    { key: "order:cancel", checked: false },
  ],
  [PERMISSION_GROUPS.FINANCE]: [
    { key: "finance:view", checked: false },
    { key: "finance:edit", checked: false },
  ],
  [PERMISSION_GROUPS.AUDIT]: [
    { key: "audit:view", checked: false },
    { key: "planogram:edit", checked: true },
  ],
};

export const PERMISSION_GROUP_KEYS = Object.values(PERMISSION_GROUPS);

// Security Settings
export const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  mfaEnabled: false,
  ipAllowlist: [],
  sso: {
    clientId: "",
    secret: "",
    metadataUrl: "",
  },
};

export const SECURITY_MESSAGES = {
  MFA_ENABLED: "Multi-factor authentication enabled",
  MFA_DISABLED: "Multi-factor authentication disabled",
  IP_ADDED: "IP range added successfully",
  IP_REMOVED: "IP range removed successfully",
  SETTINGS_SAVED: "Security settings saved successfully",
  SAVE_ERROR: "Failed to save security settings",
} as const;
