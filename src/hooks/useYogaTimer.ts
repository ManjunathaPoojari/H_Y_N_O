import { useState, useEffect, useCallback, useRef } from 'react';

export interface YogaTimerState {
  currentPoseTimeLeft: number;
  isPaused: boolean;
  isActive: boolean;
  completedPoses: string[];
  currentStep: number;
  routineStartTime: Date | null;
}

export const useYogaTimer = () => {
  const [timerState, setTimerState] = useState<YogaTimerState>({
    currentPoseTimeLeft: 0,
    isPaused: false,
    isActive: false,
    completedPoses: [],
    currentStep: 0,
    routineStartTime: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = useCallback((duration: number, onTick?: () => void, onComplete?: () => void) => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    setTimerState(prev => ({
      ...prev,
      currentPoseTimeLeft: duration,
      isActive: true,
      isPaused: false,
    }));

    const timer = setInterval(() => {
      setTimerState(prev => {
        if (prev.isPaused) return prev;

        const newTime = prev.currentPoseTimeLeft - 1;

        if (newTime <= 0) {
          clearInterval(timer);
          onComplete?.();
          return {
            ...prev,
            currentPoseTimeLeft: 0,
            isActive: false,
          };
        }

        onTick?.();
        return {
          ...prev,
          currentPoseTimeLeft: newTime,
        };
      });
    }, 1000);

    timerRef.current = timer;
  }, []);

  const pauseTimer = useCallback(() => {
    setTimerState(prev => ({ ...prev, isPaused: true }));
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resumeTimer = useCallback((onTick?: () => void, onComplete?: () => void) => {
    if (!timerState.isActive) return;

    setTimerState(prev => ({ ...prev, isPaused: false }));

    const timer = setInterval(() => {
      setTimerState(prev => {
        const newTime = prev.currentPoseTimeLeft - 1;

        if (newTime <= 0) {
          clearInterval(timer);
          onComplete?.();
          return {
            ...prev,
            currentPoseTimeLeft: 0,
            isActive: false,
          };
        }

        onTick?.();
        return {
          ...prev,
          currentPoseTimeLeft: newTime,
        };
      });
    }, 1000);

    timerRef.current = timer;
  }, [timerState.isActive]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setTimerState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
      currentPoseTimeLeft: 0,
    }));
  }, []);

  const resetTimer = useCallback(() => {
    stopTimer();
    setTimerState(prev => ({
      ...prev,
      completedPoses: [],
      currentStep: 0,
      routineStartTime: null,
    }));
  }, [stopTimer]);

  const nextStep = useCallback((poseName?: string) => {
    setTimerState(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      completedPoses: poseName ? [...prev.completedPoses, poseName] : prev.completedPoses,
    }));
  }, []);

  const previousStep = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      currentStep: Math.max(0, prev.currentStep - 1),
    }));
  }, []);

  const startRoutine = useCallback((startTime: Date = new Date()) => {
    setTimerState(prev => ({
      ...prev,
      routineStartTime: startTime,
      currentStep: 0,
      completedPoses: [],
      isActive: false,
      isPaused: false,
    }));
  }, []);

  const completeRoutine = useCallback(() => {
    stopTimer();
    setTimerState(prev => ({
      ...prev,
      isActive: false,
      isPaused: false,
    }));
  }, [stopTimer]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getProgress = useCallback((totalSteps: number) => {
    if (totalSteps === 0) return 0;
    return ((timerState.currentStep + (timerState.completedPoses.length > 0 ? 1 : 0)) / totalSteps) * 100;
  }, [timerState.currentStep, timerState.completedPoses.length]);

  return {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    nextStep,
    previousStep,
    startRoutine,
    completeRoutine,
    formatTime,
    getProgress,
  };
};
