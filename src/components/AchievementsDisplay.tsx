import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Award, 
  Star, 
  Zap, 
  Database, 
  Brain, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useA11y } from './a11y/A11yProvider';
import confetti from '@/lib/confetti';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'award' | 'star' | 'zap' | 'database' | 'brain' | 'trending-up' | 'target';
  category: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  unlockedAt?: string;
  isNew?: boolean;
}

interface AchievementsDisplayProps {
  achievements: Achievement[];
  unlockedAchievements: string[];
  onAchievementViewed?: (id: string) => void;
  className?: string;
}

const AchievementsDisplay: React.FC<AchievementsDisplayProps> = ({
  achievements,
  unlockedAchievements,
  onAchievementViewed,
  className
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showNewAchievement, setShowNewAchievement] = useState<Achievement | null>(null);
  const { announce } = useA11y();

  // Find new achievements that need to be displayed
  React.useEffect(() => {
    const newAchievement = achievements.find(a => a.isNew && unlockedAchievements.includes(a.id));
    if (newAchievement) {
      setShowNewAchievement(newAchievement);
      
      // Trigger confetti for new achievement
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Announce for screen readers
      announce(`New achievement unlocked: ${newAchievement.title}`, 'assertive');
    }
  }, [achievements, unlockedAchievements, announce]);

  const handleAchievementClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    
    // If this is a new achievement, mark it as viewed
    if (achievement.isNew && onAchievementViewed) {
      onAchievementViewed(achievement.id);
    }
  };

  const handleNewAchievementClose = () => {
    if (showNewAchievement && onAchievementViewed) {
      onAchievementViewed(showNewAchievement.id);
    }
    setShowNewAchievement(null);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'trophy': return Trophy;
      case 'award': return Award;
      case 'star': return Star;
      case 'zap': return Zap;
      case 'database': return Database;
      case 'brain': return Brain;
      case 'trending-up': return TrendingUp;
      case 'target': return Target;
      default: return Trophy;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'beginner': return 'neon-green';
      case 'intermediate': return 'neon-blue';
      case 'advanced': return 'neon-purple';
      case 'expert': return 'neon-pink';
      default: return 'neon-blue';
    }
  };

  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  // Calculate progress
  const totalAchievements = achievements.length;
  const unlockedCount = unlockedAchievements.length;
  const progressPercentage = totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;

  return (
    <>
      <Card className={cn("glass-effect border-white/10", className)}>
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-neon-yellow" />
              Achievements
            </h3>
            <Badge className="bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30">
              {unlockedCount}/{totalAchievements}
            </Badge>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-neon-green to-neon-yellow"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {progressPercentage.toFixed(0)}% Complete
            </p>
          </div>
        </div>
        
        <div className="p-4 max-h-[400px] overflow-y-auto">
          {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="text-sm font-medium mb-3 capitalize">
                {category} Achievements
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categoryAchievements.map(achievement => {
                  const isUnlocked = unlockedAchievements.includes(achievement.id);
                  const IconComponent = getIconComponent(achievement.icon);
                  const categoryColor = getCategoryColor(achievement.category);
                  
                  return (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                      whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
                      className={cn(
                        "relative p-3 rounded-lg cursor-pointer transition-all duration-300",
                        isUnlocked 
                          ? `bg-${categoryColor}/10 border border-${categoryColor}/30` 
                          : "bg-gray-800/30 border border-white/5 opacity-50"
                      )}
                      onClick={() => isUnlocked && handleAchievementClick(achievement)}
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                          isUnlocked ? `bg-${categoryColor}/20` : "bg-gray-700/50"
                        )}>
                          <IconComponent className={cn(
                            "w-5 h-5",
                            isUnlocked ? `text-${categoryColor}` : "text-gray-500"
                          )} />
                        </div>
                        <h5 className={cn(
                          "text-xs font-medium mb-1",
                          isUnlocked ? "text-white" : "text-gray-400"
                        )}>
                          {achievement.title}
                        </h5>
                        {achievement.isNew && isUnlocked && (
                          <Badge className="bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30 text-[10px] absolute -top-2 -right-2">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Achievement detail modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className="bg-gray-900 border border-white/10 rounded-lg max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold">Achievement Unlocked</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setSelectedAchievement(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex flex-col items-center text-center mb-6">
                  <div className={`w-20 h-20 rounded-full bg-${getCategoryColor(selectedAchievement.category)}/20 flex items-center justify-center mb-4`}>
                    {React.createElement(getIconComponent(selectedAchievement.icon), {
                      className: `w-10 h-10 text-${getCategoryColor(selectedAchievement.category)}`
                    })}
                  </div>
                  
                  <h4 className="text-lg font-bold mb-2">{selectedAchievement.title}</h4>
                  <Badge className={`bg-${getCategoryColor(selectedAchievement.category)}/20 text-${getCategoryColor(selectedAchievement.category)} border-${getCategoryColor(selectedAchievement.category)}/30 mb-4`}>
                    {selectedAchievement.category.charAt(0).toUpperCase() + selectedAchievement.category.slice(1)}
                  </Badge>
                  
                  <p className="text-gray-300">{selectedAchievement.description}</p>
                  
                  {selectedAchievement.unlockedAt && (
                    <p className="text-xs text-muted-foreground mt-4">
                      Unlocked on {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={() => setSelectedAchievement(null)}
                    className={`bg-${getCategoryColor(selectedAchievement.category)}/20 hover:bg-${getCategoryColor(selectedAchievement.category)}/30 border border-${getCategoryColor(selectedAchievement.category)}/30 text-${getCategoryColor(selectedAchievement.category)}`}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* New achievement notification */}
      <AnimatePresence>
        {showNewAchievement && (
          <motion.div
            className="fixed bottom-4 right-4 z-50"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <Card className="glass-effect border-neon-yellow/50 shadow-lg shadow-neon-yellow/20 w-80">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-neon-yellow/20 text-neon-yellow border-neon-yellow/30">
                    New Achievement
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={handleNewAchievementClose}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-${getCategoryColor(showNewAchievement.category)}/20 flex items-center justify-center flex-shrink-0`}>
                    {React.createElement(getIconComponent(showNewAchievement.icon), {
                      className: `w-6 h-6 text-${getCategoryColor(showNewAchievement.category)}`
                    })}
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-white">{showNewAchievement.title}</h4>
                    <p className="text-xs text-gray-300 line-clamp-2">{showNewAchievement.description}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-7 border-neon-yellow/30 text-neon-yellow"
                    onClick={() => {
                      handleNewAchievementClose();
                      handleAchievementClick(showNewAchievement);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AchievementsDisplay;