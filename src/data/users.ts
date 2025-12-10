import { User } from "@/components/auth/LoginForm";

export const DUMMY_USERS: User[] = [
  {
    email: "nkoushikpanda123@gmail.com",
    password: "SuperAdmin@123",
    role: "super_admin",
    name: "Super Admin",
    redirectPath: "/admin/roles-permissions",
  },
  {
    email: "warehouse.manager@example.com",
    password: "SecurePassword123!",
    role: "warehouse_admin",
    name: "Warehouse Admin",
    redirectPath: "/warehouse/dashboard",
  },
  {
    email: "vendor.admin@frovo.com",
    password: "VendorAdmin@123",
    role: "vendor_admin",
    name: "Vendor Admin",
    redirectPath: "/vendor/dashboard",
  },
];
