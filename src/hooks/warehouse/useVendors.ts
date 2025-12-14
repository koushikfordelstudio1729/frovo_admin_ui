import { useState, useEffect, useCallback } from "react";
import { getVendors } from "@/services/vendor";
import type { Vendor } from "@/types";

interface UseVendorsReturn {
  vendors: Vendor[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useVendors = (page = 1, limit = 100): UseVendorsReturn => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getVendors(page, limit);

      if (response.data.success) {
        setVendors(response.data.data.vendors);
      } else {
        setError("Failed to fetch vendors");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch vendors");
      console.error("Error fetching vendors:", err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  return {
    vendors,
    loading,
    error,
    refetch: fetchVendors,
  };
};
