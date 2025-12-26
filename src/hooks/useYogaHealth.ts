import { useState, useEffect, useCallback } from 'react';
import {
  HealthProfile,
  YogaSession,
  VitalSigns,
  SafetyRisk,
  HealthCondition,
  YogaGoal,
  YogaSequence,
  PoseProgress,
  PainReport,
  EmergencyAction
} from '../types/health-yoga';
import { MedicalYogaFilter } from '../lib/health-yoga-fixed';

interface YogaHealthState {
  session: YogaSession | null;
  isActive: boolean;
  vitalSigns: VitalSigns[];
  safetyWarnings: string[];
  painReports: PainReport[];
  emergencyActions: EmergencyAction[];
}

interface YogaHealthActions {
  startSession: (profile: HealthProfile, sequence: YogaSequence) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  emergencyStop: (reason: string) => void;
  updateVitalSigns: (vitalSigns: Partial<VitalSigns>) => void;
  reportPain: (level: number, location?: string, description?: string) => void;
  completePose: (poseId: string, duration: number, painLevel?: number, notes?: string) => void;
}

export const useYogaHealth = (): [YogaHealthState, YogaHealthActions] => {
  const [state, setState] = useState<YogaHealthState>({
    session: null,
    isActive: false,
    vitalSigns: [],
    safetyWarnings: [],
    painReports: [],
    emergencyActions: []
  });

  // Safety monitoring effect
  useEffect(() => {
    if (!state.session || !state.isActive) return;

    const safetyCheck = MedicalYogaFilter.validateSessionSafety(
      {
        heartRate: state.vitalSigns[state.vitalSigns.length - 1]?.heartRate,
        bloodPressure: state.vitalSigns[state.vitalSigns.length - 1]?.bloodPressure,
        painLevel: state.painReports[state.painReports.length - 1]?.level
      },
      state.session.sequence.contraindications
    );

    if (!safetyCheck.canContinue) {
      // Auto-emergency stop
      emergencyStop('Automatic safety stop: ' + safetyCheck.stopReasons.join(', '));
    } else if (safetyCheck.warnings.length > 0) {
      setState(prev => ({
        ...prev,
        safetyWarnings: [...prev.safetyWarnings, ...safetyCheck.warnings]
      }));
    }
  }, [state.session, state.isActive, state.vitalSigns, state.painReports]);

  const startSession = useCallback((profile: HealthProfile, sequence: YogaSequence) => {
    const newSession: YogaSession = {
      id: `session-${Date.now()}`,
      patientId: profile.patientId,
      planId: `plan-${Date.now()}`,
      sequence,
      startTime: new Date(),
      status: 'in-progress',
      currentPoseIndex: 0,
      poseProgress: [],
      vitalSigns: [],
      painLevels: [],
      modifications: [],
      completion: {
        totalDuration: 0,
        posesCompleted: 0,
        safetyIncidents: 0,
        patientFeedback: undefined
      }
    };

    setState({
      session: newSession,
      isActive: true,
      vitalSigns: [],
      safetyWarnings: [],
      painReports: [],
      emergencyActions: []
    });
  }, []);

  const pauseSession = useCallback(() => {
    if (!state.session) return;

    setState(prev => ({
      ...prev,
      session: prev.session ? {
        ...prev.session,
        status: 'paused'
      } : null,
      isActive: false
    }));
  }, [state.session]);

  const resumeSession = useCallback(() => {
    if (!state.session) return;

    setState(prev => ({
      ...prev,
      session: prev.session ? {
        ...prev.session,
        status: 'in-progress'
      } : null,
      isActive: true
    }));
  }, [state.session]);

  const stopSession = useCallback(() => {
    if (!state.session) return;

    const endTime = new Date();
    const totalDuration = Math.floor((endTime.getTime() - state.session.startTime.getTime()) / 1000);

    setState(prev => ({
      ...prev,
      session: prev.session ? {
        ...prev.session,
        endTime,
        status: 'completed',
        completion: {
          ...prev.session.completion,
          totalDuration
        }
      } : null,
      isActive: false
    }));
  }, [state.session]);

  const emergencyStop = useCallback((reason: string) => {
    if (!state.session) return;

    const emergencyAction: EmergencyAction = {
      timestamp: new Date(),
      type: 'emergency-call',
      reason,
      vitalSigns: state.vitalSigns[state.vitalSigns.length - 1]
    };

    setState(prev => ({
      ...prev,
      session: prev.session ? {
        ...prev.session,
        status: 'emergency-stopped',
        endTime: new Date(),
        emergencyActions: [...(prev.session.emergencyActions || []), emergencyAction]
      } : null,
      isActive: false,
      emergencyActions: [...prev.emergencyActions, emergencyAction]
    }));
  }, [state.session, state.vitalSigns]);

  const updateVitalSigns = useCallback((vitalSigns: Partial<VitalSigns>) => {
    const newVitalSigns: VitalSigns = {
      timestamp: new Date(),
      ...vitalSigns
    };

    setState(prev => ({
      ...prev,
      vitalSigns: [...prev.vitalSigns, newVitalSigns]
    }));
  }, []);

  const reportPain = useCallback((level: number, location?: string, description?: string) => {
    const painReport: PainReport = {
      timestamp: new Date(),
      level,
      location,
      description
    };

    setState(prev => ({
      ...prev,
      painReports: [...prev.painReports, painReport]
    }));
  }, []);

  const completePose = useCallback((poseId: string, duration: number, painLevel?: number, notes?: string) => {
    if (!state.session) return;

    const poseProgress: PoseProgress = {
      poseId,
      startTime: new Date(Date.now() - duration * 1000),
      endTime: new Date(),
      duration,
      completed: true,
      painLevel,
      notes
    };

    setState(prev => ({
      ...prev,
      session: prev.session ? {
        ...prev.session,
        currentPoseIndex: prev.session.currentPoseIndex + 1,
        poseProgress: [...prev.session.poseProgress, poseProgress],
        completion: {
          ...prev.session.completion,
          posesCompleted: prev.session.completion.posesCompleted + 1
        }
      } : null
    }));
  }, [state.session]);

  const actions: YogaHealthActions = {
    startSession,
    pauseSession,
    resumeSession,
    stopSession,
    emergencyStop,
    updateVitalSigns,
    reportPain,
    completePose
  };

  return [state, actions];
};
