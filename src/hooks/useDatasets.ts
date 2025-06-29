import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { datasetSchema, type DatasetFormData } from '@/lib/validation';
import type { Dataset, DataRecord } from '@/types';

export const useDatasets = () => {
  const { user } = useAuth();
  const { toast, successToast, errorToast } = useToast();
  const queryClient = useQueryClient();

  const datasetsQuery = useQuery<Dataset[]>({
    queryKey: ['datasets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching datasets:', error);
        throw new Error(`Failed to fetch datasets: ${error.message}`);
      }
      return data as Dataset[];
    },
    enabled: !!user?.id,
  });

  const createDataset = useMutation<Dataset, Error, Omit<DatasetFormData, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
    mutationFn: async (datasetData) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Validate input data
      const validatedData = datasetSchema.parse(datasetData);

      const { data, error } = await supabase
        .from('datasets')
        .insert({
          user_id: user.id,
          ...validatedData,
        })
        .select()
        .single();

      if (error) {
        console.error('Dataset creation error:', error);
        throw new Error(error.message);
      }
      return data as Dataset;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      successToast(
        "Dataset created successfully",
        `"${data.name}" has been added to your workspace.`
      );
    },
    onError: (error) => {
      console.error('Dataset creation error:', error);
      
      let errorMessage = 'Failed to create dataset. Please try again.';
      
      if (error.message.includes('duplicate')) {
        errorMessage = 'A dataset with this name already exists. Please choose a different name.';
      } else if (error.message.includes('size')) {
        errorMessage = 'File is too large. Please upload a smaller file.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to create datasets.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid dataset information. Please check your input.';
      }

      errorToast("Dataset Creation Failed", errorMessage);
    },
  });

  const insertDataRecords = useMutation<void, Error, { dataset_id: string; records: Record<string, any>[] }>({
    mutationFn: async ({ dataset_id, records }) => {
      if (!records || records.length === 0) {
        throw new Error('No data records provided');
      }

      const dataRecords = records.map(record => ({
        dataset_id,
        data: record,
      }));

      const { error } = await supabase
        .from('data_records')
        .insert(dataRecords);

      if (error) {
        console.error('Data records insertion error:', error);
        throw new Error(error.message);
      }

      // Update row count
      const { error: updateError } = await supabase
        .from('datasets')
        .update({ row_count: records.length })
        .eq('id', dataset_id);

      if (updateError) {
        console.warn('Failed to update row count:', updateError);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      successToast(
        "Data records added",
        "Your data has been successfully processed and is ready for analysis."
      );
    },
    onError: (error) => {
      console.error('Data insertion error:', error);
      
      let errorMessage = 'Failed to insert data records. Please try again.';
      
      if (error.message.includes('size')) {
        errorMessage = 'Data is too large. Please try with a smaller dataset.';
      } else if (error.message.includes('format')) {
        errorMessage = 'Invalid data format. Please check your CSV file.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to add data to this dataset.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      errorToast("Data Processing Failed", errorMessage);
    },
  });

  const deleteDataset = useMutation<void, Error, string>({
    mutationFn: async (datasetId) => {
      if (!user?.id) throw new Error('User not authenticated');

      // First delete data records
      const { error: recordsError } = await supabase
        .from('data_records')
        .delete()
        .eq('dataset_id', datasetId);

      if (recordsError) {
        console.error('Error deleting data records:', recordsError);
        throw new Error(recordsError.message);
      }

      // Then delete the dataset
      const { error } = await supabase
        .from('datasets')
        .delete()
        .eq('id', datasetId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting dataset:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      successToast(
        "Dataset deleted",
        "The dataset has been permanently removed."
      );
    },
    onError: (error) => {
      console.error('Dataset deletion error:', error);
      
      let errorMessage = 'Failed to delete dataset. Please try again.';
      
      if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to delete this dataset.';
      } else if (error.message.includes('foreign key')) {
        errorMessage = 'This dataset is being used by other components and cannot be deleted.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Dataset not found. It may have been already deleted.';
      }

      errorToast("Dataset Deletion Failed", errorMessage);
    },
  });

  return {
    datasets: datasetsQuery.data || [],
    isLoading: datasetsQuery.isLoading,
    error: datasetsQuery.error,
    createDataset,
    insertDataRecords,
    deleteDataset,
  };
};