import { useState, useCallback } from 'react';
import { api } from '../services/api';
import type { RequestConfig } from '../types';

interface UseApiState<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: string) => void;
}

export const useApi = <T = unknown>(options?: UseApiOptions) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(async (config: RequestConfig) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await api.request(config);
      const data = response.data;
      
      setState({
        data,
        error: null,
        isLoading: false,
      });

      if (options?.onSuccess) {
        options.onSuccess(data);
      }

      return { data, error: null };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message || 'An error occurred'
        : error instanceof Error 
        ? error.message 
        : 'An error occurred';
      
      setState({
        data: null,
        error: errorMessage,
        isLoading: false,
      });

      if (options?.onError) {
        options.onError(errorMessage);
      }

      return { data: null, error: errorMessage };
    }
  }, [options]);

  const reset = useCallback(() => {
    setState({
      data: null,
      error: null,
      isLoading: false,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
};