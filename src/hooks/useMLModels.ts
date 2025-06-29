
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { MLAnalysisRequest, MLAnalysisResult, AIInsight } from '@/types';

// Export the MLModelType for use in other components
export type MLModelType = 'linear_regression' | 'clustering' | 'anomaly_detection' | 'time_series';

export const useMLModels = () => {
  const { user } = useAuth();
  const { errorToast, successToast } = useToast();

  // Fetch existing insights
  const { data: insights = [], isLoading: isLoadingInsights, refetch: refetchInsights } = useQuery({
    queryKey: ['ai-insights', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('ai_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching insights:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user,
  });

  // Run ML analysis
  const runMLAnalysis = useMutation<MLAnalysisResult, Error, MLAnalysisRequest>({
    mutationFn: async (request) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Running ML analysis:', request);

      const { data, error } = await supabase.functions.invoke('ml-models', {
        body: request,
      });

      if (error) {
        console.error('ML analysis error:', error);
        throw new Error(error.message || 'ML analysis failed');
      }

      if (!data) {
        throw new Error('No response from ML service');
      }

      console.log('ML analysis result:', data);
      return data;
    },
    onSuccess: (result) => {
      console.log('ML analysis successful:', result);
      successToast('Analysis Complete', `${result.title} completed successfully`);
      
      // Refetch insights to include the new one
      refetchInsights();
    },
    onError: (error) => {
      console.error('ML analysis error:', error);
      
      let errorMessage = 'ML analysis failed. Please try again.';
      let errorTitle = "Analysis Failed";
      
      if (error.message.includes('insufficient data')) {
        errorMessage = 'Not enough data points for this analysis. Please upload more data.';
        errorTitle = "Insufficient Data";
      } else if (error.message.includes('invalid model')) {
        errorMessage = 'Invalid model type selected. Please choose a different model.';
        errorTitle = "Invalid Model";
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Analysis timed out. Please try with a smaller dataset.';
        errorTitle = "Analysis Timeout";
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'You need to be signed in to run ML analysis.';
        errorTitle = "Authentication Required";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  return {
    insights: insights as AIInsight[],
    isLoadingInsights,
    runMLAnalysis,
    isRunningAnalysis: runMLAnalysis.isPending,
    refetchInsights,
  };
};
