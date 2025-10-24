// API Client for Spring Boot Backend Integration
import { API_URL } from './config';

const API_BASE_URL = API_URL;

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');
  
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
      const error = await response.json();
      throw new Error(error.message || 'API Error');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}

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
    localStorage.removeItem('authToken');
    return Promise.resolve();
  },
};

// Patient API
export const patientAPI = {
  getAll: () => apiCall<any[]>('/patients'),
  
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
};

// Doctor API
export const doctorAPI = {
  getAll: () => apiCall<any[]>('/doctors'),
  
  getById: (id: string) => apiCall<any>(`/doctors/${id}`),
  
  create: (doctor: any) =>
    apiCall<any>('/doctors', {
      method: 'POST',
      body: JSON.stringify(doctor),
    }),
  
  update: (id: string, doctor: any) =>
    apiCall<any>(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctor),
    }),
  
  approve: (id: string) =>
    apiCall<any>(`/doctors/${id}/approve`, {
      method: 'PUT',
    }),
  
  suspend: (id: string) =>
    apiCall<any>(`/doctors/${id}/suspend`, {
      method: 'PUT',
    }),
  
  delete: (id: string) =>
    apiCall<void>(`/doctors/${id}`, {
      method: 'DELETE',
    }),
};

// Hospital API
export const hospitalAPI = {
  getAll: () => apiCall<any[]>('/hospitals'),
  
  getById: (id: string) => apiCall<any>(`/hospitals/${id}`),
  
  create: (hospital: any) =>
    apiCall<any>('/hospitals', {
      method: 'POST',
      body: JSON.stringify(hospital),
    }),
  
  update: (id: string, hospital: any) =>
    apiCall<any>(`/hospitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hospital),
    }),
  
  approve: (id: string) =>
    apiCall<any>(`/hospitals/${id}/approve`, {
      method: 'PUT',
    }),
  
  reject: (id: string) =>
    apiCall<any>(`/hospitals/${id}/reject`, {
      method: 'PUT',
    }),
  
  delete: (id: string) =>
    apiCall<void>(`/hospitals/${id}`, {
      method: 'DELETE',
    }),
};

// Appointment API
export const appointmentAPI = {
  getAll: () => apiCall<any[]>('/appointments'),
  
  getById: (id: string) => apiCall<any>(`/appointments/${id}`),
  
  getByPatient: (patientId: string) =>
    apiCall<any[]>(`/appointments/patient/${patientId}`),
  
  getByDoctor: (doctorId: string) =>
    apiCall<any[]>(`/appointments/doctor/${doctorId}`),
  
  create: (appointment: any) =>
    apiCall<any>('/appointments', {
      method: 'POST',
      body: JSON.stringify(appointment),
    }),
  
  update: (id: string, appointment: any) =>
    apiCall<any>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    }),
  
  cancel: (id: string) =>
    apiCall<any>(`/appointments/${id}/cancel`, {
      method: 'PUT',
    }),
  
  complete: (id: string, notes?: string) =>
    apiCall<any>(`/appointments/${id}/complete`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    }),
  
  reschedule: (id: string, date: string, time: string) =>
    apiCall<any>(`/appointments/${id}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify({ date, time }),
    }),
};

// Medicine API
export const medicineAPI = {
  getAll: () => apiCall<any[]>('/medicines'),
  
  getById: (id: string) => apiCall<any>(`/medicines/${id}`),
  
  search: (query: string) =>
    apiCall<any[]>(`/medicines/search?q=${encodeURIComponent(query)}`),
  
  create: (medicine: any) =>
    apiCall<any>('/medicines', {
      method: 'POST',
      body: JSON.stringify(medicine),
    }),
  
  update: (id: string, medicine: any) =>
    apiCall<any>(`/medicines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(medicine),
    }),
  
  delete: (id: string) =>
    apiCall<void>(`/medicines/${id}`, {
      method: 'DELETE',
    }),
};

// Prescription API
export const prescriptionAPI = {
  upload: async (file: File, patientId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', patientId);
    
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/prescriptions/upload`, {
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
    apiCall<any[]>(`/prescriptions/patient/${patientId}`),
  
  create: (prescription: any) =>
    apiCall<any>('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(prescription),
    }),
};

// Order API (Pharmacy)
export const orderAPI = {
  create: (order: any) =>
    apiCall<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  
  getByPatient: (patientId: string) =>
    apiCall<any[]>(`/orders/patient/${patientId}`),
  
  getById: (id: string) => apiCall<any>(`/orders/${id}`),
  
  updateStatus: (id: string, status: string) =>
    apiCall<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// Nutrition API
export const nutritionAPI = {
  getPlans: () => apiCall<any[]>('/nutrition/plans'),
  
  getPlanByPatient: (patientId: string) =>
    apiCall<any>(`/nutrition/plans/patient/${patientId}`),
  
  createPlan: (plan: any) =>
    apiCall<any>('/nutrition/plans', {
      method: 'POST',
      body: JSON.stringify(plan),
    }),
  
  updatePlan: (id: string, plan: any) =>
    apiCall<any>(`/nutrition/plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(plan),
    }),
  
  getMeals: () => apiCall<any[]>('/nutrition/meals'),
  
  getRecipesByDisease: (disease: string) =>
    apiCall<any[]>(`/nutrition/recipes?disease=${encodeURIComponent(disease)}`),
};

// Yoga API
export const yogaAPI = {
  getTrainers: () => apiCall<any[]>('/yoga/trainers'),
  
  getTrainerById: (id: string) => apiCall<any>(`/yoga/trainers/${id}`),
  
  bookSession: (booking: any) =>
    apiCall<any>('/yoga/sessions', {
      method: 'POST',
      body: JSON.stringify(booking),
    }),
  
  getSessionsByPatient: (patientId: string) =>
    apiCall<any[]>(`/yoga/sessions/patient/${patientId}`),
  
  getVideos: () => apiCall<any[]>('/yoga/videos'),
};

// Admin API
export const adminAPI = {
  getStats: () => apiCall<any>('/admin/stats'),

  // Patient management
  getAllPatients: () => apiCall<any[]>('/admin/patients'),
  getPatientById: (id: string) => apiCall<any>(`/admin/patients/${id}`),
  updatePatient: (id: string, patient: any) =>
    apiCall<any>(`/admin/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patient),
    }),
  deletePatient: (id: string) =>
    apiCall<void>(`/admin/patients/${id}`, {
      method: 'DELETE',
    }),

  // Doctor management
  getAllDoctors: () => apiCall<any[]>('/admin/doctors'),
  getDoctorById: (id: string) => apiCall<any>(`/admin/doctors/${id}`),
  updateDoctor: (id: string, doctor: any) =>
    apiCall<any>(`/admin/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(doctor),
    }),
  approveDoctor: (id: string) =>
    apiCall<any>(`/admin/doctors/${id}/approve`, {
      method: 'PUT',
    }),
  suspendDoctor: (id: string) =>
    apiCall<any>(`/admin/doctors/${id}/suspend`, {
      method: 'PUT',
    }),
  deleteDoctor: (id: string) =>
    apiCall<void>(`/admin/doctors/${id}`, {
      method: 'DELETE',
    }),

  // Hospital management
  getAllHospitals: () => apiCall<any[]>('/admin/hospitals'),
  getHospitalById: (id: string) => apiCall<any>(`/admin/hospitals/${id}`),
  updateHospital: (id: string, hospital: any) =>
    apiCall<any>(`/admin/hospitals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hospital),
    }),
  approveHospital: (id: string) =>
    apiCall<any>(`/admin/hospitals/${id}/approve`, {
      method: 'PUT',
    }),
  rejectHospital: (id: string) =>
    apiCall<any>(`/admin/hospitals/${id}/reject`, {
      method: 'PUT',
    }),
  deleteHospital: (id: string) =>
    apiCall<void>(`/admin/hospitals/${id}`, {
      method: 'DELETE',
    }),

  // Appointment management
  getAllAppointments: () => apiCall<any[]>('/admin/appointments'),
  getAppointmentById: (id: string) => apiCall<any>(`/admin/appointments/${id}`),
  updateAppointment: (id: string, appointment: any) =>
    apiCall<any>(`/admin/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointment),
    }),
  cancelAppointment: (id: string) =>
    apiCall<any>(`/admin/appointments/${id}/cancel`, {
      method: 'PUT',
    }),
  completeAppointment: (id: string) =>
    apiCall<any>(`/admin/appointments/${id}/complete`, {
      method: 'PUT',
    }),
  confirmAppointment: (id: string) =>
    apiCall<any>(`/admin/appointments/${id}/confirm`, {
      method: 'PUT',
    }),
  deleteAppointment: (id: string) =>
    apiCall<void>(`/admin/appointments/${id}`, {
      method: 'DELETE',
    }),

  // Pending approvals
  getPendingDoctors: () => apiCall<any[]>('/admin/pending/doctors'),
  getPendingHospitals: () => apiCall<any[]>('/admin/pending/hospitals'),
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
  admin: adminAPI,
};

export default api;
