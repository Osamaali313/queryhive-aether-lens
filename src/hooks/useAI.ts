
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { aiQuerySchema, type AIQueryData } from '@/lib/validation';
import type { AIAnalysisResponse } from '@/types';

export const useAI = () => {
  const { user } = useAuth();
  const { errorToast, successToast } = useToast();

  const analyzeData = useMutation<AIAnalysisResponse, Error, AIQueryData>({
    mutationFn: async (queryData) => {
      if (!user) throw new Error('User not authenticated');

      // Validate input data
      const validatedData = aiQuerySchema.parse(queryData);

      console.log('Sending AI request:', { 
        query: validatedData.query, 
        type: validatedData.type, 
        modelType: validatedData.modelType, 
        dataLength: validatedData.data?.length 
      });

      try {
        const { data: result, error } = await supabase.functions.invoke('ai-analytics', {
          body: validatedData,
        });

        console.log('Raw response from function:', result);

        if (error) {
          console.error('AI function error:', error);
          throw new Error(error.message || 'AI analysis failed');
        }
        
        if (!result) {
          throw new Error('No response from AI service');
        }

        // Handle both direct response and wrapped response formats
        const response = result.response || result;
        const confidence = result.confidence || 0.7;

        console.log('Processed AI response:', { response, confidence });
        
        // Show success toast for good responses
        if (confidence > 0.8) {
          successToast('Analysis Complete', 'AI has analyzed your query successfully');
        }

        return { response, confidence };
      } catch (error) {
        console.error('AI invoke error:', error);
        throw error; // Re-throw to trigger onError handler
      }
    },
    onError: (error) => {
      console.error('AI analysis error:', error);
      
      let errorMessage = 'AI analysis failed. Please try again.';
      let errorTitle = "Analysis Failed";
      
      if (error.message.includes('API key')) {
        errorMessage = 'AI service configuration error. Please ensure API keys are properly set.';
        errorTitle = "Configuration Error";
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
        errorTitle = "Rate Limit Exceeded";
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try with a simpler query.';
        errorTitle = "Request Timeout";
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid query format. Please check your input and try again.';
        errorTitle = "Validation Error";
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        errorTitle = "Connection Error";
      } else if (error.message.includes('not authenticated')) {
        errorMessage = 'You need to be signed in to use this feature.';
        errorTitle = "Authentication Required";
      } else if (error.message.includes('no data')) {
        errorMessage = 'Please upload some data before running analysis.';
        errorTitle = "No Data Available";
      }

      errorToast(errorTitle, errorMessage);
    },
  });

  return {
    analyzeData,
    isLoading: analyzeData.isPending,
  };
};
