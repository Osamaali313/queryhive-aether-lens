
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Dataset {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  file_name: string;
  file_size?: number;
  columns_info?: any;
  row_count?: number;
  created_at: string;
  updated_at: string;
}

export interface DataRecord {
  id: string;
  dataset_id: string;
  data: any;
  created_at: string;
}

export const useDatasets = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const datasetsQuery = useQuery({
    queryKey: ['datasets', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Dataset[];
    },
    enabled: !!user?.id,
  });

  const createDataset = useMutation({
    mutationFn: async ({ 
      name, 
      description, 
      file_name, 
      file_size, 
      columns_info, 
      row_count 
    }: Omit<Dataset, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('datasets')
        .insert({
          user_id: user.id,
          name,
          description,
          file_name,
          file_size,
          columns_info,
          row_count,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast({
        title: "Dataset created",
        description: "Your dataset has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating dataset",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const insertDataRecords = useMutation({
    mutationFn: async ({ dataset_id, records }: { dataset_id: string; records: any[] }) => {
      const dataRecords = records.map(record => ({
        dataset_id,
        data: record,
      }));

      const { error } = await supabase
        .from('data_records')
        .insert(dataRecords);

      if (error) throw error;

      // Update row count
      await supabase
        .from('datasets')
        .update({ row_count: records.length })
        .eq('id', dataset_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });

  return {
    datasets: datasetsQuery.data || [],
    isLoading: datasetsQuery.isLoading,
    createDataset,
    insertDataRecords,
  };
};
