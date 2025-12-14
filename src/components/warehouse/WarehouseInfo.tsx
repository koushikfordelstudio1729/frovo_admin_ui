"use client";

import { useMyWarehouse } from '@/hooks/warehouse';
import { Card } from '@/components';

export const WarehouseInfo = () => {
  const { warehouse, loading, error } = useMyWarehouse();

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <p className="text-gray-600">Loading warehouse information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-700">No warehouse assigned</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">My Warehouse</h2>
      <div className="space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Name:</span>
          <span className="text-gray-800">{warehouse.name}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Code:</span>
          <span className="text-gray-800">{warehouse.code}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Partner:</span>
          <span className="text-gray-800">{warehouse.partner}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Location:</span>
          <span className="text-gray-800">{warehouse.location}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Capacity:</span>
          <span className="text-gray-800">{warehouse.capacity.toLocaleString()} units</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600 font-medium">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            warehouse.isActive
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {warehouse.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        {warehouse.manager && (
          <div className="mt-4 pt-4 border-t">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Manager Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-800">{warehouse.manager.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-800">{warehouse.manager.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="text-gray-800">{warehouse.manager.phone}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
