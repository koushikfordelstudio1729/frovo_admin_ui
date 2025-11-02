export interface UserRole {
  role: string;
  scope: string;
}

export interface Permission {
  label: string;
  action: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar: string;
  roles: UserRole[];
  permissions: Permission[];
}
