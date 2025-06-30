import { useMutation, useQuery } from '@tanstack/react-query';
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

// Demo achievements for the demo mode
const DEMO_ACHIEVEMENTS = [
  {
    ...ACHIEVEMENTS_DEFINITIONS.first_dataset,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 3) // 3 days ago
  },
  {
    ...ACHIEVEMENTS_DEFINITIONS.first_query,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000 * 2) // 2 days ago
  },
  {
    ...ACHIEVEMENTS_DEFINITIONS.first_ml_model,
    unlocked: true,
    unlockedAt: new Date(Date.now() - 86400000) // 1 day ago
  },
  {
    ...ACHIEVEMENTS_DEFINITIONS.data_explorer,
    unlocked: false
  },
  {
    ...ACHIEVEMENTS_DEFINITIONS.five_datasets,
    unlocked: false
  },
  {
    ...ACHIEVEMENTS_DEFINITIONS.knowledge_seeker,
    unlocked: false
  },
  {
    ...ACHIEVEMENTS_DEFINITIONS.ml_expert,
    unlocked: false
  },
  {
    ...ACHIEVEMENTS_DEFINITIONS.first_analysis,
    unlocked: false
  }
];

export const useAchievements = () => {
  const { successToast } = useToast();

  // Use demo achievements instead of fetching from the database
  const achievementsQuery = useQuery({
    queryKey: ['achievements'],
    queryFn: async (): Promise<Achievement[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return DEMO_ACHIEVEMENTS as Achievement[];
    },
  });

  const unlockAchievement = useMutation<void, Error, AchievementType>({
    mutationFn: async (achievementId) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Update local achievements
      const achievement = DEMO_ACHIEVEMENTS.find(a => a.id === achievementId);
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedAt = new Date();
      }
    },
    onSuccess: (_, achievementId) => {
      const achievementDef = ACHIEVEMENTS_DEFINITIONS[achievementId];
      if (achievementDef) {
        successToast(
          "Achievement Unlocked! 🎉",
          `${achievementDef.title}: ${achievementDef.description} (+${achievementDef.points} points)`
        );
      }
    },
  });

  const markAchievementViewed = useMutation<void, Error, AchievementType>({
    mutationFn: async (achievementId) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // In a real app, this would update the database
      console.log(`Marked achievement ${achievementId} as viewed`);
    },
  });

  const unlockedCount = achievementsQuery.data?.filter(a => a.unlocked).length || 0;
  const totalCount = Object.keys(ACHIEVEMENTS_DEFINITIONS).length;
  const totalPoints = achievementsQuery.data?.reduce((sum, achievement) => 
    achievement.unlocked ? sum + achievement.points : sum, 0
  ) || 0;

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