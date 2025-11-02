export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  status: "Active" | "Inactive";
  lastLogin: string;
}

export interface UserFilters {
  search: string;
  department?: string;
  status?: "Active" | "Inactive";
}
