
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type MLModelType = 'linear_regression' | 'clustering' | 'anomaly_detection' | 'time_series';

export const useMLModels = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const runMLAnalysis = useMutation({
    mutationFn: async ({ 
      datasetId, 
      modelType, 
      parameters = {} 
    }: {
      datasetId: string;
      modelType: MLModelType;
      parameters?: Record<string, any>;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('ml-models', {
        body: { datasetId, modelType, parameters },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: data.title || "ML analysis completed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const processData = useMutation({
    mutationFn: async ({ 
      datasetId, 
      operations 
    }: {
      datasetId: string;
      operations: {
        clean?: boolean;
        validate?: boolean;
        transform?: boolean;
        analyze?: boolean;
      };
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('data-processing', {
        body: { datasetId, operations },
      });

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Data Processing Complete",
        description: "Data has been processed successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Processing Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const insights = useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return {
    runMLAnalysis,
    processData,
    insights: insights.data || [],
    isLoadingInsights: insights.isLoading,
    isRunningAnalysis: runMLAnalysis.isPending,
    isProcessingData: processData.isPending,
  };
};
