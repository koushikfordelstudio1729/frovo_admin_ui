"use client";

import { useEffect, useState, useCallback } from 'react';
import { warehouseAPI } from '@/services/warehouseAPI';
import { PurchaseOrder, PurchaseOrderParams } from '@/types';

interface UsePurchaseOrdersReturn {
  purchaseOrders: PurchaseOrder[];
  loading: boolean;
  error: string | null;
  refetch: (params?: PurchaseOrderParams) => Promise<void>;
}

export const usePurchaseOrders = (initialParams?: PurchaseOrderParams): UsePurchaseOrdersReturn => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<PurchaseOrderParams | undefined>(initialParams);

  const fetchPurchaseOrders = useCallback(async (fetchParams?: PurchaseOrderParams) => {
    try {
      setLoading(true);
      setError(null);

      const paramsToUse = fetchParams || params;
      console.log('usePurchaseOrders - Fetching purchase orders with params:', paramsToUse);

      const response = await warehouseAPI.getPurchaseOrders(paramsToUse);
      console.log('usePurchaseOrders - API response:', response);

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('usePurchaseOrders - Setting purchase orders:', apiResponse.data);
        setPurchaseOrders(apiResponse.data);
        if (fetchParams) {
          setParams(fetchParams);
        }
      } else {
        setError(apiResponse.message || 'Failed to fetch purchase orders');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch purchase orders';
      setError(errorMessage);
      console.error('usePurchaseOrders - Error fetching purchase orders:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  return {
    purchaseOrders,
    loading,
    error,
    refetch: fetchPurchaseOrders,
  };
};
