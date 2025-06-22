import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { pipelineSchema, type PipelineData } from '@/lib/validation';
import type { ProcessingPipeline } from '@/types';

export const useProcessingPipelines = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const pipelines = useQuery<ProcessingPipeline[]>({
    queryKey: ['processing-pipelines', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('processing_pipelines')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as ProcessingPipeline[];
    },
    enabled: !!user?.id,
  });

  const createPipeline = useMutation<ProcessingPipeline, Error, PipelineData>({
    mutationFn: async (pipelineData) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Validate input data
      const validatedData = pipelineSchema.parse(pipelineData);

      const { data, error } = await supabase
        .from('processing_pipelines')
        .insert({
          user_id: user.id,
          name: validatedData.name,
          description: validatedData.description,
          pipeline_config: validatedData.config,
          status: 'active',
        })
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as ProcessingPipeline;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processing-pipelines'] });
      toast({
        title: "Pipeline Created",
        description: "Data processing pipeline created successfully",
      });
    },
    onError: (error) => {
      console.error('Pipeline creation error:', error);
      
      let errorMessage = 'Failed to create pipeline. Please try again.';
      
      if (error.message.includes('duplicate')) {
        errorMessage = 'A pipeline with this name already exists.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid pipeline configuration. Please check your settings.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to create pipelines.';
      }

      toast({
        title: "Pipeline Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const runPipeline = useMutation<any, Error, { pipelineId: string; datasetId: string }>({
    mutationFn: async ({ pipelineId, datasetId }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('pipeline-orchestrator', {
        body: { 
          pipelineId,
          datasetId,
          action: 'run'
        },
      });

      if (error) throw new Error(error.message);
      if (!result) throw new Error('No result from pipeline execution');
      
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processing-pipelines'] });
      toast({
        title: "Pipeline Running",
        description: "Data processing pipeline started successfully",
      });
    },
    onError: (error) => {
      console.error('Pipeline execution error:', error);
      
      let errorMessage = 'Failed to run pipeline. Please try again.';
      
      if (error.message.includes('not found')) {
        errorMessage = 'Pipeline or dataset not found.';
      } else if (error.message.includes('already running')) {
        errorMessage = 'Pipeline is already running. Please wait for it to complete.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to run this pipeline.';
      } else if (error.message.includes('invalid data')) {
        errorMessage = 'Invalid dataset for this pipeline. Please check your data.';
      }

      toast({
        title: "Pipeline Execution Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    pipelines: pipelines.data || [],
    isLoading: pipelines.isLoading,
    error: pipelines.error,
    createPipeline,
    runPipeline,
    isCreating: createPipeline.isPending,
    isRunning: runPipeline.isPending,
  };
};