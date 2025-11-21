// src/data/users.ts
import { User } from "@/components/auth/LoginForm";

export const DUMMY_USERS: User[] = [
  {
    email: "superadmin@frovo.in",
    password: "admin123",
    role: "super_admin",
    name: "Super Admin",
    redirectPath: "/admin/roles-permissions",
  },
  {
    email: "warehouse@frovo.in",
    password: "warehouse123",
    role: "warehouse_admin",
    name: "Warehouse Admin",
    redirectPath: "/warehouse/dashboard",
  },
  {
    email: "vendor@frovo.in",
    password: "vendor123",
    role: "vendor_admin",
    name: "Vendor Admin",
    redirectPath: "/vendor/dashboard",
  },
];
