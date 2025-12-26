// Medical Yoga Module Types for Digital Health Platform
// Focus: Safety, personalization, and clinical credibility

export type HealthCondition =
  | 'arthritis'
  | 'back-pain'
  | 'acute-back-pain'
  | 'severe-back-pain'
  | 'hypertension'
  | 'diabetes'
  | 'pregnancy'
  | 'post-surgery'
  | 'heart-condition'
  | 'osteoporosis'
  | 'fibromyalgia'
  | 'chronic-fatigue'
  | 'depression'
  | 'anxiety'
  | 'insomnia'
  | 'migraine'
  | 'other';

export type YogaGoal =
  | 'pain-management'
  | 'improved-mobility'
  | 'better-sleep'
  | 'stress-reduction'
  | 'weight-management'
  | 'cardiovascular-health'
  | 'mental-clarity'
  | 'energy-boost'
  | 'balance-improvement'
  | 'posture-correction';

export type FitnessLevel = 'sedentary' | 'light-activity' | 'moderate-activity' | 'active';

export type SafetyRisk = 'low' | 'moderate' | 'high' | 'contraindicated';

export type SessionStatus = 'not-started' | 'in-progress' | 'completed' | 'paused' | 'emergency-stopped';

export interface HealthProfile {
  id: string;
  patientId: string;
  conditions: HealthCondition[];
  customConditions?: string[];
  fitnessLevel: FitnessLevel;
  goals: YogaGoal[];
  medications?: string[];
  allergies?: string[];
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
  providerApproval?: {
    approvedBy: string;
    approvedAt: Date;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface YogaPose {
  id: string;
  name: string;
  sanskritName?: string;
  category: 'standing' | 'seated' | 'supine' | 'prone' | 'inversion' | 'arm-balance';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // seconds to hold
  benefits: string[];
  precautions: string[];
  modifications: PoseModification[];
  contraindications: HealthCondition[];
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
  emoji?: string;
  description?: string;
}

export interface PoseModification {
  id: string;
  condition: HealthCondition;
  modification: string;
  riskReduction: SafetyRisk;
  alternativePose?: string;
}

export interface YogaSequence {
  id: string;
  name: string;
  description: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: YogaGoal;
  poses: SequencePose[];
  warmUp?: YogaPose[];
  coolDown?: YogaPose[];
  contraindications: HealthCondition[];
  benefits: string[];
  medicalNotes?: string;
}

export interface SequencePose {
  pose: YogaPose;
  duration: number; // seconds
  modifications?: PoseModification[];
  restBetween?: number; // seconds
}

export interface PersonalizedPlan {
  id: string;
  patientId: string;
  healthProfile: HealthProfile;
  weeklySchedule: DailyPlan[];
  intensity: 'low-impact' | 'moderate' | 'standard';
  duration: number; // minutes per session
  frequency: number; // sessions per week
  currentWeek: number;
  progressGoals: ProgressGoal[];
  safetyRules: SafetyRule[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DailyPlan {
  day: number; // 1-7 (Monday = 1)
  sequence: YogaSequence;
  completed: boolean;
  completedAt?: Date;
  modifications?: SessionModification[];
  notes?: string;
}

export interface SessionModification {
  poseId: string;
  modification: string;
  reason: string;
  timestamp: Date;
}

export interface YogaSession {
  id: string;
  patientId: string;
  planId: string;
  sequence: YogaSequence;
  startTime: Date;
  endTime?: Date;
  status: SessionStatus;
  currentPoseIndex: number;
  poseProgress: PoseProgress[];
  vitalSigns?: VitalSigns[];
  painLevels: PainReport[];
  modifications: SessionModification[];
  emergencyActions?: EmergencyAction[];
  completion: {
    totalDuration: number;
    posesCompleted: number;
    safetyIncidents: number;
    patientFeedback?: string;
  };
}

export interface PoseProgress {
  poseId: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  completed: boolean;
  painLevel?: number; // 1-10
  notes?: string;
}

export interface VitalSigns {
  timestamp: Date;
  heartRate?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  oxygenSaturation?: number;
  notes?: string;
}

export interface PainReport {
  timestamp: Date;
  level: number; // 1-10
  location?: string;
  description?: string;
}

export interface EmergencyAction {
  timestamp: Date;
  type: 'pause' | 'stop' | 'emergency-call' | 'provider-alert';
  reason: string;
  vitalSigns?: VitalSigns;
  notes?: string;
}

export interface ProgressGoal {
  id: string;
  type: 'pain-reduction' | 'mobility-improvement' | 'sleep-quality' | 'stress-level' | 'streak-maintenance';
  target: number;
  current: number;
  unit: string;
  timeframe: number; // days
  achieved: boolean;
  achievedAt?: Date;
}

export interface SafetyRule {
  id: string;
  condition: HealthCondition;
  rule: string;
  severity: SafetyRisk;
  action: 'skip-pose' | 'modify-pose' | 'stop-session' | 'consult-provider';
  enabled: boolean;
}

export interface ProgressMetrics {
  patientId: string;
  period: {
    start: Date;
    end: Date;
  };
  sessions: {
    total: number;
    completed: number;
    averageDuration: number;
    streak: number;
  };
  health: {
    averagePainLevel: number;
    painReduction: number;
    mobilityScore: number;
    sleepQuality: number;
    stressLevel: number;
  };
  safety: {
    incidents: number;
    emergencyStops: number;
    modificationsUsed: number;
  };
  goals: ProgressGoal[];
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  providerId: string;
  sessionId?: string;
  type: 'assessment' | 'progress' | 'concern' | 'recommendation';
  content: string;
  metrics?: Partial<ProgressMetrics>;
  recommendations?: string[];
  followUpDate?: Date;
  createdAt: Date;
}

// API Request/Response Types
export interface HealthAssessmentRequest {
  conditions: HealthCondition[];
  customConditions?: string[];
  fitnessLevel: FitnessLevel;
  goals: YogaGoal[];
  medications?: string[];
  allergies?: string[];
  emergencyContact?: HealthProfile['emergencyContact'];
}

export interface PlanGenerationRequest {
  healthProfile: HealthAssessmentRequest;
  preferences: {
    duration: number;
    intensity: 'low-impact' | 'moderate' | 'standard';
    frequency: number;
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
  };
}

export interface SessionUpdateRequest {
  sessionId: string;
  action: 'start' | 'pause' | 'resume' | 'stop' | 'emergency-stop';
  currentPoseIndex?: number;
  vitalSigns?: VitalSigns;
  painLevel?: number;
  notes?: string;
}

// Filter and Search Types
export interface YogaFilter {
  conditions?: HealthCondition[];
  goals?: YogaGoal[];
  difficulty?: string[];
  duration?: { min: number; max: number };
  category?: string[];
  safety?: SafetyRisk[];
}

export interface PoseSearchResult {
  pose: YogaPose;
  safety: SafetyRisk;
  modifications: PoseModification[];
  reasons: string[];
}

// Constants for medical yoga
export const HEALTH_CONDITIONS: Record<HealthCondition, { name: string; description: string }> = {
  'arthritis': { name: 'Arthritis', description: 'Joint inflammation and pain' },
  'back-pain': { name: 'Back Pain', description: 'Chronic or acute back discomfort' },
  'acute-back-pain': { name: 'Acute Back Pain', description: 'Recent onset of severe back pain' },
  'severe-back-pain': { name: 'Severe Back Pain', description: 'Intense, debilitating back pain' },
  'hypertension': { name: 'Hypertension', description: 'High blood pressure' },
  'diabetes': { name: 'Diabetes', description: 'Blood sugar management' },
  'pregnancy': { name: 'Pregnancy', description: 'Prenatal and postnatal care' },
  'post-surgery': { name: 'Post-Surgery Recovery', description: 'Recovery from surgical procedures' },
  'heart-condition': { name: 'Heart Condition', description: 'Cardiovascular health concerns' },
  'osteoporosis': { name: 'Osteoporosis', description: 'Bone density concerns' },
  'fibromyalgia': { name: 'Fibromyalgia', description: 'Chronic pain and fatigue' },
  'chronic-fatigue': { name: 'Chronic Fatigue', description: 'Persistent fatigue syndrome' },
  'depression': { name: 'Depression', description: 'Mental health support' },
  'anxiety': { name: 'Anxiety', description: 'Anxiety management' },
  'insomnia': { name: 'Insomnia', description: 'Sleep difficulties' },
  'migraine': { name: 'Migraine', description: 'Headache management' },
  'other': { name: 'Other Condition', description: 'Custom health condition' }
};

export const YOGA_GOALS: Record<YogaGoal, { name: string; description: string }> = {
  'pain-management': { name: 'Pain Management', description: 'Reduce chronic pain levels' },
  'improved-mobility': { name: 'Improved Mobility', description: 'Increase range of motion' },
  'better-sleep': { name: 'Better Sleep', description: 'Improve sleep quality' },
  'stress-reduction': { name: 'Stress Reduction', description: 'Lower stress and anxiety' },
  'weight-management': { name: 'Weight Management', description: 'Support healthy weight goals' },
  'cardiovascular-health': { name: 'Cardiovascular Health', description: 'Heart health improvement' },
  'mental-clarity': { name: 'Mental Clarity', description: 'Cognitive function enhancement' },
  'energy-boost': { name: 'Energy Boost', description: 'Increase daily energy levels' },
  'balance-improvement': { name: 'Balance Improvement', description: 'Enhance stability and coordination' },
  'posture-correction': { name: 'Posture Correction', description: 'Improve alignment and posture' }
};
