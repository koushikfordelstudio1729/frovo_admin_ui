"use client";

import { useEffect, useState } from 'react';
import { warehouseAPI } from '@/services/warehouseAPI';
import { storageUtils } from '@/utils';
import { Warehouse, WarehouseManagerDetails } from '@/types';

interface UseMyWarehouseReturn {
  warehouse: Warehouse | null;
  manager: WarehouseManagerDetails | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMyWarehouse = (): UseMyWarehouseReturn => {
  const [warehouse, setWarehouse] = useState<Warehouse | null>(() => {
    // Initialize from localStorage if available
    const cachedData = storageUtils.getWarehouse<any>();
    console.log('useMyWarehouse - Initial warehouse from localStorage:', cachedData);
    return cachedData?.warehouse || cachedData || null;
  });
  const [manager, setManager] = useState<WarehouseManagerDetails | null>(() => {
    const cachedData = storageUtils.getWarehouse<any>();
    return cachedData?.manager || null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWarehouse = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('useMyWarehouse - Fetching warehouse data from API...');
      const response = await warehouseAPI.getMyWarehouse();
      console.log('useMyWarehouse - Full Axios response:', response);

      // Access response.data because warehouseAPI returns Axios response
      const apiResponse = response.data;
      console.log('useMyWarehouse - API response data:', apiResponse);

      if (apiResponse.success && apiResponse.data) {
        console.log('useMyWarehouse - Setting warehouse data:', apiResponse.data.warehouse);
        console.log('useMyWarehouse - Setting manager data:', apiResponse.data.manager);
        setWarehouse(apiResponse.data.warehouse);
        setManager(apiResponse.data.manager);
        // Store in localStorage for persistence (store the entire data object)
        storageUtils.setWarehouse(apiResponse.data);
      } else {
        setError(apiResponse.message || 'Failed to fetch warehouse');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch warehouse';
      setError(errorMessage);
      console.error('useMyWarehouse - Error fetching warehouse:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouse();
  }, []);

  return {
    warehouse,
    manager,
    loading,
    error,
    refetch: fetchWarehouse,
  };
};
