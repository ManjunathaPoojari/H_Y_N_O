import { useState, useCallback } from 'react';
import { YogaPose } from '../types/yoga';
import { HealthProfile } from '../types/health-yoga';

export interface YogaSession {
  id: string;
  poses: YogaPose[];
  currentPoseIndex: number;
  isActive: boolean;
  isPaused: boolean;
  startTime: Date | null;
  endTime: Date | null;
  duration: number; // in seconds
  completedPoses: number;
}

export interface YogaSessionState {
  session: YogaSession | null;
  isLoading: boolean;
  error: string | null;
}

export const useYogaState = () => {
  const [state, setState] = useState<YogaSessionState>({
    session: null,
    isLoading: false,
    error: null,
  });

  const startSession = useCallback((poses: YogaPose[], duration: number = 20 * 60) => {
    const session: YogaSession = {
      id: `session-${Date.now()}`,
      poses,
      currentPoseIndex: 0,
      isActive: true,
      isPaused: false,
      startTime: new Date(),
      endTime: null,
      duration,
      completedPoses: 0,
    };

    setState(prev => ({
      ...prev,
      session,
      error: null,
    }));
  }, []);

  const nextPose = useCallback(() => {
    setState(prev => {
      if (!prev.session) return prev;

      const nextIndex = prev.session.currentPoseIndex + 1;
      const isComplete = nextIndex >= prev.session.poses.length;

      return {
        ...prev,
        session: {
          ...prev.session,
          currentPoseIndex: isComplete ? prev.session.currentPoseIndex : nextIndex,
          completedPoses: isComplete ? prev.session.completedPoses : nextIndex,
          isActive: !isComplete,
        },
      };
    });
  }, []);

  const previousPose = useCallback(() => {
    setState(prev => {
      if (!prev.session || prev.session.currentPoseIndex === 0) return prev;

      return {
        ...prev,
        session: {
          ...prev.session,
          currentPoseIndex: prev.session.currentPoseIndex - 1,
        },
      };
    });
  }, []);

  const pauseSession = useCallback(() => {
    setState(prev => {
      if (!prev.session) return prev;

      return {
        ...prev,
        session: {
          ...prev.session,
          isPaused: true,
        },
      };
    });
  }, []);

  const resumeSession = useCallback(() => {
    setState(prev => {
      if (!prev.session) return prev;

      return {
        ...prev,
        session: {
          ...prev.session,
          isPaused: false,
        },
      };
    });
  }, []);

  const endSession = useCallback(() => {
    setState(prev => {
      if (!prev.session) return prev;

      return {
        ...prev,
        session: {
          ...prev.session,
          isActive: false,
          isPaused: false,
          endTime: new Date(),
        },
      };
    });
  }, []);

  const resetSession = useCallback(() => {
    setState(prev => ({
      ...prev,
      session: null,
      error: null,
    }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      error,
      isLoading: false,
    }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({
      ...prev,
      isLoading,
    }));
  }, []);

  return {
    ...state,
    startSession,
    nextPose,
    previousPose,
    pauseSession,
    resumeSession,
    endSession,
    resetSession,
    setError,
    setLoading,
  };
};
