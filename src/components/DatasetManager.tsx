import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Database, Trash2, Calendar, FileText, BarChart3, Upload } from 'lucide-react';
import { useDatasets } from '@/hooks/useDatasets';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import LoadingSpinner from '@/components/LoadingSpinner';
import EmptyState from '@/components/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';
import { useA11y } from './a11y/A11yProvider';

const DatasetManager: React.FC = () => {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const { datasets, isLoading, error, deleteDataset } = useDatasets();
  const { errorToast } = useToast();
  const { announce } = useA11y();

  const handleSelectDataset = (datasetId: string, checked: boolean) => {
    if (checked) {
      setSelectedDatasets(prev => [...prev, datasetId]);
    } else {
      setSelectedDatasets(prev => prev.filter(id => id !== datasetId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDatasets(datasets.map(d => d.id));
      announce(`Selected all ${datasets.length} datasets`, 'polite');
    } else {
      setSelectedDatasets([]);
      announce('Cleared all dataset selections', 'polite');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedDatasets.length === 0) return;

    setIsDeleting(true);
    announce(`Deleting ${selectedDatasets.length} datasets`, 'polite');

    try {
      // Delete each dataset one by one
      for (const datasetId of selectedDatasets) {
        await deleteDataset.mutateAsync(datasetId);
      }

      setSelectedDatasets([]);
      announce(`Successfully deleted ${selectedDatasets.length} datasets`, 'polite');
    } catch (error) {
      console.error('Error deleting datasets:', error);
      
      let errorMessage = 'Failed to delete datasets. Please try again.';
      if (error instanceof Error) {
        if (error.message.includes('permission')) {
          errorMessage = 'You do not have permission to delete these datasets.';
        } else if (error.message.includes('foreign key')) {
          errorMessage = 'Cannot delete datasets that are being used by other components.';
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        }
      }

      errorToast("Deletion Failed", errorMessage);
      announce('Error deleting datasets', 'assertive');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleUploadClick = () => {
    // Find the upload tab trigger and click it
    const uploadTabTrigger = document.querySelector('[value="upload"]');
    if (uploadTabTrigger && uploadTabTrigger instanceof HTMLElement) {
      uploadTabTrigger.click();
    }
  };

  if (isLoading) {
    return (
      <Card className="glass-effect p-6">
        <LoadingSpinner size="lg" message="Loading datasets..." />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="glass-effect p-6">
        <div className="text-center">
          <Database className="w-12 h-12 text-red-500 mx-auto mb-3" aria-hidden="true" />
          <p className="text-red-400 mb-2">Failed to load datasets</p>
          <p className="text-sm text-gray-500">{error.message}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-effect">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-neon-blue" aria-hidden="true" />
            <h3 className="text-lg font-semibold" id="dataset-manager-heading">Dataset Management</h3>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/30">
              {datasets.length} datasets
            </Badge>
            {selectedDatasets.length > 0 && (
              <Button
                onClick={handleDeleteSelected}
                size="sm"
                variant="destructive"
                className="bg-red-600/20 hover:bg-red-600/30 border-red-500/30"
                disabled={isDeleting}
                aria-label={`Delete ${selectedDatasets.length} selected datasets`}
              >
                {isDeleting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-1" aria-hidden="true" />
                    Delete ({selectedDatasets.length})
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4" aria-labelledby="dataset-manager-heading">
        {datasets.length === 0 ? (
          <EmptyState
            title="No datasets found"
            description="Upload your first dataset to start discovering insights"
            icon={Database}
            actionLabel="Upload Data"
            onAction={handleUploadClick}
            iconClassName="bg-neon-blue/10"
          />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 pb-2 border-b border-white/10">
              <Checkbox
                id="select-all-datasets"
                checked={selectedDatasets.length === datasets.length}
                onCheckedChange={handleSelectAll}
                disabled={isDeleting}
                aria-label={selectedDatasets.length === datasets.length ? "Deselect all datasets" : "Select all datasets"}
              />
              <label htmlFor="select-all-datasets" className="text-sm text-muted-foreground cursor-pointer">
                Select all
              </label>
            </div>

            <AnimatePresence>
              {datasets.map((dataset) => (
                <motion.div
                  key={dataset.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`p-4 rounded-lg border transition-all ${
                    selectedDatasets.includes(dataset.id)
                      ? 'border-neon-blue/50 bg-neon-blue/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={`dataset-${dataset.id}`}
                      checked={selectedDatasets.includes(dataset.id)}
                      onCheckedChange={(checked) => 
                        handleSelectDataset(dataset.id, checked as boolean)
                      }
                      className="mt-1"
                      disabled={isDeleting}
                      aria-label={selectedDatasets.includes(dataset.id) ? `Deselect ${dataset.name}` : `Select ${dataset.name}`}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-white truncate" id={`dataset-name-${dataset.id}`}>
                          {dataset.name}
                        </h4>
                        <Badge 
                          variant="outline" 
                          className="ml-2 bg-neon-green/20 text-neon-green border-neon-green/30"
                        >
                          Active
                        </Badge>
                      </div>
                      
                      {dataset.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {dataset.description}
                        </p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <FileText className="w-3 h-3" aria-hidden="true" />
                          <span>{dataset.file_name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BarChart3 className="w-3 h-3" aria-hidden="true" />
                          <span>{dataset.row_count?.toLocaleString() || 0} rows</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" aria-hidden="true" />
                          <span>{formatDate(dataset.created_at)}</span>
                        </div>
                        {dataset.file_size && (
                          <div className="flex items-center space-x-1">
                            <Database className="w-3 h-3" aria-hidden="true" />
                            <span>{formatFileSize(dataset.file_size)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DatasetManager;