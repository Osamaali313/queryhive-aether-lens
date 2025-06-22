
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

  const recordInteraction = useMutation({
    mutationFn: async ({ 
      interactionType, 
      data 
    }: {
      interactionType: string;
      data: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Store interaction data for learning
      const { error } = await supabase
        .from('learning_patterns')
        .upsert({
          user_id: user.id,
          pattern_type: interactionType,
          pattern_data: data,
          confidence_score: 0.5,
          usage_count: 1,
        }, {
          onConflict: 'user_id,pattern_type',
          ignoreDuplicates: false
        });

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-patterns'] });
    },
  });

  const submitFeedback = useMutation({
    mutationFn: async ({ 
      interactionId,
      feedbackType,
      rating,
      comment,
      context
    }: {
      interactionId: string;
      feedbackType: 'positive' | 'negative' | 'neutral';
      rating: number;
      comment?: string;
      context?: Record<string, any>;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_feedback')
        .insert({
          user_id: user.id,
          interaction_id: interactionId,
          feedback_type: feedbackType,
          rating,
          comment,
          context: context || {},
        });

      if (error) throw error;

      // Process feedback through learning engine
      const { error: learningError } = await supabase.functions.invoke('learning-engine', {
        body: { 
          action: 'process_feedback',
          feedback: {
            feedback_type: feedbackType,
            rating,
            comment,
            context
          }
        },
      });

      if (learningError) console.warn('Learning engine error:', learningError);
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learning-patterns'] });
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! This helps improve our AI.",
      });
    },
  });

  return {
    patterns: patterns.data || [],
    isLoading: patterns.isLoading,
    getPersonalizedRecommendations,
    recordInteraction,
    submitFeedback,
    isGettingRecommendations: getPersonalizedRecommendations.isPending,
    isProcessing: submitFeedback.isPending,
  };
};
