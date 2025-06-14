
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useAI = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const analyzeData = useMutation({
    mutationFn: async ({ query, data, type = 'natural_language' }: {
      query: string;
      data?: any[];
      type?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('ai-analytics', {
        body: { query, data, type },
      });

      if (error) throw error;
      return result;
    },
    onError: (error) => {
      toast({
        title: "AI Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    analyzeData,
    isLoading: analyzeData.isPending,
  };
};
