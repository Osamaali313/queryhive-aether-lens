
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type AchievementType = 
  | 'first_dataset' 
  | 'five_datasets' 
  | 'first_analysis' 
  | 'ml_expert' 
  | 'data_explorer'
  | 'knowledge_seeker'
  | 'first_ml_model'
  | 'first_query';

export interface Achievement {
  id: AchievementType;
  title: string;
  description: string;
  icon: 'target' | 'star' | 'trophy' | 'award' | 'zap' | 'database' | 'brain' | 'trending-up';
  points: number;
  unlocked: boolean;
  unlockedAt?: Date;
  category: string;
}

const ACHIEVEMENTS_DEFINITIONS: Record<AchievementType, Omit<Achievement, 'unlocked' | 'unlockedAt'>> = {
  first_dataset: {
    id: 'first_dataset',
    title: 'Data Pioneer',
    description: 'Upload your first dataset',
    icon: 'database',
    points: 100,
    category: 'data',
  },
  five_datasets: {
    id: 'five_datasets',
    title: 'Data Collector',
    description: 'Upload 5 datasets',
    icon: 'star',
    points: 500,
    category: 'data',
  },
  first_analysis: {
    id: 'first_analysis',
    title: 'Analyst Apprentice',
    description: 'Run your first AI analysis',
    icon: 'brain',
    points: 200,
    category: 'analysis',
  },
  ml_expert: {
    id: 'ml_expert',
    title: 'ML Expert',
    description: 'Use all ML model types',
    icon: 'award',
    points: 1000,
    category: 'ml',
  },
  data_explorer: {
    id: 'data_explorer',
    title: 'Data Explorer',
    description: 'Explore multiple datasets',
    icon: 'trending-up',
    points: 300,
    category: 'exploration',
  },
  knowledge_seeker: {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Generate a knowledge graph',
    icon: 'target',
    points: 400,
    category: 'knowledge',
  },
  first_ml_model: {
    id: 'first_ml_model',
    title: 'ML Pioneer',
    description: 'Run your first ML model',
    icon: 'brain',
    points: 150,
    category: 'ml',
  },
  first_query: {
    id: 'first_query',
    title: 'Query Master',
    description: 'Ask your first AI question',
    icon: 'brain',
    points: 50,
    category: 'query',
  },
};

export const useAchievements = () => {
  const { user } = useAuth();
  const { toast, successToast } = useToast();
  const queryClient = useQueryClient();

  const achievementsQuery = useQuery({
    queryKey: ['achievements', user?.id],
    queryFn: async (): Promise<Achievement[]> => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching achievements:', error);
        throw new Error(`Failed to fetch achievements: ${error.message}`);
      }

      const unlockedAchievements = data?.achievements || [];
      const viewedAchievements = data?.viewed_achievements || [];

      return Object.values(ACHIEVEMENTS_DEFINITIONS).map(achievement => ({
        ...achievement,
        unlocked: unlockedAchievements.includes(achievement.id),
        unlockedAt: unlockedAchievements.includes(achievement.id) ? new Date() : undefined,
      }));
    },
    enabled: !!user?.id,
  });

  const unlockAchievement = useMutation<void, Error, AchievementType>({
    mutationFn: async (achievementId) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Check if achievement is already unlocked
      const currentAchievements = achievementsQuery.data;
      const achievement = currentAchievements?.find(a => a.id === achievementId);
      
      if (achievement?.unlocked) {
        return; // Already unlocked
      }

      const { data: existingData, error: fetchError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(fetchError.message);
      }

      const currentUnlocked = existingData?.achievements || [];
      
      if (currentUnlocked.includes(achievementId)) {
        return; // Already unlocked
      }

      const updatedAchievements = [...currentUnlocked, achievementId];

      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievements: updatedAchievements,
          viewed_achievements: existingData?.viewed_achievements || [],
        });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: (_, achievementId) => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
      
      const achievementDef = ACHIEVEMENTS_DEFINITIONS[achievementId];
      if (achievementDef) {
        successToast(
          "Achievement Unlocked! 🎉",
          `${achievementDef.title}: ${achievementDef.description} (+${achievementDef.points} points)`
        );
      }
    },
    onError: (error) => {
      console.error('Achievement unlock error:', error);
    },
  });

  const markAchievementViewed = useMutation<void, Error, AchievementType>({
    mutationFn: async (achievementId) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data: existingData, error: fetchError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw new Error(fetchError.message);
      }

      const currentViewed = existingData?.viewed_achievements || [];
      
      if (currentViewed.includes(achievementId)) {
        return; // Already viewed
      }

      const updatedViewed = [...currentViewed, achievementId];

      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievements: existingData?.achievements || [],
          viewed_achievements: updatedViewed,
        });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['achievements'] });
    },
  });

  const totalPoints = achievementsQuery.data?.reduce((sum, achievement) => 
    achievement.unlocked ? sum + achievement.points : sum, 0
  ) || 0;

  const unlockedCount = achievementsQuery.data?.filter(a => a.unlocked).length || 0;
  const totalCount = Object.keys(ACHIEVEMENTS_DEFINITIONS).length;

  return {
    achievements: achievementsQuery.data || [],
    isLoading: achievementsQuery.isLoading,
    error: achievementsQuery.error,
    unlockAchievement,
    markAchievementViewed,
    totalPoints,
    unlockedCount,
    totalCount,
  };
};
