import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Achievement } from '@/components/AchievementsDisplay';

// Define all possible achievements
export const ACHIEVEMENTS: Achievement[] = [
  // Beginner achievements
  {
    id: 'first_login',
    title: 'First Steps',
    description: 'Log in to QueryHive AI for the first time',
    icon: 'trophy',
    category: 'beginner'
  },
  {
    id: 'complete_onboarding',
    title: 'Ready to Launch',
    description: 'Complete the onboarding process',
    icon: 'rocket',
    category: 'beginner'
  },
  {
    id: 'first_dataset',
    title: 'Data Pioneer',
    description: 'Upload your first dataset',
    icon: 'database',
    category: 'beginner'
  },
  {
    id: 'first_query',
    title: 'Curious Mind',
    description: 'Ask your first question to the AI',
    icon: 'brain',
    category: 'beginner'
  },
  
  // Intermediate achievements
  {
    id: 'first_ml_model',
    title: 'ML Explorer',
    description: 'Run your first machine learning model',
    icon: 'trending-up',
    category: 'intermediate'
  },
  {
    id: 'data_quality_master',
    title: 'Quality Guardian',
    description: 'Achieve 90%+ data quality score',
    icon: 'award',
    category: 'intermediate'
  },
  {
    id: 'five_datasets',
    title: 'Data Collector',
    description: 'Upload 5 different datasets',
    icon: 'database',
    category: 'intermediate'
  },
  
  // Advanced achievements
  {
    id: 'all_ml_models',
    title: 'Model Master',
    description: 'Use all available ML models',
    icon: 'brain',
    category: 'advanced'
  },
  {
    id: 'knowledge_graph',
    title: 'Knowledge Architect',
    description: 'Build your first knowledge graph',
    icon: 'target',
    category: 'advanced'
  },
  {
    id: 'ten_insights',
    title: 'Insight Sage',
    description: 'Generate 10 AI insights',
    icon: 'zap',
    category: 'advanced'
  },
  
  // Expert achievements
  {
    id: 'data_guru',
    title: 'Data Guru',
    description: 'Use QueryHive AI for 30 consecutive days',
    icon: 'star',
    category: 'expert'
  },
  {
    id: 'feedback_champion',
    title: 'Feedback Champion',
    description: 'Provide feedback on 20 AI responses',
    icon: 'award',
    category: 'expert'
  }
];

export const useAchievements = () => {
  const { user } = useAuth();
  const { successToast, errorToast } = useToast();
  const queryClient = useQueryClient();
  const [newAchievements, setNewAchievements] = useState<string[]>([]);

  // Fetch user achievements
  const userAchievements = useQuery({
    queryKey: ['user-achievements', user?.id],
    queryFn: async () => {
      if (!user?.id) return { unlockedAchievements: [], newAchievements: [] };
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If no record exists, create one
        if (error.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievements: [],
              viewed_achievements: []
            })
            .select()
            .single();
          
          if (insertError) throw insertError;
          return { 
            unlockedAchievements: [], 
            newAchievements: [] 
          };
        }
        throw error;
      }
      
      // Calculate new achievements (unlocked but not viewed)
      const newAchievements = data.achievements.filter(
        (id: string) => !data.viewed_achievements.includes(id)
      );
      
      return { 
        unlockedAchievements: data.achievements || [], 
        newAchievements: newAchievements || [] 
      };
    },
    enabled: !!user?.id,
  });

  // Update new achievements state when data changes
  useEffect(() => {
    if (userAchievements.data?.newAchievements) {
      setNewAchievements(userAchievements.data.newAchievements);
    }
  }, [userAchievements.data]);

  // Mutation to unlock an achievement
  const unlockAchievement = useMutation({
    mutationFn: async (achievementId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Check if achievement exists
      if (!ACHIEVEMENTS.some(a => a.id === achievementId)) {
        throw new Error(`Invalid achievement ID: ${achievementId}`);
      }
      
      // Get current achievements
      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievements')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        // If no record exists, create one with this achievement
        if (error.code === 'PGRST116') {
          const { error: insertError } = await supabase
            .from('user_achievements')
            .insert({
              user_id: user.id,
              achievements: [achievementId],
              viewed_achievements: []
            });
          
          if (insertError) throw insertError;
          return { achievementId, isNew: true };
        }
        throw error;
      }
      
      // Check if achievement is already unlocked
      const currentAchievements = data.achievements || [];
      if (currentAchievements.includes(achievementId)) {
        return { achievementId, isNew: false };
      }
      
      // Add achievement to the list
      const updatedAchievements = [...currentAchievements, achievementId];
      
      const { error: updateError } = await supabase
        .from('user_achievements')
        .update({ achievements: updatedAchievements })
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;
      
      return { achievementId, isNew: true };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      
      if (result.isNew) {
        // Find achievement details
        const achievement = ACHIEVEMENTS.find(a => a.id === result.achievementId);
        if (achievement) {
          // Add to new achievements list
          setNewAchievements(prev => [...prev, result.achievementId]);
          
          // Show toast notification
          toast.success(`Achievement Unlocked: ${achievement.title}`, {
            description: achievement.description,
            duration: 5000
          });
        }
      }
    },
    onError: (error) => {
      console.error('Error unlocking achievement:', error);
      errorToast(
        "Achievement Error",
        "Failed to unlock achievement. Please try again."
      );
    },
  });

  // Mutation to mark an achievement as viewed
  const markAchievementViewed = useMutation({
    mutationFn: async (achievementId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      // Get current viewed achievements
      const { data, error } = await supabase
        .from('user_achievements')
        .select('viewed_achievements')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      
      // Add achievement to viewed list
      const viewedAchievements = data.viewed_achievements || [];
      if (viewedAchievements.includes(achievementId)) {
        return; // Already viewed
      }
      
      const updatedViewedAchievements = [...viewedAchievements, achievementId];
      
      const { error: updateError } = await supabase
        .from('user_achievements')
        .update({ viewed_achievements: updatedViewedAchievements })
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;
      
      return achievementId;
    },
    onSuccess: (achievementId) => {
      if (achievementId) {
        // Remove from new achievements list
        setNewAchievements(prev => prev.filter(id => id !== achievementId));
        queryClient.invalidateQueries({ queryKey: ['user-achievements'] });
      }
    },
    onError: (error) => {
      console.error('Error marking achievement as viewed:', error);
    },
  });

  // Check for achievements that should be automatically unlocked
  useEffect(() => {
    const checkAutomaticAchievements = async () => {
      if (!user?.id || userAchievements.isLoading) return;
      
      const unlockedAchievements = userAchievements.data?.unlockedAchievements || [];
      
      // First login achievement
      if (!unlockedAchievements.includes('first_login')) {
        await unlockAchievement.mutateAsync('first_login');
      }
    };
    
    checkAutomaticAchievements();
  }, [user?.id, userAchievements.isLoading, userAchievements.data]);

  // Get achievement details with unlocked status
  const getAchievementsWithStatus = () => {
    const unlockedAchievements = userAchievements.data?.unlockedAchievements || [];
    
    return ACHIEVEMENTS.map(achievement => ({
      ...achievement,
      isUnlocked: unlockedAchievements.includes(achievement.id),
      isNew: newAchievements.includes(achievement.id)
    }));
  };

  return {
    achievements: getAchievementsWithStatus(),
    unlockedAchievements: userAchievements.data?.unlockedAchievements || [],
    newAchievements,
    isLoading: userAchievements.isLoading,
    error: userAchievements.error,
    unlockAchievement,
    markAchievementViewed,
  };
};