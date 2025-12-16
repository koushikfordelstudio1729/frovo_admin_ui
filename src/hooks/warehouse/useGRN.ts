import { useState } from "react";
import { warehouseAPI } from "@/services/warehouseAPI";
import type { GRN, CreateGRNPayload, UpdateGRNStatusPayload } from "@/types";

interface UseGRNReturn {
  grn: GRN | null;
  loading: boolean;
  creating: boolean;
  updating: boolean;
  error: string | null;
  getGRN: (id: string) => Promise<void>;
  createGRN: (
    poId: string,
    data: CreateGRNPayload | FormData
  ) => Promise<GRN | null>;
  updateGRNStatus: (
    id: string,
    data: UpdateGRNStatusPayload
  ) => Promise<boolean>;
  clearError: () => void;
}

export const useGRN = (): UseGRNReturn => {
  const [grn, setGRN] = useState<GRN | null>(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getGRN = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await warehouseAPI.getGRNById(id);

      if (response.data.success) {
        setGRN(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch GRN");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to fetch GRN"
      );
      console.error("Error fetching GRN:", err);
    } finally {
      setLoading(false);
    }
  };

  const createGRN = async (
    poId: string,
    data: CreateGRNPayload | FormData
  ): Promise<GRN | null> => {
    try {
      setCreating(true);
      setError(null);

      const response = await warehouseAPI.createGRN(poId, data);

      if (response.data.success) {
        setGRN(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.message || "Failed to create GRN");
        return null;
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || err.message || "Failed to create GRN"
      );
      console.error("Error creating GRN:", err);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const updateGRNStatus = async (
    id: string,
    data: UpdateGRNStatusPayload
  ): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);

      const response = await warehouseAPI.updateGRNStatus(id, data);

      if (response.data.success) {
        setGRN(response.data.data);
        return true;
      } else {
        setError(response.data.message || "Failed to update GRN status");
        return false;
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update GRN status"
      );
      console.error("Error updating GRN status:", err);
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    grn,
    loading,
    creating,
    updating,
    error,
    getGRN,
    createGRN,
    updateGRNStatus,
    clearError,
  };
};
