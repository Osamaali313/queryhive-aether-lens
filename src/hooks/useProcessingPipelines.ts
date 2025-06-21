
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface ProcessingPipeline {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  pipeline_config: Record<string, any>;
  status: 'active' | 'inactive' | 'running' | 'error';
  last_run?: string;
  created_at: string;
  updated_at: string;
}

export const useProcessingPipelines = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const pipelines = useQuery({
    queryKey: ['processing-pipelines', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // For now, return mock data since the table doesn't exist in database yet
      return [] as ProcessingPipeline[];
    },
    enabled: !!user?.id,
  });

  const createPipeline = useMutation({
    mutationFn: async ({ 
      name,
      description,
      config
    }: {
      name: string;
      description?: string;
      config: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // For now, return mock data
      const mockPipeline: ProcessingPipeline = {
        id: crypto.randomUUID(),
        user_id: user.id,
        name,
        description,
        pipeline_config: config,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return mockPipeline;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processing-pipelines'] });
      toast({
        title: "Pipeline Created",
        description: "Data processing pipeline created successfully",
      });
    },
  });

  const runPipeline = useMutation({
    mutationFn: async ({ 
      pipelineId,
      datasetId
    }: {
      pipelineId: string;
      datasetId: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('pipeline-orchestrator', {
        body: { 
          pipelineId,
          datasetId,
          action: 'run'
        },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processing-pipelines'] });
      toast({
        title: "Pipeline Running",
        description: "Data processing pipeline started successfully",
      });
    },
  });

  return {
    pipelines: pipelines.data || [],
    isLoading: pipelines.isLoading,
    createPipeline,
    runPipeline,
    isCreating: createPipeline.isPending,
    isRunning: runPipeline.isPending,
  };
};
