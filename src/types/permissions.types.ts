export const PERMISSION_GROUPS = {
  MACHINE: "machine",
  ORDERS: "orders",
  FINANCE: "finance",
  AUDIT: "audit",
} as const;

export type PermissionGroupKey =
  (typeof PERMISSION_GROUPS)[keyof typeof PERMISSION_GROUPS];

export const PERMISSION_GROUP_LABELS: Record<PermissionGroupKey, string> = {
  [PERMISSION_GROUPS.MACHINE]: "Machine",
  [PERMISSION_GROUPS.ORDERS]: "Orders",
  [PERMISSION_GROUPS.FINANCE]: "Finance",
  [PERMISSION_GROUPS.AUDIT]: "Audit",
};

export interface Permission {
  key: string;
  checked: boolean;
}

export type PermissionsState = Record<PermissionGroupKey, Permission[]>;
