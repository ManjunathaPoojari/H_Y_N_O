import { apiCall } from './api-client';
import { YogaTrainer, YogaVideo, YogaAppointment, YogaProgress, YogaRoutine, YogaFormAnalysis, YogaNotification, YogaStats } from '../types/yoga';

// Yoga API
export const yogaAPI = {
  getTrainers: () => apiCall<YogaTrainer[]>('/api/yoga/trainers'),

  getTrainerById: (id: string) => apiCall<YogaTrainer>(`/api/yoga/trainers/${id}`),

  bookSession: (booking: any) =>
    apiCall<YogaAppointment>('/api/yoga/sessions', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),

  getSessionsByPatient: (patientId: string) =>
    apiCall<YogaAppointment[]>(`/api/yoga/sessions/patient/${patientId}`),

  getVideos: () => apiCall<YogaVideo[]>('/api/yoga/videos'),

  getVideoById: (id: string) => apiCall<YogaVideo>(`/api/yoga/videos/${id}`),

  getProgress: (patientId: string) => apiCall<YogaProgress>(`/api/yoga/progress/${patientId}`),

  updateProgress: (patientId: string, progress: Partial<YogaProgress>) =>
    apiCall<YogaProgress>(`/api/yoga/progress/${patientId}`, {
      method: 'PUT',
      body: JSON.stringify(progress),
    }),

  getRoutines: (patientId?: string) =>
    apiCall<YogaRoutine[]>(`/api/yoga/routines${patientId ? `?patientId=${patientId}` : ''}`),

  createRoutine: (routine: Omit<YogaRoutine, 'id' | 'createdAt'>) =>
    apiCall<YogaRoutine>('/api/yoga/routines', {
      method: 'POST',
      body: JSON.stringify(routine),
    }),

  getFormAnalysis: (patientId: string) =>
    apiCall<YogaFormAnalysis[]>(`/api/yoga/form-analysis/${patientId}`),

  submitFormAnalysis: (analysis: Omit<YogaFormAnalysis, 'id' | 'timestamp'>) =>
    apiCall<YogaFormAnalysis>('/api/yoga/form-analysis', {
      method: 'POST',
      body: JSON.stringify(analysis),
    }),

  getNotifications: (patientId: string) =>
    apiCall<YogaNotification[]>(`/api/yoga/notifications/${patientId}`),

  markNotificationRead: (notificationId: string) =>
    apiCall<void>(`/api/yoga/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),

  getStats: (patientId: string) => apiCall<YogaStats>(`/api/yoga/stats/${patientId}`),

  updateAppointmentStatus: (appointmentId: string, status: string, notes?: string) =>
    apiCall<YogaAppointment>(`/api/yoga/sessions/${appointmentId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    }),

  rescheduleAppointment: (appointmentId: string, date: string, time: string) =>
    apiCall<YogaAppointment>(`/api/yoga/sessions/${appointmentId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ date, time }),
    }),

  cancelAppointment: (appointmentId: string, reason?: string) =>
    apiCall<YogaAppointment>(`/api/yoga/sessions/${appointmentId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),

  rateSession: (appointmentId: string, rating: number, feedback?: string) =>
    apiCall<YogaAppointment>(`/api/yoga/sessions/${appointmentId}/rate`, {
      method: 'PUT',
      body: JSON.stringify({ rating, feedback }),
    }),
};
