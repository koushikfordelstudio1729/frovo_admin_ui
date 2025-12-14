"use client";

import { useEffect, useState, useCallback } from 'react';
import { warehouseAPI } from '@/services/warehouseAPI';
import { FieldAgent, FieldAgentParams, CreateFieldAgentPayload } from '@/types';
import { toast } from 'react-hot-toast';

interface UseFieldAgentsReturn {
  fieldAgents: FieldAgent[];
  loading: boolean;
  error: string | null;
  refetch: (params?: FieldAgentParams) => Promise<void>;
  createFieldAgent: (data: CreateFieldAgentPayload) => Promise<boolean>;
  creating: boolean;
}

export const useFieldAgents = (initialParams?: FieldAgentParams): UseFieldAgentsReturn => {
  const [fieldAgents, setFieldAgents] = useState<FieldAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<FieldAgentParams | undefined>(initialParams);
  const [creating, setCreating] = useState(false);

  const fetchFieldAgents = useCallback(async (fetchParams?: FieldAgentParams) => {
    try {
      setLoading(true);
      setError(null);

      const paramsToUse = fetchParams || params;
      console.log('useFieldAgents - Fetching field agents with params:', paramsToUse);

      const response = await warehouseAPI.getFieldAgents(paramsToUse);
      console.log('useFieldAgents - API response:', response);

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('useFieldAgents - Setting field agents:', apiResponse.data);
        setFieldAgents(apiResponse.data);
        if (fetchParams) {
          setParams(fetchParams);
        }
      } else {
        setError(apiResponse.message || 'Failed to fetch field agents');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch field agents';
      setError(errorMessage);
      console.error('useFieldAgents - Error fetching field agents:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createFieldAgent = useCallback(async (data: CreateFieldAgentPayload): Promise<boolean> => {
    try {
      setCreating(true);
      console.log('useFieldAgents - Creating field agent:', data);

      const response = await warehouseAPI.createFieldAgent(data);
      console.log('useFieldAgents - Create response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'Field agent created successfully');
        await fetchFieldAgents(params);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to create field agent');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create field agent';
      toast.error(errorMessage);
      console.error('useFieldAgents - Error creating field agent:', err);
      return false;
    } finally {
      setCreating(false);
    }
  }, [params, fetchFieldAgents]);

  useEffect(() => {
    fetchFieldAgents();
  }, []);

  return {
    fieldAgents,
    loading,
    error,
    refetch: fetchFieldAgents,
    createFieldAgent,
    creating,
  };
};

export default useFieldAgents;
