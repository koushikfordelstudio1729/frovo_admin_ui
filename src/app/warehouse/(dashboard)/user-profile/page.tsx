"use client";

import { useMyWarehouse } from "@/hooks/warehouse";
import { Warehouse, MapPin, Package, Building2, User, Mail, Phone, Shield, Key, CheckCircle2, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authAPI } from "@/services/authAPI";
import { storageUtils } from "@/utils";

export default function WarehouseProfilePage() {
  const router = useRouter();
  const { warehouse, manager, loading } = useMyWarehouse();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await authAPI.logout();

      // Clear all auth data from storage
      storageUtils.clearAuthData();

      // Redirect to login page
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);

      // Even if API call fails, clear local data and redirect
      storageUtils.clearAuthData();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!manager || !warehouse) {
    return (
      <div className="min-h-screen pt-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-lg">
          <div className="flex items-center gap-3">
            <Warehouse className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">No Data Available</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Unable to load your profile information. Please try logging in again.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 space-y-6">
      {/* Manager Profile Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{manager.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Mail className="w-4 h-4" />
                <p className="text-purple-100">{manager.email}</p>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="w-4 h-4" />
                <p className="text-purple-100">{manager.phone}</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <LogOut className="w-5 h-5" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>

      {/* Roles Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-500" />
          Assigned Roles
        </h2>
        <div className="space-y-3">
          {manager.roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
              <div>
                <p className="font-semibold text-gray-900">{role.name}</p>
                <p className="text-sm text-gray-600">Key: {role.key}</p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-purple-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Permissions Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Key className="w-6 h-6 text-blue-500" />
          Permissions ({manager.permissions.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {manager.permissions.map((permission, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-blue-50 rounded-lg p-3 border-l-4 border-blue-500"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 font-medium">{permission}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assigned Warehouse Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Warehouse className="w-6 h-6 text-green-500" />
          Assigned Warehouse
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-l-4 border-blue-500 pl-4 py-2">
            <p className="text-sm text-gray-600 mb-1">Warehouse Name</p>
            <p className="text-lg font-semibold text-gray-900">{warehouse.name}</p>
          </div>

          <div className="border-l-4 border-green-500 pl-4 py-2">
            <p className="text-sm text-gray-600 mb-1">Warehouse Code</p>
            <p className="text-lg font-semibold text-gray-900">{warehouse.code}</p>
          </div>

          <div className="border-l-4 border-purple-500 pl-4 py-2">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Building2 className="w-4 h-4" />
              Partner
            </p>
            <p className="text-lg font-semibold text-gray-900">{warehouse.partner}</p>
          </div>

          <div className="border-l-4 border-orange-500 pl-4 py-2">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Package className="w-4 h-4" />
              Capacity
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {warehouse.capacity.toLocaleString()} units
            </p>
          </div>

          <div className="border-l-4 border-red-500 pl-4 py-2 md:col-span-2">
            <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Location
            </p>
            <p className="text-base font-medium text-gray-900">{warehouse.location}</p>
          </div>

          <div className="md:col-span-2 flex items-center justify-between bg-gray-50 rounded-lg p-4">
            <span className="text-sm text-gray-600">Warehouse Status</span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
              warehouse.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {warehouse.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
