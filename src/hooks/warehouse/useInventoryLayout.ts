"use client";

import { useEffect, useState, useCallback } from 'react';
import { warehouseAPI } from '@/services/warehouseAPI';
import {
  InventoryItem,
  InventoryStats,
  InventoryDashboardParams,
  UpdateInventoryItemPayload
} from '@/types';
import { toast } from 'react-hot-toast';

interface UseInventoryLayoutReturn {
  // Data
  inventory: InventoryItem[];
  stats: InventoryStats | null;
  total: number;
  page: number;
  totalPages: number;

  // Loading states
  loading: boolean;
  statsLoading: boolean;
  updating: boolean;
  archiving: boolean;

  // Error
  error: string | null;

  // Actions
  refetch: (params?: InventoryDashboardParams) => Promise<void>;
  updateInventoryItem: (id: string, data: UpdateInventoryItemPayload) => Promise<boolean>;
  archiveItem: (id: string) => Promise<boolean>;
  unarchiveItem: (id: string) => Promise<boolean>;
  bulkArchive: (ids: string[]) => Promise<boolean>;
  bulkUnarchive: (ids: string[]) => Promise<boolean>;
  setPage: (page: number) => void;
}

export const useInventoryLayout = (
  warehouseId: string,
  initialParams?: InventoryDashboardParams
): UseInventoryLayoutReturn => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialParams?.page || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<InventoryDashboardParams | undefined>(initialParams);

  // Fetch inventory dashboard
  const fetchInventory = useCallback(async (fetchParams?: InventoryDashboardParams) => {
    try {
      setLoading(true);
      setError(null);

      const paramsToUse = fetchParams || params;
      console.log('useInventoryLayout - Fetching inventory with params:', paramsToUse);

      const response = await warehouseAPI.getInventoryDashboard(warehouseId, paramsToUse);
      console.log('useInventoryLayout - API response:', response);

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('useInventoryLayout - Setting inventory:', apiResponse.data);
        setInventory(apiResponse.data.inventory);
        setTotal(apiResponse.data.total);
        setPage(apiResponse.data.page);
        setTotalPages(apiResponse.data.totalPages);
        if (fetchParams) {
          setParams(fetchParams);
        }
      } else {
        setError(apiResponse.message || 'Failed to fetch inventory');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch inventory';
      setError(errorMessage);
      console.error('useInventoryLayout - Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  }, [warehouseId, params]);

  // Fetch inventory stats
  const fetchStats = useCallback(async () => {
    try {
      setStatsLoading(true);
      console.log('useInventoryLayout - Fetching stats for warehouse:', warehouseId);

      const response = await warehouseAPI.getInventoryStats(warehouseId);
      console.log('useInventoryLayout - Stats response:', response);

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setStats(apiResponse.data);
      }
    } catch (err: any) {
      console.error('useInventoryLayout - Error fetching stats:', err);
      // Don't set error for stats - it's not critical
    } finally {
      setStatsLoading(false);
    }
  }, [warehouseId]);

  // Update inventory item
  const updateInventoryItem = useCallback(async (
    id: string,
    data: UpdateInventoryItemPayload
  ): Promise<boolean> => {
    try {
      setUpdating(true);
      console.log('useInventoryLayout - Updating inventory item:', id, data);

      const response = await warehouseAPI.updateInventoryItem(id, data);
      console.log('useInventoryLayout - Update response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'Inventory item updated successfully');
        await Promise.all([fetchInventory(params), fetchStats()]);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to update inventory item');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update inventory item';
      toast.error(errorMessage);
      console.error('useInventoryLayout - Error updating inventory item:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [warehouseId, params, fetchInventory, fetchStats]);

  // Archive inventory item
  const archiveItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setArchiving(true);
      console.log('useInventoryLayout - Archiving item:', id);

      const response = await warehouseAPI.archiveInventoryItem(id);
      console.log('useInventoryLayout - Archive response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'Item archived successfully');
        await Promise.all([fetchInventory(params), fetchStats()]);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to archive item');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to archive item';
      toast.error(errorMessage);
      console.error('useInventoryLayout - Error archiving item:', err);
      return false;
    } finally {
      setArchiving(false);
    }
  }, [params, fetchInventory, fetchStats]);

  // Unarchive inventory item
  const unarchiveItem = useCallback(async (id: string): Promise<boolean> => {
    try {
      setArchiving(true);
      console.log('useInventoryLayout - Unarchiving item:', id);

      const response = await warehouseAPI.unarchiveInventoryItem(id);
      console.log('useInventoryLayout - Unarchive response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'Item unarchived successfully');
        await Promise.all([fetchInventory(params), fetchStats()]);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to unarchive item');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to unarchive item';
      toast.error(errorMessage);
      console.error('useInventoryLayout - Error unarchiving item:', err);
      return false;
    } finally {
      setArchiving(false);
    }
  }, [params, fetchInventory, fetchStats]);

  // Bulk archive
  const bulkArchive = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      setArchiving(true);
      console.log('useInventoryLayout - Bulk archiving items:', ids);

      const response = await warehouseAPI.bulkArchiveInventory({ inventoryIds: ids });
      console.log('useInventoryLayout - Bulk archive response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || `${ids.length} items archived successfully`);
        await Promise.all([fetchInventory(params), fetchStats()]);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to archive items');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to archive items';
      toast.error(errorMessage);
      console.error('useInventoryLayout - Error bulk archiving:', err);
      return false;
    } finally {
      setArchiving(false);
    }
  }, [params, fetchInventory, fetchStats]);

  // Bulk unarchive
  const bulkUnarchive = useCallback(async (ids: string[]): Promise<boolean> => {
    try {
      setArchiving(true);
      console.log('useInventoryLayout - Bulk unarchiving items:', ids);

      const response = await warehouseAPI.bulkUnarchiveInventory({ inventoryIds: ids });
      console.log('useInventoryLayout - Bulk unarchive response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || `${ids.length} items unarchived successfully`);
        await Promise.all([fetchInventory(params), fetchStats()]);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to unarchive items');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to unarchive items';
      toast.error(errorMessage);
      console.error('useInventoryLayout - Error bulk unarchiving:', err);
      return false;
    } finally {
      setArchiving(false);
    }
  }, [params, fetchInventory, fetchStats]);

  // Initial fetch
  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  return {
    inventory,
    stats,
    total,
    page,
    totalPages,
    loading,
    statsLoading,
    updating,
    archiving,
    error,
    refetch: fetchInventory,
    updateInventoryItem,
    archiveItem,
    unarchiveItem,
    bulkArchive,
    bulkUnarchive,
    setPage,
  };
};

export default useInventoryLayout;
