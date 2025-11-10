import { useState, useEffect, useCallback } from 'react';
import { YogaPose } from '../lib/yoga-poses';
import { useAuth } from '../lib/auth-context';

export interface YogaState {
  // Search and filters
  searchQuery: string;
  selectedStyleFilter: string[];
  selectedLevelFilter: string[];
  selectedPoseCategory: string[];
  selectedPoseDifficulty: string[];

  // Pose data
  poseSearchQuery: string;
  poseFavorites: string[];
  posePracticeHistory: string[];
  posePracticeDates: string[];

  // Video data
  favorites: string[];
  watchHistory: string[];
  activityDates: string[];

  // UI state
  activeTab: string;
  showBookingModal: boolean;
  showVideoPlayer: boolean;
  showPoseDetailModal: boolean;
  showAIRoutine: boolean;
  showFormAnalysis: boolean;
  showGuidedRoutine: boolean;
  showRescheduleModal: boolean;
  showAppointmentModal: boolean;

  // Selected items
  selectedTrainer: any | null;
  selectedVideo: any | null;
  selectedPose: YogaPose | null;
  selectedAppointment: any | null;

  // AI features
  aiRoutine: any;
  aiFormAnalysis: any;
  isGeneratingRoutine: boolean;

  // Timer and practice
  isPracticingPose: boolean;
  currentPosePracticeTime: number;
  posePracticeTimer: NodeJS.Timeout | null;
}

const initialState: YogaState = {
  searchQuery: '',
  selectedStyleFilter: [],
  selectedLevelFilter: [],
  selectedPoseCategory: [],
  selectedPoseDifficulty: [],
  poseSearchQuery: '',
  poseFavorites: [],
  posePracticeHistory: [],
  posePracticeDates: [],
  favorites: [],
  watchHistory: [],
  activityDates: [],
  activeTab: 'trainers',
  showBookingModal: false,
  showVideoPlayer: false,
  showPoseDetailModal: false,
  showAIRoutine: false,
  showFormAnalysis: false,
  showGuidedRoutine: false,
  showRescheduleModal: false,
  showAppointmentModal: false,
  selectedTrainer: null,
  selectedVideo: null,
  selectedPose: null,
  selectedAppointment: null,
  aiRoutine: null,
  aiFormAnalysis: null,
  isGeneratingRoutine: false,
  isPracticingPose: false,
  currentPosePracticeTime: 0,
  posePracticeTimer: null,
};

export const useYogaState = () => {
  const [state, setState] = useState<YogaState>(initialState);
  const { user } = useAuth();

  // Load data from localStorage on mount
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const storedData = {
          poseFavorites: localStorage.getItem('yoga-pose-favorites'),
          posePracticeHistory: localStorage.getItem('yoga-pose-practice-history'),
          posePracticeDates: localStorage.getItem('yoga-pose-practice-dates'),
          favorites: localStorage.getItem('yoga-favorites'),
          watchHistory: localStorage.getItem('yoga-watch-history'),
          activityDates: localStorage.getItem('yoga-activity-dates'),
        };

        setState(prev => ({
          ...prev,
          poseFavorites: storedData.poseFavorites ? JSON.parse(storedData.poseFavorites) : [],
          posePracticeHistory: storedData.posePracticeHistory ? JSON.parse(storedData.posePracticeHistory) : [],
          posePracticeDates: storedData.posePracticeDates ? JSON.parse(storedData.posePracticeDates) : [],
          favorites: storedData.favorites ? JSON.parse(storedData.favorites) : [],
          watchHistory: storedData.watchHistory ? JSON.parse(storedData.watchHistory) : [],
          activityDates: storedData.activityDates ? JSON.parse(storedData.activityDates) : [],
        }));
      } catch (error) {
        console.error('Error loading yoga state from localStorage:', error);
      }
    };

    loadStoredData();
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('yoga-pose-favorites', JSON.stringify(state.poseFavorites));
  }, [state.poseFavorites]);

  useEffect(() => {
    localStorage.setItem('yoga-pose-practice-history', JSON.stringify(state.posePracticeHistory));
  }, [state.posePracticeHistory]);

  useEffect(() => {
    localStorage.setItem('yoga-pose-practice-dates', JSON.stringify(state.posePracticeDates));
  }, [state.posePracticeDates]);

  useEffect(() => {
    localStorage.setItem('yoga-favorites', JSON.stringify(state.favorites));
  }, [state.favorites]);

  useEffect(() => {
    localStorage.setItem('yoga-watch-history', JSON.stringify(state.watchHistory));
  }, [state.watchHistory]);

  useEffect(() => {
    localStorage.setItem('yoga-activity-dates', JSON.stringify(state.activityDates));
  }, [state.activityDates]);

  // Actions
  const updateState = useCallback((updates: Partial<YogaState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      favorites: prev.favorites.includes(id)
        ? prev.favorites.filter(fav => fav !== id)
        : [...prev.favorites, id]
    }));
  }, []);

  const togglePoseFavorite = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      poseFavorites: prev.poseFavorites.includes(id)
        ? prev.poseFavorites.filter(fav => fav !== id)
        : [...prev.poseFavorites, id]
    }));
  }, []);

  const addToWatchHistory = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      watchHistory: prev.watchHistory.includes(id) ? prev.watchHistory : [...prev.watchHistory, id]
    }));
  }, []);

  const addToActivityDates = useCallback((date: string) => {
    setState(prev => ({
      ...prev,
      activityDates: prev.activityDates.includes(date) ? prev.activityDates : [...prev.activityDates, date]
    }));
  }, []);

  const addToPosePracticeHistory = useCallback((poseId: string) => {
    setState(prev => ({
      ...prev,
      posePracticeHistory: prev.posePracticeHistory.includes(poseId)
        ? prev.posePracticeHistory
        : [...prev.posePracticeHistory, poseId]
    }));
  }, []);

  const addToPosePracticeDates = useCallback((date: string) => {
    setState(prev => ({
      ...prev,
      activityDates: prev.activityDates.includes(date) ? prev.activityDates : [...prev.activityDates, date]
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      selectedStyleFilter: [],
      selectedLevelFilter: [],
      selectedPoseCategory: [],
      selectedPoseDifficulty: [],
      poseSearchQuery: '',
    }));
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (state.posePracticeTimer) {
        clearInterval(state.posePracticeTimer);
      }
    };
  }, [state.posePracticeTimer]);

  return {
    state,
    updateState,
    toggleFavorite,
    togglePoseFavorite,
    addToWatchHistory,
    addToActivityDates,
    addToPosePracticeHistory,
    addToPosePracticeDates,
    resetFilters,
  };
};
