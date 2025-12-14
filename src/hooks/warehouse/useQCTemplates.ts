"use client";

import { useEffect, useState, useCallback } from 'react';
import { warehouseAPI } from '@/services/warehouseAPI';
import { QCTemplate, QCTemplateParams, CreateQCTemplatePayload, UpdateQCTemplatePayload } from '@/types';
import { toast } from 'react-hot-toast';

interface UseQCTemplatesReturn {
  qcTemplates: QCTemplate[];
  loading: boolean;
  error: string | null;
  refetch: (params?: QCTemplateParams) => Promise<void>;
  createTemplate: (data: CreateQCTemplatePayload) => Promise<boolean>;
  updateTemplate: (id: string, data: UpdateQCTemplatePayload) => Promise<boolean>;
  deleteTemplate: (id: string) => Promise<boolean>;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
}

export const useQCTemplates = (initialParams?: QCTemplateParams): UseQCTemplatesReturn => {
  const [qcTemplates, setQCTemplates] = useState<QCTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<QCTemplateParams | undefined>(initialParams);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchQCTemplates = useCallback(async (fetchParams?: QCTemplateParams) => {
    try {
      setLoading(true);
      setError(null);

      const paramsToUse = fetchParams || params;
      console.log('useQCTemplates - Fetching QC templates with params:', paramsToUse);

      const response = await warehouseAPI.getQCTemplates(paramsToUse);
      console.log('useQCTemplates - API response:', response);

      const apiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        console.log('useQCTemplates - Setting QC templates:', apiResponse.data);
        setQCTemplates(apiResponse.data);
        if (fetchParams) {
          setParams(fetchParams);
        }
      } else {
        setError(apiResponse.message || 'Failed to fetch QC templates');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to fetch QC templates';
      setError(errorMessage);
      console.error('useQCTemplates - Error fetching QC templates:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createTemplate = useCallback(async (data: CreateQCTemplatePayload): Promise<boolean> => {
    try {
      setCreating(true);
      console.log('useQCTemplates - Creating QC template:', data);

      const response = await warehouseAPI.createQCTemplate(data);
      console.log('useQCTemplates - Create response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'QC template created successfully');
        await fetchQCTemplates(params);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to create QC template');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to create QC template';
      toast.error(errorMessage);
      console.error('useQCTemplates - Error creating QC template:', err);
      return false;
    } finally {
      setCreating(false);
    }
  }, [params, fetchQCTemplates]);

  const updateTemplate = useCallback(async (id: string, data: UpdateQCTemplatePayload): Promise<boolean> => {
    try {
      setUpdating(true);
      console.log('useQCTemplates - Updating QC template:', id, data);

      const response = await warehouseAPI.updateQCTemplate(id, data);
      console.log('useQCTemplates - Update response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'QC template updated successfully');
        await fetchQCTemplates(params);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to update QC template');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to update QC template';
      toast.error(errorMessage);
      console.error('useQCTemplates - Error updating QC template:', err);
      return false;
    } finally {
      setUpdating(false);
    }
  }, [params, fetchQCTemplates]);

  const deleteTemplate = useCallback(async (id: string): Promise<boolean> => {
    try {
      setDeleting(true);
      console.log('useQCTemplates - Deleting QC template:', id);

      const response = await warehouseAPI.deleteQCTemplate(id);
      console.log('useQCTemplates - Delete response:', response);

      const apiResponse = response.data;

      if (apiResponse.success) {
        toast.success(apiResponse.message || 'QC template deleted successfully');
        await fetchQCTemplates(params);
        return true;
      } else {
        toast.error(apiResponse.message || 'Failed to delete QC template');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to delete QC template';
      toast.error(errorMessage);
      console.error('useQCTemplates - Error deleting QC template:', err);
      return false;
    } finally {
      setDeleting(false);
    }
  }, [params, fetchQCTemplates]);

  useEffect(() => {
    fetchQCTemplates();
  }, []);

  return {
    qcTemplates,
    loading,
    error,
    refetch: fetchQCTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    creating,
    updating,
    deleting,
  };
};
