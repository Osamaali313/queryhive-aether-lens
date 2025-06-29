import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { mlAnalysisSchema, type MLAnalysisData } from '@/lib/validation';
import type { MLAnalysisResult, AIInsight, DataProcessingResult } from '@/types';

export const useMLModels = () => {
  const { user } = useAuth();
  const { successToast, errorToast } = useToast();
  const queryClient = useQueryClient();

  const runMLAnalysis = useMutation<MLAnalysisResult, Error, MLAnalysisData>({
    mutationFn: async (analysisData) => {
      if (!user) throw new Error('User not authenticated');

      // Validate input data
      const validatedData = mlAnalysisSchema.parse(analysisData);

      const { data: result, error } = await supabase.functions.invoke('ml-models', {
        body: validatedData,
      });

      if (error) {
        console.error('ML model function error:', error);
        throw new Error(error.message);
      }
      if (!result) throw new Error('No result from ML analysis');
      
      return result as MLAnalysisResult;
    },
    onSuccess: (data) => {
      successToast(
        "Analysis Complete",
        data.title || "ML analysis completed successfully"
      );
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
    },
    onError: (error) => {
      console.error('ML analysis error:', error);
      
      let errorMessage = 'ML analysis failed. Please try again.';
      let errorTitle = "Analysis Failed";
      
      if (error.message.includes('insufficient data')) {
        errorMessage = 'Not enough data for this analysis. Please upload more data or try a different model.';
        errorTitle = "Insufficient Data";
      } else if (error.message.includes('invalid model')) {
        errorMessage = 'Invalid model type selected. Please choose a different model.';
        errorTitle = "Invalid Model";
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Analysis timed out. Please try with a smaller dataset.';
        errorTitle = "Timeout Error";
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid analysis parameters. Please check your settings.';
        errorTitle = "Validation Error";
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to run this analysis.';
        errorTitle = "Permission Denied";
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'You need to be signed in to use this feature.';
        errorTitle = "Authentication Required";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  const processData = useMutation<DataProcessingResult, Error, { datasetId: string; operations: Record<string, boolean> }>({
    mutationFn: async ({ datasetId, operations }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('data-processing', {
        body: { datasetId, operations },
      });

      if (error) {
        console.error('Data processing error:', error);
        throw new Error(error.message);
      }
      if (!result) throw new Error('No result from data processing');
      
      return result as DataProcessingResult;
    },
    onSuccess: (data) => {
      successToast(
        "Data Processing Complete",
        `Processed ${data.processedCount} records with a quality score of ${data.qualityMetrics.completeness.toFixed(1)}%`
      );
    },
    onError: (error) => {
      console.error('Data processing error:', error);
      
      let errorMessage = 'Data processing failed. Please try again.';
      let errorTitle = "Processing Failed";
      
      if (error.message.includes('invalid data')) {
        errorMessage = 'Invalid data format. Please check your dataset.';
        errorTitle = "Invalid Data";
      } else if (error.message.includes('too large')) {
        errorMessage = 'Dataset is too large for processing. Please try with a smaller dataset.';
        errorTitle = "Dataset Too Large";
      } else if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to process this dataset.';
        errorTitle = "Permission Denied";
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'You need to be signed in to use this feature.';
        errorTitle = "Authentication Required";
      }

      errorToast(errorTitle, errorMessage);
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

      if (error) {
        console.error('Error fetching insights:', error);
        throw new Error(error.message);
      }
      return data as AIInsight[];
    },
    enabled: !!user?.id,
  });

  const deleteInsight = useMutation<void, Error, string>({
    mutationFn: async (insightId) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('ai_insights')
        .delete()
        .eq('id', insightId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting insight:', error);
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      successToast(
        "Insight Deleted",
        "The insight has been removed from your workspace."
      );
    },
    onError: (error) => {
      console.error('Insight deletion error:', error);
      
      let errorMessage = 'Failed to delete insight. Please try again.';
      let errorTitle = "Deletion Failed";
      
      if (error.message.includes('permission')) {
        errorMessage = 'You do not have permission to delete this insight.';
        errorTitle = "Permission Denied";
      } else if (error.message.includes('not found')) {
        errorMessage = 'Insight not found. It may have been already deleted.';
        errorTitle = "Insight Not Found";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  return {
    runMLAnalysis,
    processData,
    insights: insights.data || [],
    deleteInsight,
    isLoadingInsights: insights.isLoading,
    insightsError: insights.error,
    isRunningAnalysis: runMLAnalysis.isPending,
    isProcessingData: processData.isPending,
  };
};