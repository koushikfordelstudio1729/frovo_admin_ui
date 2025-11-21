"use client";

import UserProfile from "@/components/profile/UserProfile";
import { MOCK_USER_PROFILE } from "@/config/admin/user-profile.config";

export default function WarehouseProfilePage() {
  const user = MOCK_USER_PROFILE;

  return (
    <UserProfile
      name={user.name}
      email={user.email}
      avatar={user.avatar}
      roles={user.roles}
      permissions={user.permissions}
      onRequestMoreAccess={() => {}}
    />
  );
}
