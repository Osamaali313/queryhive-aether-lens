
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAI = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const analyzeData = useMutation({
    mutationFn: async ({ query, data, type = 'natural_language', modelType }: {
      query: string;
      data?: any[];
      type?: string;
      modelType?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      console.log('Sending AI request:', { query, type, modelType, dataLength: data?.length });

      const { data: result, error } = await supabase.functions.invoke('ai-analytics', {
        body: { query, data, type, modelType },
      });

      if (error) {
        console.error('AI function error:', error);
        throw error;
      }
      
      console.log('AI response received:', result);
      return result;
    },
    onError: (error) => {
      console.error('AI analysis error:', error);
      toast({
        title: "AI Analysis Failed",
        description: error.message || "Please check your API configuration",
        variant: "destructive",
      });
    },
  });

  return {
    analyzeData,
    isLoading: analyzeData.isPending,
  };
};
