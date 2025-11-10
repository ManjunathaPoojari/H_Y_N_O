// Yoga-specific types for HYNO Management System

export interface YogaTrainer {
  id: string;
  name: string;
  specialty: string[];
  experience: number;
  rating: number;
  reviews: number;
  location: string;
  availability: 'available' | 'busy' | 'offline';
  modes: ('virtual' | 'in-person')[];
  qualifications: string[];
  languages: string[];
  pricePerSession: number;
  bio: string;
  image: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface YogaVideo {
  id: string;
  title: string;
  trainer: string;
  trainerId: string;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  style: string;
  views: number;
  rating: number;
  thumbnail: string;
  description: string;
  benefits: string[];
  videoUrl: string; // YouTube video URL
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface YogaAppointment {
  id: string;
  trainerId: string;
  trainerName: string;
  patientId: string;
  date: string;
  time: string;
  mode: 'virtual' | 'in-person';
  status: 'upcoming' | 'completed' | 'cancelled' | 'in-progress';
  price: number;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface YogaProgress {
  id: string;
  patientId: string;
  sessionsCompleted: number;
  totalMinutesPracticed: number;
  favoriteStyles: string[];
  currentStreak: number;
  longestStreak: number;
  achievements: string[];
  lastPracticeDate?: string;
  goals: {
    weeklySessions: number;
    totalMinutes: number;
    styles: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface YogaRoutine {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  poses: YogaPose[];
  benefits: string[];
  tips: string[];
  isAIGenerated: boolean;
  patientId?: string;
  createdAt: string;
}

export interface YogaPose {
  id: string;
  name: string;
  sanskritName?: string;
  duration: number; // in seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  focus: string;
  instructions: string[];
  benefits: string[];
  imageUrl?: string;
  videoUrl?: string;
}

export interface YogaFormAnalysis {
  id: string;
  patientId: string;
  poseName: string;
  score: number; // 0-100
  feedback: string[];
  improvements: string[];
  timestamp: string;
}

export interface YogaNotification {
  id: string;
  patientId: string;
  type: 'appointment_reminder' | 'session_complete' | 'new_video' | 'progress_update' | 'achievement';
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

export interface YogaStats {
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  favoriteStyle: string;
  averageRating: number;
  completedGoals: number;
  achievements: number;
}
