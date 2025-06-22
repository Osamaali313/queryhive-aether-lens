import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mlAnalysisSchema, type MLAnalysisData } from '@/lib/validation';
import type { MLAnalysisResult, AIInsight, DataProcessingResult } from '@/types';

export const useMLModels = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const runMLAnalysis = useMutation<MLAnalysisResult, Error, MLAnalysisData>({
    mutationFn: async (analysisData) => {
      if (!user) throw new Error('User not authenticated');

      // Validate input data
      const validatedData = mlAnalysisSchema.parse(analysisData);

      const { data: result, error } = await supabase.functions.invoke('ml-models', {
        body: validatedData,
      });

      if (error) throw new Error(error.message);
      if (!result) throw new Error('No result from ML analysis');
      
      return result as MLAnalysisResult;
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete",
        description: data.title || "ML analysis completed successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
    onError: (error) => {
      console.error('ML analysis error:', error);
      
      let errorMessage = 'ML analysis failed. Please try again.';
      
      if (error.message.includes('insufficient data')) {
        errorMessage = 'Not enough data for this analysis. Please upload more data or try a different model.';
      } else if (error.message.includes('invalid model')) {
        errorMessage = 'Invalid model type selected. Please choose a different model.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Analysis timed out. Please try with a smaller dataset.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid analysis parameters. Please check your settings.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to run this analysis.';
      }

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const processData = useMutation<DataProcessingResult, Error, { datasetId: string; operations: Record<string, boolean> }>({
    mutationFn: async ({ datasetId, operations }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('data-processing', {
        body: { datasetId, operations },
      });

      if (error) throw new Error(error.message);
      if (!result) throw new Error('No result from data processing');
      
      return result as DataProcessingResult;
    },
    onSuccess: () => {
      toast({
        title: "Data Processing Complete",
        description: "Data has been processed successfully",
      });
    },
    onError: (error) => {
      console.error('Data processing error:', error);
      
      let errorMessage = 'Data processing failed. Please try again.';
      
      if (error.message.includes('invalid data')) {
        errorMessage = 'Invalid data format. Please check your dataset.';
      } else if (error.message.includes('too large')) {
        errorMessage = 'Dataset is too large for processing. Please try with a smaller dataset.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to process this dataset.';
      }

      toast({
        title: "Processing Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const insights = useQuery<AIInsight[]>({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as AIInsight[];
    },
    enabled: !!user?.id,
  });

  return {
    runMLAnalysis,
    processData,
    insights: insights.data || [],
    isLoadingInsights: insights.isLoading,
    insightsError: insights.error,
    isRunningAnalysis: runMLAnalysis.isPending,
    isProcessingData: processData.isPending,
  };
};