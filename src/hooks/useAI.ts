import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { aiQuerySchema, type AIQueryData } from '@/lib/validation';
import type { AIAnalysisResponse } from '@/types';

export const useAI = () => {
  const { user } = useAuth();
  const { toast } = useToast();

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

      const { data: result, error } = await supabase.functions.invoke('ai-analytics', {
        body: validatedData,
      });

      if (error) {
        console.error('AI function error:', error);
        throw new Error(error.message || 'AI analysis failed');
      }
      
      if (!result) {
        throw new Error('No response from AI service');
      }

      console.log('AI response received:', result);
      return result;
    },
    onError: (error) => {
      console.error('AI analysis error:', error);
      
      let errorMessage = 'AI analysis failed. Please try again.';
      
      if (error.message.includes('API key')) {
        errorMessage = 'AI service configuration error. Please contact support.';
      } else if (error.message.includes('rate limit')) {
        errorMessage = 'Too many requests. Please wait a moment before trying again.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try with a simpler query.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Invalid query format. Please check your input and try again.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      toast({
        title: "AI Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return {
    analyzeData,
    isLoading: analyzeData.isPending,
  };
};