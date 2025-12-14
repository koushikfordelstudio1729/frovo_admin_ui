"use client";

import { useState, useCallback } from 'react';
import { warehouseAPI } from '@/services/warehouseAPI';
import { PurchaseOrder, CreatePurchaseOrderPayload, UpdatePOStatusPayload } from '@/types';

interface UsePurchaseOrderReturn {
  purchaseOrder: PurchaseOrder | null;
  loading: boolean;
  error: string | null;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  getPurchaseOrder: (id: string) => Promise<void>;
  createPurchaseOrder: (data: CreatePurchaseOrderPayload | FormData) => Promise<PurchaseOrder | null>;
  updatePOStatus: (id: string, data: UpdatePOStatusPayload) => Promise<PurchaseOrder | null>;
  deletePurchaseOrder: (id: string) => Promise<boolean>;
  clearError: () => void;
}

export const usePurchaseOrder = (): UsePurchaseOrderReturn => {
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPurchaseOrder = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      console.log('usePurchaseOrder - Fetching PO:', id);

      const response = await warehouseAPI.getPurchaseOrderById(id);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('usePurchaseOrder - PO fetched:', apiResponse.data);
        setPurchaseOrder(apiResponse.data);
      } else {
        setError(apiResponse.message || 'Failed to fetch purchase order');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch purchase order';
      setError(errorMessage);
      console.error('usePurchaseOrder - Error fetching PO:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPurchaseOrder = useCallback(async (data: CreatePurchaseOrderPayload | FormData): Promise<PurchaseOrder | null> => {
    try {
      setCreating(true);
      setError(null);
      console.log('usePurchaseOrder - Creating PO:', data instanceof FormData ? 'FormData' : data);

      const response = await warehouseAPI.createPurchaseOrder(data);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('usePurchaseOrder - PO created:', apiResponse.data);
        setPurchaseOrder(apiResponse.data);
        return apiResponse.data;
      } else {
        setError(apiResponse.message || 'Failed to create purchase order');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create purchase order';
      setError(errorMessage);
      console.error('usePurchaseOrder - Error creating PO:', err);
      return null;
    } finally {
      setCreating(false);
    }
  }, []);

  const updatePOStatus = useCallback(async (id: string, data: UpdatePOStatusPayload): Promise<PurchaseOrder | null> => {
    try {
      setUpdating(true);
      setError(null);
      console.log('usePurchaseOrder - Updating PO status:', id, data);

      const response = await warehouseAPI.updatePurchaseOrderStatus(id, data);
      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('usePurchaseOrder - PO status updated:', apiResponse.data);
        setPurchaseOrder(apiResponse.data);
        return apiResponse.data;
      } else {
        setError(apiResponse.message || 'Failed to update purchase order status');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update purchase order status';
      setError(errorMessage);
      console.error('usePurchaseOrder - Error updating PO status:', err);
      return null;
    } finally {
      setUpdating(false);
    }
  }, []);

  const deletePurchaseOrder = useCallback(async (id: string): Promise<boolean> => {
    try {
      setDeleting(true);
      setError(null);
      console.log('usePurchaseOrder - Deleting PO:', id);

      const response = await warehouseAPI.deletePurchaseOrder(id);
      const apiResponse = response.data;

      if (apiResponse.success) {
        console.log('usePurchaseOrder - PO deleted successfully');
        setPurchaseOrder(null);
        return true;
      } else {
        setError(apiResponse.message || 'Failed to delete purchase order');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete purchase order';
      setError(errorMessage);
      console.error('usePurchaseOrder - Error deleting PO:', err);
      return false;
    } finally {
      setDeleting(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    purchaseOrder,
    loading,
    error,
    creating,
    updating,
    deleting,
    getPurchaseOrder,
    createPurchaseOrder,
    updatePOStatus,
    deletePurchaseOrder,
    clearError,
  };
};
