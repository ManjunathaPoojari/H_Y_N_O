
// API Client for Spring Boot Backend Integration
import { API_URL } from './config';

const API_BASE_URL = API_URL;

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('token');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorMessage = 'API Error';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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

// Export apiCall function
export { apiCall };

// Authentication API
export const authAPI = {
  login: async (email: string, password: string, role: string) => {
    return apiCall<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  },

  register: async (userData: any) => {
    return apiCall<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },
};

// Patient API
export const patientAPI = {
  getAll: (page?: number, size?: number, sortBy?: string, sortDir?: string, search?: string) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortDir) params.append('sortDir', sortDir);
    if (search) params.append('search', search);
    return apiCall<any>(`/patients?${params.toString()}`);
  },

  getById: (id: string) => apiCall<any>(`/patients/${id}`),

  create: (patient: any) =>
    apiCall<any>('/patients', {
      method: 'POST',
      body: JSON.stringify(patient),
    }),

  update: (id: string, patient: any) =>
    apiCall<any>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    }),

  delete: (id: string) =>
    apiCall<void>(`/patients/${id}`, {
      method: 'DELETE',
    }),

  search: (query: string) =>
    apiCall<any[]>(`/patients/search?query=${encodeURIComponent(query)}`),
};

// Doctor API
export const doctorAPI = {
  getAll: () => apiCall<any[]>('/api/doctors'),

  getById: (id: string) => apiCall<any>(`/api/doctors/${id}`),

  create: (doctor: any) =>
    apiCall<any>('/api/doctors', {
      method: 'POST',
      body: JSON.stringify(doctor),
    }),

  update: (id: string, doctor: any) =>
    apiCall<any>(`/api/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctor),
    }),

  approve: (id: string) =>
    apiCall<any>(`/api/doctors/${id}/approve`, {
      method: 'PUT',
    }),

  suspend: (id: string) =>
    apiCall<any>(`/api/doctors/${id}/suspend`, {
      method: 'PUT',
    }),

  delete: (id: string) =>
    apiCall<void>(`/api/doctors/${id}`, {
      method: 'DELETE',
    }),

  // Schedule management
  getSchedule: (doctorId: string) => apiCall<any>(`/api/doctors/${doctorId}/schedule`),
  addScheduleSlot: (doctorId: string, slot: any) =>
    apiCall<any>(`/api/doctors/${doctorId}/schedule/slots`, {
      method: 'POST',
      body: JSON.stringify(slot),
    }),
  updateScheduleSlot: (doctorId: string, slotId: string, slot: any) =>
    apiCall<any>(`/api/doctors/${doctorId}/schedule/slots/${slotId}`, {
      method: 'PUT',
      body: JSON.stringify(slot),
    }),
  deleteScheduleSlot: (doctorId: string, slotId: string) =>
    apiCall<any>(`/api/doctors/${doctorId}/schedule/slots/${slotId}`, {
      method: 'DELETE',
    }),

  // Patient management
  getPatients: (doctorId: string) => apiCall<any[]>(`/api/doctors/${doctorId}/patients`),
  getPatientDetails: (doctorId: string, patientId: string) =>
    apiCall<any>(`/api/doctors/${doctorId}/patients/${patientId}`),
  addPatientNote: (doctorId: string, patientId: string, note: string) =>
    apiCall<any>(`/api/doctors/${doctorId}/patients/${patientId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),
};
// Hospital API
export const hospitalAPI = {
  getAll: () => apiCall<any[]>('/api/hospitals'),

  getById: (id: string) => apiCall<any>(`/api/hospitals/${id}`),

  getDoctors: (hospitalId: string) => apiCall<any[]>(`/api/hospitals/${hospitalId}/doctors`),

  create: (hospital: any) =>
    apiCall<any>('/api/hospitals', {
      method: 'POST',
      body: JSON.stringify(hospital),
    }),

  update: (id: string, hospital: any) =>
    apiCall<any>(`/api/hospitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hospital),
    }),

  approve: (id: string) =>
    apiCall<any>(`/api/hospitals/${id}/approve`, {
      method: 'PUT',
    }),

  reject: (id: string) =>
    apiCall<any>(`/api/hospitals/${id}/reject`, {
      method: 'PUT',
    }),

  delete: (id: string) =>
    apiCall<void>(`/api/hospitals/${id}`, {
      method: 'DELETE',
    }),

  // Patient management
  getPatients: (hospitalId: string) =>
    apiCall<any[]>(`/api/hospitals/${hospitalId}/patients`),
  getPatientDetails: (hospitalId: string, patientId: string) =>
    apiCall<any>(`/api/hospitals/${hospitalId}/patients/${patientId}`),
  addPatientNote: (hospitalId: string, patientId: string, note: string) =>
    apiCall<any>(`/api/hospitals/${hospitalId}/patients/${patientId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  // Schedule management
  getSchedule: (hospitalId: string) => apiCall<any>(`/api/hospitals/${hospitalId}/schedule`),
  addScheduleSlot: (hospitalId: string, slot: any) =>
    apiCall<any>(`/api/hospitals/${hospitalId}/schedule/slots`, {
      method: 'POST',
      body: JSON.stringify(slot),
    }),
  updateScheduleSlot: (hospitalId: string, slotId: string, slot: any) =>
    apiCall<any>(`/api/hospitals/${hospitalId}/schedule/slots/${slotId}`, {
      method: 'PUT',
      body: JSON.stringify(slot),
    }),
  deleteScheduleSlot: (hospitalId: string, slotId: string) =>
    apiCall<any>(`/api/hospitals/${hospitalId}/schedule/slots/${slotId}`, {
      method: 'DELETE',
    }),
};

// Appointment API
export const appointmentAPI = {
  getAll: () => apiCall<any[]>('/api/appointments'),

  getById: (id: string) => apiCall<any>(`/api/appointments/${id}`),

  getByPatient: (patientId: string) =>
    apiCall<any[]>(`/api/appointments/patient/${patientId}`),

  getByDoctor: (doctorId: string) =>
    apiCall<any[]>(`/api/appointments/doctor/${doctorId}`),

  create: (appointment: any) =>
    apiCall<any>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify({
        patient: { id: appointment.patientId },
        patientName: appointment.patientName,
        doctor: { id: appointment.doctorId },
        doctorName: appointment.doctorName,
        hospital: appointment.hospitalId ? { id: appointment.hospitalId } : null,
        type: appointment.type?.toUpperCase(),
        appointmentDate: appointment.date,
        appointmentTime: appointment.time,
        status: appointment.status?.toUpperCase() || 'UPCOMING',
        reason: appointment.reason,
      }),
    }),

  update: (id: string, appointment: any) =>
    apiCall<any>(`/api/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: appointment.status?.toUpperCase(),
        notes: appointment.notes,
        prescription: appointment.prescription,
        reason: appointment.reason,
      }),
    }),

  cancel: (id: string) =>
    apiCall<any>(`/api/appointments/${id}/cancel`, {
      method: 'PUT',
    }),

  complete: (id: string, notes?: string) =>
    apiCall<any>(`/api/appointments/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    }),

  reschedule: (id: string, date: string, time: string) =>
    apiCall<any>(`/api/appointments/${id}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ appointmentDate: date, appointmentTime: time }),
    }),

  confirmAppointment: (id: string) =>
    apiCall<any>(`/api/appointments/${id}/confirm`, {
      method: 'PUT',
    }),
};

// Medicine API
export const medicineAPI = {
  getAll: () => apiCall<any[]>('/api/medicines'),

  getById: (id: string) => apiCall<any>(`/api/medicines/${id}`),

  search: (query: string) =>
    apiCall<any[]>(`/api/medicines/search?q=${encodeURIComponent(query)}`),

  create: (medicine: any) =>
    apiCall<any>('/api/medicines', {
      method: 'POST',
      body: JSON.stringify(medicine),
    }),

  update: (id: string, medicine: any) =>
    apiCall<any>(`/api/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicine),
    }),

  delete: (id: string) =>
    apiCall<void>(`/api/medicines/${id}`, {
      method: 'DELETE',
    }),
};

// Order API
export const orderAPI = {
  getAll: () => apiCall<any[]>('/orders'),

  getById: (id: string) => apiCall<any>(`/orders/${id}`),

  getByPatient: (patientId: string) =>
    apiCall<any[]>(`/orders/patient/${patientId}`),

  create: (order: any) =>
    apiCall<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),

  update: (id: string, order: any) =>
    apiCall<any>(`/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(order),
    }),

  updateStatus: (id: string, status: string) =>
    apiCall<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),

  cancel: (id: string) =>
    apiCall<any>(`/orders/${id}/cancel`, {
      method: 'PUT',
    }),

  delete: (id: string) =>
    apiCall<void>(`/orders/${id}`, {
      method: 'DELETE',
    }),
};

// Prescription API
export const prescriptionAPI = {
  upload: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/api/prescriptions/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  getByPatient: (patientId: string) =>
    apiCall<any[]>(`/api/prescriptions/patient/${patientId}`),

  create: (prescription: any) =>
    apiCall<any>('/api/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescription),
    }),
};



// Nutrition API
export const nutritionAPI = {
  getPlans: () => apiCall<any[]>('/api/nutrition/plans'),

  getPlanByPatient: (patientId: string) =>
    apiCall<any>(`/api/nutrition/plans/patient/${patientId}`),

  createPlan: (plan: any) =>
    apiCall<any>('/api/nutrition/plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    }),

  updatePlan: (id: string, plan: any) =>
    apiCall<any>(`/api/nutrition/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    }),

  getMeals: () => apiCall<any[]>('/api/nutrition/meals'),

  getRecipesByDisease: (disease: string) =>
    apiCall<any[]>(`/api/nutrition/recipes?disease=${encodeURIComponent(disease)}`),
};

// Chat API
export const chatAPI = {
  getChatRooms: (userId: string, userType: string) =>
    apiCall<any[]>(`/api/chat/rooms?userId=${userId}&userType=${userType}`),

  getChatRoom: (chatRoomId: string) =>
    apiCall<any>(`/api/chat/rooms/${chatRoomId}`),

  createChatRoom: (appointmentId: string) =>
    apiCall<any>(`/api/chat/rooms/create?appointmentId=${appointmentId}`, {
      method: 'POST',
    }),

  getChatMessages: (chatRoomId: string) =>
    apiCall<any[]>(`/api/chat/rooms/${chatRoomId}/messages`),

  sendMessage: (chatRoomId: string, messageData: {
    senderId: string;
    senderName: string;
    senderRole: string;
    content: string;
  }) =>
    apiCall<any>(`/api/chat/rooms/${chatRoomId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    }),

  markMessagesAsRead: (chatRoomId: string, userId: string, userType: string) =>
    apiCall<void>(`/api/chat/rooms/${chatRoomId}/read?userId=${userId}&userType=${userType}`, {
      method: 'PUT',
    }),

  markMessagesAsDelivered: (chatRoomId: string, userId: string, userType: string) =>
    apiCall<void>(`/api/chat/rooms/${chatRoomId}/delivered?userId=${userId}&userType=${userType}`, {
      method: 'PUT',
    }),

  getUnreadCount: (userId: string, userType: string) =>
    apiCall<{ unreadCount: number }>(`/api/chat/unread?userId=${userId}&userType=${userType}`),

  archiveChatRoom: (chatRoomId: string) =>
    apiCall<void>(`/api/chat/rooms/${chatRoomId}/archive`, {
      method: 'PUT',
    }),
};

// Yoga API
export const yogaAPI = {
  getTrainers: () => apiCall<any[]>('/api/yoga/trainers'),

  getTrainerById: (id: string) => apiCall<any>(`/api/yoga/trainers/${id}`),

  bookSession: (booking: any) =>
    apiCall<any>('/api/yoga/sessions', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),

  getSessionsByPatient: (patientId: string) =>
    apiCall<any[]>(`/api/yoga/sessions/patient/${patientId}`),

  getVideos: () => apiCall<any[]>('/api/yoga/videos'),
};

// Payment API
export const paymentAPI = {
  getAll: () => apiCall<any[]>('/api/payments'),

  getById: (id: string) => apiCall<any>(`/api/payments/${id}`),

  getByPatient: (patientId: string) => apiCall<any[]>(`/api/payments/patient/${patientId}`),

  getByAppointment: (appointmentId: string) => apiCall<any[]>(`/api/payments/appointment/${appointmentId}`),

  create: (payment: any) =>
    apiCall<any>('/api/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    }),

  process: (id: string) =>
    apiCall<any>(`/api/payments/${id}/process`, {
      method: 'PUT',
    }),

  refund: (id: string, reason: string) =>
    apiCall<any>(`/api/payments/${id}/refund`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    }),

  getCompletedByPatient: (patientId: string) => apiCall<any[]>(`/api/payments/patient/${patientId}/completed`),

  getPaymentStats: (patientId: string) => apiCall<any>(`/api/payments/patient/${patientId}/stats`),
};

// Feedback API
export const feedbackAPI = {
  getAll: () => apiCall<any[]>('/api/feedback'),

  getById: (id: string) => apiCall<any>(`/api/feedback/${id}`),

  getByPatient: (patientId: string) => apiCall<any[]>(`/api/feedback/patient/${patientId}`),

  getByDoctor: (doctorId: string) => apiCall<any[]>(`/api/feedback/doctor/${doctorId}`),

  getByAppointment: (appointmentId: string) => apiCall<any[]>(`/api/feedback/appointment/${appointmentId}`),

  create: (feedback: any) =>
    apiCall<any>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    }),

  update: (id: string, feedback: any) =>
    apiCall<any>(`/api/feedback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(feedback),
    }),

  getDoctorRating: (doctorId: string) => apiCall<any>(`/api/feedback/doctor/${doctorId}/rating`),

  getRecentByType: (type: string, limit?: number) =>
    apiCall<any[]>(`/api/feedback/recent/${type}?limit=${limit || 10}`),

  delete: (id: string) =>
    apiCall<void>(`/api/feedback/${id}`, {
      method: 'DELETE',
    }),
};

// Admin API
export const adminAPI = {
  getStats: () => apiCall<any>('/api/admin/stats'),

  // Patient management
  getAllPatients: (page?: number, size?: number, sortBy?: string, sortDir?: string, search?: string) => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (size !== undefined) params.append('size', size.toString());
    if (sortBy) params.append('sortBy', sortBy);
    if (sortDir) params.append('sortDir', sortDir);
    if (search) params.append('search', search);
    return apiCall<any>(`/api/patients?${params.toString()}`);
  },
  getPatientById: (id: string) => apiCall<any>(`/api/patients/${id}`),
  updatePatient: (id: string, patient: any) =>
    apiCall<any>(`/api/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    }),
  deletePatient: (id: string) =>
    apiCall<void>(`/api/patients/${id}`, {
      method: 'DELETE',
    }),

  // Doctor management
  getAllDoctors: () => apiCall<any[]>('/api/admin/doctors'),
  getDoctorById: (id: string) => apiCall<any>(`/api/admin/doctors/${id}`),
  updateDoctor: (id: string, doctor: any) =>
    apiCall<any>(`/api/admin/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctor),
    }),
  approveDoctor: (id: string) =>
    apiCall<any>(`/api/admin/doctors/${id}/approve`, {
      method: 'PUT',
    }),
  suspendDoctor: (id: string) =>
    apiCall<any>(`/api/admin/doctors/${id}/suspend`, {
      method: 'PUT',
    }),
  deleteDoctor: (id: string) =>
    apiCall<void>(`/api/admin/doctors/${id}`, {
      method: 'DELETE',
    }),

  // Hospital management
  getAllHospitals: () => apiCall<any[]>('/api/admin/hospitals'),
  getHospitalById: (id: string) => apiCall<any>(`/api/admin/hospitals/${id}`),
  updateHospital: (id: string, hospital: any) =>
    apiCall<any>(`/api/admin/hospitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hospital),
    }),
  approveHospital: (id: string) =>
    apiCall<any>(`/api/admin/hospitals/${id}/approve`, {
      method: 'PUT',
    }),
  rejectHospital: (id: string) =>
    apiCall<any>(`/api/admin/hospitals/${id}/reject`, {
      method: 'PUT',
    }),
  deleteHospital: (id: string) =>
    apiCall<void>(`/api/admin/hospitals/${id}`, {
      method: 'DELETE',
    }),

  // Appointment management
  getAllAppointments: () => apiCall<any[]>('/api/admin/appointments'),
  getAppointmentById: (id: string) => apiCall<any>(`/api/admin/appointments/${id}`),
  updateAppointment: (id: string, appointment: any) =>
    apiCall<any>(`/api/admin/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    }),
  cancelAppointment: (id: string) =>
    apiCall<any>(`/api/admin/appointments/${id}/cancel`, {
      method: 'PUT',
    }),
  completeAppointment: (id: string) =>
    apiCall<any>(`/api/admin/appointments/${id}/complete`, {
      method: 'PUT',
    }),
  confirmAppointment: (id: string) =>
    apiCall<any>(`/api/admin/appointments/${id}/confirm`, {
      method: 'PUT',
    }),
  deleteAppointment: (id: string) =>
    apiCall<void>(`/api/admin/appointments/${id}`, {
      method: 'DELETE',
    }),

  // Pending approvals
  getPendingDoctors: () => apiCall<any[]>('/api/admin/pending/doctors'),
  getPendingHospitals: () => apiCall<any[]>('/api/admin/pending/hospitals'),
};



// Pharmacy API
export const pharmacyAPI = {
  getMedicines: () => apiCall<any[]>('/api/medicines'),
  getOrders: () => apiCall<any[]>('/api/orders'),
  getPrescriptions: () => apiCall<any[]>('/api/prescriptions'),
  addMedicine: (medicine: any) =>
    apiCall<any>('/api/medicines', {
      method: 'POST',
      body: JSON.stringify(medicine),
    }),
  updateMedicine: (id: string, medicine: any) =>
    apiCall<any>(`/api/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicine),
    }),
  deleteMedicine: (id: string) =>
    apiCall<void>(`/api/medicines/${id}`, {
      method: 'DELETE',
    }),
  updateOrderStatus: (id: string, status: string) =>
    apiCall<any>(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Export all APIs
export const api = {
  auth: authAPI,
  patients: patientAPI,
  doctors: doctorAPI,
  hospitals: hospitalAPI,
  appointments: appointmentAPI,
  medicines: medicineAPI,
  prescriptions: prescriptionAPI,
  orders: orderAPI,

  nutrition: nutritionAPI,
  yoga: yogaAPI,
  chat: chatAPI,
  payments: paymentAPI,
  feedback: feedbackAPI,
  admin: adminAPI,
  pharmacy: pharmacyAPI,
};

export default api;
