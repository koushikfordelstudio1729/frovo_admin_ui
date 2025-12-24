"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  UserPlus,
  FileText,
  User,
  Shield,
  ChevronRight
} from "lucide-react";

interface MenuCard {
  title: string;
  icon: any;
  path: string;
  description: string;
  color: string;
}

export default function VendorModulePage() {
  const router = useRouter();

  const mainMenuItems: MenuCard[] = [
    {
      title: "Registered Company",
      icon: Building2,
      path: "/vendor/registered-company",
      description: "Manage registered companies and their details",
      color: "bg-orange-500",
    },
    {
      title: "Vendor Onboard",
      icon: UserPlus,
      path: "/vendor/vendor-management",
      description: "Onboard and manage vendor information",
      color: "bg-orange-400",
    },
    {
      title: "Audit Trails",
      icon: FileText,
      path: "/vendor/audit-trails",
      description: "View audit logs and activity history",
      color: "bg-orange-400",
    },
  ];

  const settingsMenuItems: MenuCard[] = [
    {
      title: "User Profile",
      icon: User,
      path: "/vendor/user-profile",
      description: "Manage your profile settings",
      color: "bg-gray-400",
    },
    {
      title: "Security Settings",
      icon: Shield,
      path: "/vendor/security-security",
      description: "Configure security and privacy settings",
      color: "bg-gray-400",
    },
  ];

  const MenuCardComponent = ({ item }: { item: MenuCard }) => {
    const Icon = item.icon;

    return (
      <div
        onClick={() => router.push(item.path)}
        className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all cursor-pointer group"
      >
        <div className={`${item.color} p-3 rounded-lg`}>
          <Icon className="text-white" size={28} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{item.description}</p>
        </div>
        <ChevronRight className="text-gray-400 group-hover:text-orange-600 transition-colors" size={24} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-2">
            Manage vendors, companies, and access system settings
          </p>
        </div>

        {/* Main Menu Section */}
        <div className="bg-linear-to-br from-orange-50 to-orange-100 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Building2 className="text-orange-600" size={32} />
            <h2 className="text-2xl font-semibold text-gray-900">
              Vendor Management
            </h2>
          </div>

          <div className="space-y-4">
            {mainMenuItems.map((item, index) => (
              <MenuCardComponent key={index} item={item} />
            ))}
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-gray-600" size={32} />
            <h2 className="text-2xl font-semibold text-gray-900">
              Settings & Profile
            </h2>
          </div>

          <div className="space-y-4">
            {settingsMenuItems.map((item, index) => (
              <MenuCardComponent key={index} item={item} />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Vendors</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <UserPlus className="text-orange-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Companies</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <Building2 className="text-blue-500" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">-</p>
              </div>
              <FileText className="text-yellow-500" size={32} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
