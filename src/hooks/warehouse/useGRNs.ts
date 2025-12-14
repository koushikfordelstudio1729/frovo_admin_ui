import { useState, useEffect, useCallback } from "react";
import { warehouseAPI } from "@/services/warehouseAPI";
import type { GRN, GRNParams } from "@/types";

interface UseGRNsReturn {
  grns: GRN[];
  loading: boolean;
  error: string | null;
  refetch: (params?: GRNParams) => Promise<void>;
}

export const useGRNs = (initialParams?: GRNParams): UseGRNsReturn => {
  const [grns, setGRNs] = useState<GRN[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<GRNParams | undefined>(initialParams);

  const fetchGRNs = useCallback(async (fetchParams?: GRNParams) => {
    try {
      setLoading(true);
      setError(null);

      const paramsToUse = fetchParams !== undefined ? fetchParams : params;
      setParams(paramsToUse);

      const response = await warehouseAPI.getGRNs(paramsToUse);

      if (response.data.success) {
        setGRNs(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch GRNs");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch GRNs");
      console.error("Error fetching GRNs:", err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchGRNs();
  }, []);

  return {
    grns,
    loading,
    error,
    refetch: fetchGRNs,
  };
};
