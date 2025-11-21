// Core Types for HYNO Management System

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  dateOfBirth?: string;
  allergies?: string[];
  medicalHistory?: string[];
  currentMedications?: string[];
  address?: string;
  emergencyContact?: string;
  notes?: string;
  createdAt: string;
  hospitalId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  experience: number;
  rating: number;
  available: boolean;
  hospital?: Hospital;
  hospitalId?: string;
  consultationFee: number;
  avatarUrl?: string;
  status: 'approved' | 'pending' | 'suspended';
  password?: string;
  address?: string;
  bio?: string;
}

export interface Hospital {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  totalDoctors: number;
  facilities: string[];
  status: 'approved' | 'pending' | 'rejected';
  registrationNumber: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId?: string;
  doctorName: string;
  hospitalId?: string;
  type: 'video' | 'chat' | 'inperson' | 'hospital';
  date: string;
  time: string;
  status: 'pending' | 'booked' | 'completed' | 'cancelled';
  reason?: string;
  prescription?: string;
  notes?: string;
}

export interface Medicine {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  manufacturer: string;
  requiresPrescription: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medicines: {
    medicineId: string;
    medicineName: string;
    dosage: string;
    duration: string;
    instructions: string;
  }[];
  date: string;
  diagnosis: string;
}

export interface NutritionPlan {
  id: string;
  patientId: string;
  bmi: number;
  calories: number;
  meals: Meal[];
  waterIntake: number;
  dietaryRestrictions: string[];
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  ingredients: string[];
  recipe: string;
  diseaseCategory?: string[];
  image?: string;
}



export interface Trainer {
  id: string;
  name: string;
  email: string;
  phone: string;
  trainerType: string;
  experienceYears: number;
  location: string;
  pricePerSession: number;
  bio?: string;
  specialties: string[];
  qualifications: string[];
  languages: string[];
  modes: string[];
  status: 'approved' | 'pending' | 'rejected';
  rating: number;
  reviews: number;
  profileImage?: string;
  createdAt?: string;
}

export interface ScheduleSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  status: 'available' | 'reserved' | 'booked';
  availableSpots: number;
}

export interface Payment {
  id: string;
  appointmentId: string;
  patientId: string;
  amount: number;
  method: 'card' | 'upi' | 'cash' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  rating: number;
  comments?: string;
  suggestions?: string;
  type: 'doctor_rating' | 'hospital_rating' | 'service_rating' | 'overall_experience';
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'hospital' | 'admin' | 'trainer';
  avatar?: string;
}

// Video Call Types
export interface VideoCall {
  id: string;
  appointmentId: string;
  callerId: string;
  receiverId: string;
  status: 'initiating' | 'ringing' | 'connected' | 'ended' | 'missed' | 'declined';
  startTime?: string;
  endTime?: string;
  duration?: number;
  callType: 'appointment' | 'emergency' | 'followup';
  recordingUrl?: string;
}

export interface VideoCallState {
  isInCall: boolean;
  currentCall?: VideoCall;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
  isMuted: boolean;
  isVideoEnabled: boolean;
  callDuration: number;
  connectionQuality: 'good' | 'fair' | 'poor';
}

export interface WebRTCSignal {
  type: 'offer' | 'answer' | 'ice-candidate';
  callId: string;
  fromUserId: string;
  toUserId: string;
  data: any;
}

export interface VideoCallParticipant {
  userId: string;
  userName: string;
  userRole: 'patient' | 'doctor';
  isConnected: boolean;
  joinedAt?: string;
  isMuted?: boolean;
  isVideoEnabled?: boolean;
  isHandRaised?: boolean;
  isScreenSharing?: boolean;
  avatarUrl?: string;
}

export interface MeetingInfo {
  id: string;
  title: string;
  startTime: string;
  participants: VideoCallParticipant[];
  isRecording?: boolean;
  meetingCode?: string;
}

export interface TeamsVideoCallState extends VideoCallState {
  participants: VideoCallParticipant[];
  meetingInfo: MeetingInfo;
  isChatOpen: boolean;
  isParticipantListOpen: boolean;
  isScreenSharing: boolean;
  screenShareStream?: MediaStream;
  handRaised: boolean;
  layout: 'gallery' | 'speaker' | 'spotlight';
}

export interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientLocation?: string;
  emergencyType: 'medical' | 'accident' | 'cardiac' | 'respiratory' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  symptoms: string;
  description: string;
  assignedDoctorId?: string;
  assignedDoctorName?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  requestedAt: string;
  assignedAt?: string;
  completedAt?: string;
  notes?: string;
  priority: number; // 1-5, 5 being highest
}
