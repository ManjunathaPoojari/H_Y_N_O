import { useState, useEffect, useCallback } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number;
  target: number;
  category: 'practice' | 'social' | 'learning' | 'streak';
}

export interface ProgressStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  favoritePose: string;
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyGoal: number;
  monthlyProgress: number;
  achievements: Achievement[];
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-session',
    title: 'First Steps',
    description: 'Complete your first yoga session',
    icon: '🎯',
    unlocked: false,
    progress: 0,
    target: 1,
    category: 'practice',
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Practice yoga 7 days in a row',
    icon: '🔥',
    unlocked: false,
    progress: 0,
    target: 7,
    category: 'streak',
  },
  {
    id: 'pose-explorer',
    title: 'Pose Explorer',
    description: 'Try 10 different yoga poses',
    icon: '🧭',
    unlocked: false,
    progress: 0,
    target: 10,
    category: 'learning',
  },
  {
    id: 'video-enthusiast',
    title: 'Video Enthusiast',
    description: 'Watch 20 yoga videos',
    icon: '📹',
    unlocked: false,
    progress: 0,
    target: 20,
    category: 'learning',
  },
  {
    id: 'social-butterfly',
    title: 'Social Butterfly',
    description: 'Share 5 yoga achievements',
    icon: '🦋',
    unlocked: false,
    progress: 0,
    target: 5,
    category: 'social',
  },
  {
    id: 'dedication-master',
    title: 'Dedication Master',
    description: 'Practice for 100 hours total',
    icon: '👑',
    unlocked: false,
    progress: 0,
    target: 6000, // 100 hours in minutes
    category: 'practice',
  },
];

export const useProgress = () => {
  const [stats, setStats] = useState<ProgressStats>({
    totalSessions: 0,
    totalMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoritePose: '',
    weeklyGoal: 3,
    weeklyProgress: 0,
    monthlyGoal: 12,
    monthlyProgress: 0,
    achievements: defaultAchievements,
  });

  // Load progress data from localStorage
  useEffect(() => {
    const loadProgress = () => {
      try {
        const savedStats = localStorage.getItem('yoga-progress-stats');
        if (savedStats) {
          const parsedStats = JSON.parse(savedStats);
          // Convert date strings back to Date objects
          parsedStats.achievements = parsedStats.achievements.map((achievement: any) => ({
            ...achievement,
            unlockedAt: achievement.unlockedAt ? new Date(achievement.unlockedAt) : undefined,
          }));
          setStats(parsedStats);
        }
      } catch (error) {
        console.error('Error loading progress stats:', error);
      }
    };

    loadProgress();
  }, []);

  // Save progress data to localStorage
  useEffect(() => {
    localStorage.setItem('yoga-progress-stats', JSON.stringify(stats));
  }, [stats]);

  const updateSession = useCallback((duration: number, posesPracticed: string[] = []) => {
    setStats(prev => {
      const newTotalSessions = prev.totalSessions + 1;
      const newTotalMinutes = prev.totalMinutes + duration;

      // Update achievements
      const updatedAchievements = prev.achievements.map(achievement => {
        let newProgress = achievement.progress;

        switch (achievement.id) {
          case 'first-session':
            newProgress = Math.min(newTotalSessions, achievement.target);
            break;
          case 'dedication-master':
            newProgress = Math.min(newTotalMinutes, achievement.target);
            break;
          case 'pose-explorer':
            newProgress = Math.min(
              new Set([...prev.achievements.find(a => a.id === 'pose-explorer')?.progress || 0, ...posesPracticed]).size,
              achievement.target
            );
            break;
        }

        const wasUnlocked = achievement.unlocked;
        const nowUnlocked = newProgress >= achievement.target;

        return {
          ...achievement,
          progress: newProgress,
          unlocked: nowUnlocked,
          unlockedAt: nowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt,
        };
      });

      return {
        ...prev,
        totalSessions: newTotalSessions,
        totalMinutes: newTotalMinutes,
        achievements: updatedAchievements,
      };
    });
  }, []);

  const updateStreak = useCallback((activityDates: string[]) => {
    // Calculate current streak
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    let currentStreak = 0;
    let longestStreak = stats.longestStreak;

    // Check if practiced today or yesterday
    const hasPracticedToday = activityDates.includes(today);
    const hasPracticedYesterday = activityDates.includes(yesterday);

    if (hasPracticedToday) {
      // Count consecutive days backwards from today
      let checkDate = new Date(today);
      while (activityDates.includes(checkDate.toDateString())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else if (hasPracticedYesterday) {
      // Count consecutive days backwards from yesterday
      let checkDate = new Date(yesterday);
      while (activityDates.includes(checkDate.toDateString())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    longestStreak = Math.max(longestStreak, currentStreak);

    setStats(prev => ({
      ...prev,
      currentStreak,
      longestStreak,
    }));

    // Update streak achievement
    setStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => {
        if (achievement.id === 'week-warrior') {
          const newProgress = Math.min(currentStreak, achievement.target);
          const wasUnlocked = achievement.unlocked;
          const nowUnlocked = newProgress >= achievement.target;

          return {
            ...achievement,
            progress: newProgress,
            unlocked: nowUnlocked,
            unlockedAt: nowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt,
          };
        }
        return achievement;
      }),
    }));
  }, [stats.longestStreak]);

  const updateVideoProgress = useCallback((videosWatched: number) => {
    setStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => {
        if (achievement.id === 'video-enthusiast') {
          const newProgress = Math.min(videosWatched, achievement.target);
          const wasUnlocked = achievement.unlocked;
          const nowUnlocked = newProgress >= achievement.target;

          return {
            ...achievement,
            progress: newProgress,
            unlocked: nowUnlocked,
            unlockedAt: nowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt,
          };
        }
        return achievement;
      }),
    }));
  }, []);

  const updateWeeklyProgress = useCallback(() => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    // This would need activity dates to calculate properly
    // For now, just increment weekly progress
    setStats(prev => ({
      ...prev,
      weeklyProgress: Math.min(prev.weeklyProgress + 1, prev.weeklyGoal),
    }));
  }, []);

  const updateMonthlyProgress = useCallback(() => {
    setStats(prev => ({
      ...prev,
      monthlyProgress: Math.min(prev.monthlyProgress + 1, prev.monthlyGoal),
    }));
  }, []);

  const shareAchievement = useCallback((achievementId: string) => {
    setStats(prev => ({
      ...prev,
      achievements: prev.achievements.map(achievement => {
        if (achievement.id === 'social-butterfly' && achievementId !== 'social-butterfly') {
          const newProgress = Math.min(achievement.progress + 1, achievement.target);
          const wasUnlocked = achievement.unlocked;
          const nowUnlocked = newProgress >= achievement.target;

          return {
            ...achievement,
            progress: newProgress,
            unlocked: nowUnlocked,
            unlockedAt: nowUnlocked && !wasUnlocked ? new Date() : achievement.unlockedAt,
          };
        }
        return achievement;
      }),
    }));
  }, []);

  const resetProgress = useCallback(() => {
    setStats({
      totalSessions: 0,
      totalMinutes: 0,
      currentStreak: 0,
      longestStreak: 0,
      favoritePose: '',
      weeklyGoal: 3,
      weeklyProgress: 0,
      monthlyGoal: 12,
      monthlyProgress: 0,
      achievements: defaultAchievements,
    });
  }, []);

  const getAchievementProgress = useCallback((category?: string) => {
    const filteredAchievements = category
      ? stats.achievements.filter(a => a.category === category)
      : stats.achievements;

    return {
      total: filteredAchievements.length,
      unlocked: filteredAchievements.filter(a => a.unlocked).length,
      inProgress: filteredAchievements.filter(a => !a.unlocked && a.progress > 0).length,
      notStarted: filteredAchievements.filter(a => a.progress === 0).length,
    };
  }, [stats.achievements]);

  return {
    stats,
    updateSession,
    updateStreak,
    updateVideoProgress,
    updateWeeklyProgress,
    updateMonthlyProgress,
    shareAchievement,
    resetProgress,
    getAchievementProgress,
  };
};
