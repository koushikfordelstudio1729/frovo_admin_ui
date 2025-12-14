"use client";

import { useEffect, useState, useCallback } from 'react';
import { warehouseAPI } from '@/services/warehouseAPI';
import { ReturnOrder, ReturnQueueParams, CreateReturnOrderPayload } from '@/types';
import { toast } from 'react-hot-toast';

interface UseReturnQueueReturn {
  returns: ReturnOrder[];
  loading: boolean;
  error: string | null;
  refetch: (params?: ReturnQueueParams) => Promise<void>;
  createReturn: (data: CreateReturnOrderPayload) => Promise<boolean>;
  approveReturn: (id: string) => Promise<boolean>;
  rejectReturn: (id: string) => Promise<boolean>;
  creating: boolean;
  approving: boolean;
  rejecting: boolean;
}

export const useReturnQueue = (initialParams?: ReturnQueueParams): UseReturnQueueReturn => {
  const [returns, setReturns] = useState<ReturnOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<ReturnQueueParams | undefined>(initialParams);
  const [creating, setCreating] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const fetchReturnQueue = useCallback(async (fetchParams?: ReturnQueueParams) => {
    try {
      setLoading(true);
      setError(null);

      const paramsToUse = fetchParams || params;
      console.log('useReturnQueue - Fetching return queue with params:', paramsToUse);

      const response = await warehouseAPI.getReturnQueue(paramsToUse);
      console.log('useReturnQueue - API response:', response);

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('useReturnQueue - Setting returns:', apiResponse.data);
        setReturns(apiResponse.data);
        if (fetchParams) {
          setParams(fetchParams);
        }
      } else {
        setError(apiResponse.message || 'Failed to fetch return queue');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch return queue';
      setError(errorMessage);
      console.error('useReturnQueue - Error fetching return queue:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createReturn = useCallback(async (data: CreateReturnOrderPayload): Promise<boolean> => {
    try {
      setCreating(true);
      console.log('useReturnQueue - Creating return order:', data);

      const response = await warehouseAPI.createReturnOrder(data);
      console.log('useReturnQueue - Create response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'Return order created successfully');
        await fetchReturnQueue(params);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to create return order');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create return order';
      toast.error(errorMessage);
      console.error('useReturnQueue - Error creating return order:', err);
      return false;
    } finally {
      setCreating(false);
    }
  }, [params, fetchReturnQueue]);

  const approveReturn = useCallback(async (id: string): Promise<boolean> => {
    try {
      setApproving(true);
      console.log('useReturnQueue - Approving return:', id);

      const response = await warehouseAPI.approveReturn(id);
      console.log('useReturnQueue - Approve response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'Return approved successfully');
        await fetchReturnQueue(params);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to approve return');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to approve return';
      toast.error(errorMessage);
      console.error('useReturnQueue - Error approving return:', err);
      return false;
    } finally {
      setApproving(false);
    }
  }, [params, fetchReturnQueue]);

  const rejectReturn = useCallback(async (id: string): Promise<boolean> => {
    try {
      setRejecting(true);
      console.log('useReturnQueue - Rejecting return:', id);

      const response = await warehouseAPI.rejectReturn(id);
      console.log('useReturnQueue - Reject response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'Return rejected successfully');
        await fetchReturnQueue(params);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to reject return');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to reject return';
      toast.error(errorMessage);
      console.error('useReturnQueue - Error rejecting return:', err);
      return false;
    } finally {
      setRejecting(false);
    }
  }, [params, fetchReturnQueue]);

  useEffect(() => {
    fetchReturnQueue();
  }, []);

  return {
    returns,
    loading,
    error,
    refetch: fetchReturnQueue,
    createReturn,
    approveReturn,
    rejectReturn,
    creating,
    approving,
    rejecting,
  };
};

export default useReturnQueue;
