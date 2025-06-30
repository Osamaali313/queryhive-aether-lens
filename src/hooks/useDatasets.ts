import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { datasetSchema, type DatasetFormData } from '@/lib/validation';
import type { Dataset, DataRecord, ColumnInfo } from '@/types';

// Mock data for demo mode
const DEMO_DATASETS: Dataset[] = [
  {
    id: 'demo-dataset-1',
    user_id: 'demo-user',
    name: 'Sales Data 2024',
    description: 'Monthly sales transactions for 2024',
    file_name: 'sales_data_2024.csv',
    file_size: 1024 * 1024 * 2.5, // 2.5MB
    columns_info: [
      { name: 'date', type: 'date', sample: '2024-01-15' },
      { name: 'customer_id', type: 'text', sample: 'CUST001' },
      { name: 'product_name', type: 'text', sample: 'Laptop Pro' },
      { name: 'category', type: 'text', sample: 'Electronics' },
      { name: 'quantity', type: 'number', sample: 1 },
      { name: 'unit_price', type: 'number', sample: 1299.99 },
      { name: 'total_amount', type: 'number', sample: 1299.99 },
    ],
    row_count: 1247,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
    updated_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
  },
  {
    id: 'demo-dataset-2',
    user_id: 'demo-user',
    name: 'Customer Segments',
    description: 'Customer segmentation data with demographics',
    file_name: 'customer_segments.csv',
    file_size: 1024 * 1024 * 1.2, // 1.2MB
    columns_info: [
      { name: 'customer_id', type: 'text', sample: 'CUST001' },
      { name: 'age', type: 'number', sample: 34 },
      { name: 'gender', type: 'text', sample: 'Female' },
      { name: 'location', type: 'text', sample: 'New York' },
      { name: 'income', type: 'number', sample: 75000 },
      { name: 'purchase_frequency', type: 'number', sample: 2.3 },
      { name: 'loyalty_score', type: 'number', sample: 87 },
    ],
    row_count: 845,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
    updated_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
  }
];

export const useDatasets = () => {
  const { successToast, errorToast } = useToast();
  const queryClient = useQueryClient();
  const [demoDatasets, setDemoDatasets] = useState<Dataset[]>(DEMO_DATASETS);

  const datasetsQuery = useQuery<Dataset[]>({
    queryKey: ['datasets'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return demoDatasets;
    },
  });

  const createDataset = useMutation<Dataset, Error, Omit<DatasetFormData, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
    mutationFn: async (datasetData) => {
      // Validate input data
      const validatedData = datasetSchema.parse(datasetData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Create new dataset
      const newDataset: Dataset = {
        id: `demo-dataset-${Date.now()}`,
        user_id: 'demo-user',
        name: validatedData.name,
        description: validatedData.description,
        file_name: validatedData.file_name,
        file_size: validatedData.file_size,
        columns_info: validatedData.columns_info as ColumnInfo[],
        row_count: validatedData.row_count,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Update local state
      setDemoDatasets(prev => [newDataset, ...prev]);

      return newDataset;
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
      errorToast("Dataset Creation Failed", "Failed to create dataset. Please try again.");
    },
  });

  const insertDataRecords = useMutation<void, Error, { dataset_id: string; records: Record<string, any>[] }>({
    mutationFn: async ({ dataset_id, records }) => {
      if (!records || records.length === 0) {
        throw new Error('No data records provided');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update dataset row count
      setDemoDatasets(prev => 
        prev.map(dataset => 
          dataset.id === dataset_id 
            ? { ...dataset, row_count: records.length, updated_at: new Date().toISOString() }
            : dataset
        )
      );
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
      errorToast("Data Processing Failed", "Failed to insert data records. Please try again.");
    },
  });

  const deleteDataset = useMutation<void, Error, string>({
    mutationFn: async (datasetId) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Remove dataset from local state
      setDemoDatasets(prev => prev.filter(dataset => dataset.id !== datasetId));
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
      errorToast("Dataset Deletion Failed", "Failed to delete dataset. Please try again.");
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