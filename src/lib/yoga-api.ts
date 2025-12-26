// Yoga-specific API client for separate yoga functionality
import { API_URL } from './config';

const API_BASE_URL = 'http://localhost:8081/api';

// Generic API call function for yoga endpoints
async function yogaApiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = 'Yoga API Error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses (like DELETE operations)
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');

    if (contentLength === '0' || !contentType?.includes('application/json')) {
      return undefined as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your connection and try again.');
    }
    throw error;
  }
}

// Yoga Poses API - Separate from general yoga API
export const yogaPosesAPI = {
  // Get all yoga poses (admin/general use)
  getAll: () => yogaApiCall<any[]>('/yoga/poses'),

  // Get safe poses for a specific patient based on their health profile
  getSafe: (patientId: string) => yogaApiCall<any[]>(`/yoga/poses/safe/${patientId}`),

  // Get poses by category (beginner, intermediate, advanced)
  getByCategory: (category: string) => yogaApiCall<any[]>(`/yoga/poses/category/${category}`),

  // Get poses by difficulty level
  getByDifficulty: (level: string) => yogaApiCall<any[]>(`/yoga/poses/difficulty/${level}`),

  // Create a new pose (admin only)
  create: (pose: any) => yogaApiCall<any>('/yoga/poses', {
    method: 'POST',
    body: JSON.stringify(pose),
  }),

  // Update a pose (admin only)
  update: (id: string, pose: any) => yogaApiCall<any>(`/yoga/poses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(pose),
  }),

  // Delete a pose (admin only)
  delete: (id: string) => yogaApiCall<void>(`/yoga/poses/${id}`, {
    method: 'DELETE',
  }),

  // Get pose by ID
  getById: (id: string) => yogaApiCall<any>(`/yoga/poses/${id}`),
};

// Yoga Routines API - Separate from poses
export const yogaRoutinesAPI = {
  // Get all routines
  getAll: () => yogaApiCall<any[]>('/yoga/routines'),

  // Get routines for a specific patient
  getByPatient: (patientId: string) => yogaApiCall<any[]>(`/yoga/routines/patient/${patientId}`),

  // Get routines by category
  getByCategory: (category: string) => yogaApiCall<any[]>(`/yoga/routines/category/${category}`),

  // Get AI-generated routines
  getAIGenerated: (patientId: string) => yogaApiCall<any[]>(`/yoga/routines/ai/${patientId}`),

  // Create a custom routine
  create: (routine: any) => yogaApiCall<any>('/yoga/routines', {
    method: 'POST',
    body: JSON.stringify(routine),
  }),

  // Update a routine
  update: (id: string, routine: any) => yogaApiCall<any>(`/yoga/routines/${id}`, {
    method: 'PUT',
    body: JSON.stringify(routine),
  }),

  // Delete a routine
  delete: (id: string) => yogaApiCall<void>(`/yoga/routines/${id}`, {
    method: 'DELETE',
  }),

  // Get routine by ID
  getById: (id: string) => yogaApiCall<any>(`/yoga/routines/${id}`),

  // Save user's progress on a routine
  saveProgress: (routineId: string, progress: any) => yogaApiCall<any>(`/yoga/routines/${routineId}/progress`, {
    method: 'POST',
    body: JSON.stringify(progress),
  }),
};

// Yoga Sessions API - Separate from routines
export const yogaSessionsAPI = {
  // Begin a new session (alternative to start)
  begin: (sessionData: any) => yogaApiCall<any>('/yoga/sessions/begin', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  }),

  // Start a new session
  start: (sessionData: any) => yogaApiCall<any>('/yoga/sessions/start', {
    method: 'POST',
    body: JSON.stringify(sessionData),
  }),

  // End a session
  end: (sessionId: string, sessionData: any) => yogaApiCall<any>(`/yoga/sessions/${sessionId}/end`, {
    method: 'PUT',
    body: JSON.stringify(sessionData),
  }),

  // Get session history for a patient
  getHistory: (patientId: string) => yogaApiCall<any[]>(`/yoga/sessions/history/${patientId}`),

  // Get session by ID
  getById: (sessionId: string) => yogaApiCall<any>(`/yoga/sessions/${sessionId}`),

  // Update session progress
  updateProgress: (sessionId: string, progress: any) => yogaApiCall<any>(`/yoga/sessions/${sessionId}/progress`, {
    method: 'PUT',
    body: JSON.stringify(progress),
  }),

  // Pause/resume session
  pause: (sessionId: string) => yogaApiCall<any>(`/yoga/sessions/${sessionId}/pause`, {
    method: 'PUT',
  }),

  resume: (sessionId: string) => yogaApiCall<any>(`/yoga/sessions/${sessionId}/resume`, {
    method: 'PUT',
  }),
};

// Yoga Trainers API - Separate from general trainers
export const yogaTrainersAPI = {
  // Get all yoga trainers
  getAll: () => yogaApiCall<any[]>('/yoga/trainers'),

  // Get available trainers
  getAvailable: () => yogaApiCall<any[]>('/yoga/trainers/available'),

  // Get trainers by specialty
  getBySpecialty: (specialty: string) => yogaApiCall<any[]>(`/yoga/trainers/specialty/${specialty}`),

  // Get trainer by ID
  getById: (id: string) => yogaApiCall<any>(`/yoga/trainers/${id}`),

  // Book a session with a trainer
  bookSession: (trainerId: string, bookingData: any) => yogaApiCall<any>(`/yoga/trainers/${trainerId}/book`, {
    method: 'POST',
    body: JSON.stringify(bookingData),
  }),

  // Get trainer's schedule
  getSchedule: (trainerId: string) => yogaApiCall<any>(`/yoga/trainers/${trainerId}/schedule`),

  // Get trainer reviews
  getReviews: (trainerId: string) => yogaApiCall<any[]>(`/yoga/trainers/${trainerId}/reviews`),

  // Rate a trainer
  rateTrainer: (trainerId: string, rating: any) => yogaApiCall<any>(`/yoga/trainers/${trainerId}/rate`, {
    method: 'POST',
    body: JSON.stringify(rating),
  }),
};

// Yoga Progress API - Separate tracking functionality
export const yogaProgressAPI = {
  // Get patient's overall progress
  getPatientProgress: (patientId: string) => yogaApiCall<any>(`/yoga/progress/${patientId}`),

  // Get progress for specific routine
  getRoutineProgress: (patientId: string, routineId: string) => yogaApiCall<any>(`/yoga/progress/${patientId}/routine/${routineId}`),

  // Update progress
  updateProgress: (patientId: string, progressData: any) => yogaApiCall<any>(`/yoga/progress/${patientId}`, {
    method: 'PUT',
    body: JSON.stringify(progressData),
  }),

  // Get achievements/badges
  getAchievements: (patientId: string) => yogaApiCall<any[]>(`/yoga/progress/${patientId}/achievements`),

  // Get streak information
  getStreak: (patientId: string) => yogaApiCall<any>(`/yoga/progress/${patientId}/streak`),

  // Get weekly/monthly stats
  getStats: (patientId: string, period: 'weekly' | 'monthly') => yogaApiCall<any>(`/yoga/progress/${patientId}/stats/${period}`),
};

// Yoga Health Integration API - Separate health-related functionality
export const yogaHealthAPI = {
  // Get health recommendations for yoga
  getHealthRecommendations: (patientId: string) => yogaApiCall<any>(`/yoga/health/${patientId}/recommendations`),

  // Get contraindications for patient
  getContraindications: (patientId: string) => yogaApiCall<any[]>(`/yoga/health/${patientId}/contraindications`),

  // Update patient's yoga health profile
  updateHealthProfile: (patientId: string, profile: any) => yogaApiCall<any>(`/yoga/health/${patientId}/profile`, {
    method: 'PUT',
    body: JSON.stringify(profile),
  }),

  // Get safe modifications for poses
  getPoseModifications: (patientId: string, poseId: string) => yogaApiCall<any>(`/yoga/health/${patientId}/pose/${poseId}/modifications`),

  // Report health concern during session
  reportConcern: (patientId: string, concern: any) => yogaApiCall<any>(`/yoga/health/${patientId}/concerns`, {
    method: 'POST',
    body: JSON.stringify(concern),
  }),
};

// Yoga Appointments API - Separate appointment functionality for yoga
export const yogaAppointmentsAPI = {
  // Get appointments for a specific patient
  getByPatient: (patientId: string) => yogaApiCall<any[]>(`/yoga/appointments/patient/${patientId}`),

  // Create a new yoga appointment
  create: (appointment: any) => yogaApiCall<any>('/yoga/appointments', {
    method: 'POST',
    body: JSON.stringify(appointment),
  }),

  // Get appointment by ID
  getById: (id: string) => yogaApiCall<any>(`/yoga/appointments/${id}`),

  // Update appointment
  update: (id: string, appointment: any) => yogaApiCall<any>(`/yoga/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(appointment),
  }),

  // Cancel appointment
  cancel: (id: string) => yogaApiCall<void>(`/yoga/appointments/${id}/cancel`, {
    method: 'PUT',
  }),

  // Get available time slots for a trainer
  getAvailableSlots: (trainerId: string, date: string) => yogaApiCall<any[]>(`/yoga/appointments/trainer/${trainerId}/slots?date=${date}`),

  // Reschedule appointment
  reschedule: (id: string, newDateTime: any) => yogaApiCall<any>(`/yoga/appointments/${id}/reschedule`, {
    method: 'PUT',
    body: JSON.stringify(newDateTime),
  }),
};

// Yoga Categories API - For fetching yoga categories
export const yogaCategoriesAPI = {
  // Get all yoga categories
  getAll: () => yogaApiCall<any[]>('/yoga/categories'),

  // Get category by ID
  getById: (id: string) => yogaApiCall<any>(`/yoga/categories/${id}`),
};

// Yoga Analytics API - Separate analytics functionality
export const yogaAnalyticsAPI = {
  // Get patient analytics
  getPatientAnalytics: (patientId: string) => yogaApiCall<any>(`/yoga/analytics/${patientId}`),

  // Get popular poses
  getPopularPoses: () => yogaApiCall<any[]>('/yoga/analytics/poses/popular'),

  // Get popular routines
  getPopularRoutines: () => yogaApiCall<any[]>('/yoga/analytics/routines/popular'),

  // Get system-wide stats
  getSystemStats: () => yogaApiCall<any>('/yoga/analytics/stats'),

  // Get trainer performance metrics
  getTrainerMetrics: (trainerId: string) => yogaApiCall<any>(`/yoga/analytics/trainers/${trainerId}`),
};

// Export all yoga APIs
export const yogaAPI = {
  poses: yogaPosesAPI,
  routines: yogaRoutinesAPI,
  sessions: yogaSessionsAPI,
  trainers: yogaTrainersAPI,
  progress: yogaProgressAPI,
  health: yogaHealthAPI,
  appointments: yogaAppointmentsAPI,
  categories: yogaCategoriesAPI,
  analytics: yogaAnalyticsAPI,
};

export default yogaAPI;
