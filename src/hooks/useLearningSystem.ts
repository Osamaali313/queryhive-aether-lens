
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface LearningPattern {
  id: string;
  user_id: string;
  pattern_type: string;
  pattern_data: Record<string, any>;
  confidence_score: number;
  usage_count: number;
  last_used: string;
  created_at: string;
}

export interface UserFeedback {
  id: string;
  user_id: string;
  interaction_id: string;
  feedback_type: 'positive' | 'negative' | 'neutral';
  rating: number;
  comment?: string;
  context: Record<string, any>;
  created_at: string;
}

export const useLearningSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const patterns = useQuery({
    queryKey: ['learning-patterns', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('learning_patterns')
        .select('*')
        .eq('user_id', user.id)
        .order('confidence_score', { ascending: false });

      if (error) throw error;
      return data as LearningPattern[];
    },
    enabled: !!user?.id,
  });

  const submitFeedback = useMutation({
    mutationFn: async ({ 
      interactionId,
      feedbackType,
      rating,
      comment,
      context = {}
    }: {
      interactionId: string;
      feedbackType: 'positive' | 'negative' | 'neutral';
      rating: number;
      comment?: string;
      context?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          interaction_id: interactionId,
          feedback_type: feedbackType,
          rating,
          comment,
          context,
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger learning system update
      await supabase.functions.invoke('learning-engine', {
        body: { 
          action: 'process_feedback',
          feedback: data
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-patterns'] });
      toast({
        title: "Feedback Submitted",
        description: "Thank you! This helps improve the AI system.",
      });
    },
  });

  const getPersonalizedRecommendations = useMutation({
    mutationFn: async ({ context }: { context: Record<string, any> }) => {
      if (!user) throw new Error('User not authenticated');

      const { data: result, error } = await supabase.functions.invoke('learning-engine', {
        body: { 
          action: 'get_recommendations',
          context
        },
      });

      if (error) throw error;
      return result;
    },
  });

  return {
    patterns: patterns.data || [],
    isLoading: patterns.isLoading,
    submitFeedback,
    getPersonalizedRecommendations,
    isProcessing: submitFeedback.isPending || getPersonalizedRecommendations.isPending,
  };
};
