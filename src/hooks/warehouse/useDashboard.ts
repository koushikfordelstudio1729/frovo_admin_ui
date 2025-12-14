"use client";

import { useEffect, useState, useCallback } from 'react';
import { warehouseAPI } from '@/services/warehouseAPI';
import { DashboardData, DashboardParams } from '@/types';

interface UseDashboardReturn {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  refetch: (params?: DashboardParams) => Promise<void>;
}

export const useDashboard = (initialParams?: DashboardParams): UseDashboardReturn => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<DashboardParams | undefined>(initialParams);

  const fetchDashboard = useCallback(async (fetchParams?: DashboardParams) => {
    try {
      setLoading(true);
      setError(null);

      const paramsToUse = fetchParams || params;
      console.log('useDashboard - Fetching dashboard data with params:', paramsToUse);

      const response = await warehouseAPI.getDashboard(paramsToUse);
      console.log('useDashboard - API response:', response);

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('useDashboard - Setting dashboard data:', apiResponse.data);
        setData(apiResponse.data);
        if (fetchParams) {
          setParams(fetchParams);
        }
      } else {
        setError(apiResponse.message || 'Failed to fetch dashboard data');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('useDashboard - Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
  };
};
