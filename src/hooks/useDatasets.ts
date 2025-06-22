import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { datasetSchema, type DatasetFormData } from '@/lib/validation';
import type { Dataset, DataRecord } from '@/types';

export const useDatasets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
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

      if (error) throw new Error(error.message);
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

      if (error) throw new Error(error.message);
      return data as Dataset;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast({
        title: "Dataset created",
        description: `"${data.name}" has been successfully created.`,
      });
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

      toast({
        title: "Error creating dataset",
        description: errorMessage,
        variant: "destructive",
      });
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

      if (error) throw new Error(error.message);

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
      }

      toast({
        title: "Error inserting data",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    datasets: datasetsQuery.data || [],
    isLoading: datasetsQuery.isLoading,
    error: datasetsQuery.error,
    createDataset,
    insertDataRecords,
  };
};