"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components";
import { useRouter } from "next/navigation";

interface Role {
  role: string;
  scope: string;
}

interface Permission {
  label: string;
  action: string;
}

interface UserProfileProps {
  name: string;
  email: string;
  avatar: string;
  roles: Role[];
  permissions: Permission[];
  onBack?: () => void;
  onRequestMoreAccess?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  name,
  email,
  avatar,
  roles,
  permissions,
  onBack,
  onRequestMoreAccess,
}) => {
  const router = useRouter();

  // 🔐 Redirect function (works even without parent)
  const handleChangePassword = () => {
    router.push("/userprofile-password");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top Section (Back + Title + Change Password Button) */}
      <div className="mb-8 flex items-center justify-between w-full">
        {/* Left (Back + Name) */}
        <div className="flex items-center gap-3">
          <button
            className="text-gray-700 hover:text-gray-900 p-1"
            onClick={onBack}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        </div>

        {/* Right — Change Password Button */}
        <Button
          variant="primary"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          onClick={handleChangePassword} // ← FIXED HERE
        >
          Change Password
        </Button>
      </div>

      <div className="mx-auto bg-white rounded-xl p-8">
        {/* Profile Section */}
        <div className="flex flex-col items-center justify-center gap-8 mb-8">
          <img
            src={avatar}
            alt={name}
            className="w-48 h-48 rounded-full border-r-8 border-orange-500 shrink-0"
          />
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900">{name}</h2>
            <p className="text-xl text-gray-600">{email}</p>
          </div>
        </div>

        {/* Role List */}
        <div className="mb-8 flex flex-col justify-center items-center">
          <h3 className="text-2xl font-medium text-gray-900 mb-4">Role List</h3>
          <div className="w-sm rounded-lg">
            <div className="grid grid-cols-2 bg-orange-600 text-white font-bold">
              <div className="px-6 py-4 text-black font-medium text-xl">Role</div>
              <div className="px-6 py-4 text-black font-medium text-xl">Scope</div>
            </div>
            {roles.map((role, index) => (
              <div
                key={index}
                className={`grid grid-cols-2 ${
                  index !== roles.length - 1 ? "border border-gray-200" : ""
                }`}
              >
                <div className="px-6 py-4 text-gray-900 font-medium text-xl border border-gray-400 rounded-bl-xl">
                  {role.role}
                </div>
                <div className="px-6 py-4 text-gray-700 font-medium text-xl border border-gray-400 rounded-br-xl">
                  {role.scope}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission Summary */}
        <div className="mb-8 flex flex-col justify-end items-center">
          <h3 className="text-2xl font-medium text-gray-900 mb-4">
            Permission Summary
          </h3>
          <div className="flex gap-4 flex-wrap">
            {permissions.map((perm, index) => (
              <div
                key={index}
                className="px-4 py-2 text-xl bg-white border border-gray-300 rounded-lg text-gray-400 font-medium"
              >
                {perm.label} : {perm.action}
              </div>
            ))}
          </div>
        </div>

        {/* Request More Access Button */}
        <div className="flex justify-center">
          <Button
            variant="primary"
            size="lg"
            className="px-10 rounded-lg"
            onClick={onRequestMoreAccess}
          >
            Request More Access
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
