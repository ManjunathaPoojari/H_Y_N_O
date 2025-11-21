import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Doctor, Hospital, Appointment, Medicine, Prescription, NutritionPlan, Meal, Trainer } from '../types';

import api from './api-client';
import { toast } from 'sonner';
import { USE_BACKEND } from './config';

interface AppStoreContextType {
  // Data
  patients: Patient[];
  doctors: Doctor[];
  hospitals: Hospital[];
  appointments: Appointment[];
  medicines: Medicine[];
  prescriptions: Prescription[];
  nutritionPlans: NutritionPlan[];

  trainers: Trainer[];

  // Data loading functions
  refreshData: () => Promise<void>;

  // Patient Actions
  addPatient: (patient: Patient) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Doctor Actions
  addDoctor: (doctor: Doctor) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  approveDoctor: (id: string) => void;
  suspendDoctor: (id: string) => void;

  // Hospital Actions
  addHospital: (hospital: Hospital) => void;
  updateHospital: (id: string, hospital: Partial<Hospital>) => void;
  deleteHospital: (id: string, mode?: 'unlink' | 'deleteAll') => void;
  approveHospital: (id: string) => void;
  rejectHospital: (id: string) => void;

  // Appointment Actions
  bookAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  cancelAppointment: (id: string) => void;
  completeAppointment: (id: string, notes?: string) => void;
  rescheduleAppointment: (id: string, date: string, time: string) => void;

  // Medicine Actions
  addMedicine: (medicine: Medicine) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;

  // Prescription Actions
  addPrescription: (prescription: Prescription) => void;
  getPrescriptionsByPatient: (patientId: string) => Prescription[];

  // Nutrition Actions
  addNutritionPlan: (plan: NutritionPlan) => void;
  updateNutritionPlan: (id: string, plan: Partial<NutritionPlan>) => void;
  getNutritionPlanByPatient: (patientId: string) => NutritionPlan | undefined;



  // Trainer Actions
  addTrainer: (trainer: Trainer) => void;
  updateTrainer: (id: string, trainer: Partial<Trainer>) => void;
  approveTrainer: (trainerId: string) => void;
  rejectTrainer: (trainerId: string) => void;
  deleteTrainer: (id: string) => void;
  // UI State
  refreshTrigger: number;
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);

export const AppStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);


  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Load data from backend on mount (if enabled)
  useEffect(() => {
    if (USE_BACKEND) {
      loadDataFromBackend();
    }
  }, []);

  const getUserRole = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('userRole');
  };

  const normalizeList = <T,>(data: any): T[] => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.content)) return data.content;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.records)) return data.records;
    if (Array.isArray(data.data)) return data.data;
    return [];
  };

  const loadDataFromBackend = async () => {
    let failedLoads = 0; // Track failed API calls to show single toast

    try {
      // Load different data based on user role
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');

      let patientsData: any[] = [];
      let doctorsData: any[] = [];
      let hospitalsData: any[] = [];
      let appointmentsData: any[] = [];
      let medicinesData: any[] = [];
      let trainerData: any[] = [];

      let nutritionPlansData: any[] = [];

      if (userRole === 'admin') {
        // Admin loads all data - handle each API call separately to prevent one failure from stopping others
        try {
          patientsData = await api.admin.getAllPatients();
        } catch (error) {
          console.warn('Failed to load patients from backend:', error);
          patientsData = [];
          failedLoads++;
        }

        try {
          doctorsData = await api.admin.getAllDoctors();
        } catch (error) {
          console.warn('Failed to load doctors from backend:', error);
          doctorsData = [];
          failedLoads++;
        }

        try {
          hospitalsData = await api.admin.getAllHospitals();
        } catch (error) {
          console.warn('Failed to load hospitals from backend:', error);
          hospitalsData = [];
          failedLoads++;
        }

        try {
          appointmentsData = await api.admin.getAllAppointments();
        } catch (error) {
          console.warn('Failed to load appointments from backend:', error);
          appointmentsData = [];
          failedLoads++;
        }

        try {
          medicinesData = await api.medicines.getAll();
        } catch (error) {
          console.warn('Failed to load medicines from backend:', error);
          medicinesData = [];
          failedLoads++;
        }
      } else if (userRole === 'patient' && userId) {
        // Patient loads their data
        try {
          patientsData = await api.patients.getAll();
        } catch (error) {
          console.warn('Failed to load patients from backend:', error);
          patientsData = [];
          failedLoads++;
        }

        try {
          doctorsData = await api.doctors.getAll();
        } catch (error) {
          console.warn('Failed to load doctors from backend:', error);
          doctorsData = [];
          failedLoads++;
        }

        try {
          hospitalsData = await api.hospitals.getAll();
        } catch (error) {
          console.warn('Failed to load hospitals from backend:', error);
          hospitalsData = [];
          failedLoads++;
        }

        try {
          appointmentsData = await api.appointments.getByPatient(userId);
          // Normalize status and type values to lowercase for frontend consistency
          appointmentsData = appointmentsData.map(apt => ({
            ...apt,
            status: apt.status?.toLowerCase() === 'upcoming' ? 'booked' : apt.status?.toLowerCase(),
            type: apt.type?.toLowerCase(),
            date: apt.appointmentDate,
            time: apt.appointmentTime,
          }));
        } catch (error) {
          console.warn('Failed to load appointments from backend:', error);
          appointmentsData = [];
          failedLoads++;
        }

        try {
          medicinesData = await api.medicines.getAll();
        } catch (error) {
          console.warn('Failed to load medicines from backend:', error);
          medicinesData = [];
          failedLoads++;
        }
      } else if (userRole === 'doctor' && userId) {
        // Doctor loads their data
        try {
          patientsData = await api.doctors.getPatients(userId);
        } catch (error) {
          console.warn('Failed to load patients from backend:', error);
          patientsData = [];
          failedLoads++;
        }

        try {
          doctorsData = await api.doctors.getAll();
        } catch (error) {
          console.warn('Failed to load doctors from backend:', error);
          doctorsData = [];
          failedLoads++;
        }

        try {
          hospitalsData = await api.hospitals.getAll();
        } catch (error) {
          console.warn('Failed to load hospitals from backend:', error);
          hospitalsData = [];
          failedLoads++;
        }

        try {
          appointmentsData = await api.appointments.getByDoctor(userId);
          // Normalize status and type values to lowercase for frontend consistency
          appointmentsData = appointmentsData.map(apt => ({
            ...apt,
            status: apt.status?.toLowerCase() === 'upcoming' ? 'booked' : apt.status?.toLowerCase(),
            type: apt.type?.toLowerCase(),
            date: apt.appointmentDate,
            time: apt.appointmentTime,
          }));
        } catch (error) {
          console.warn('Failed to load appointments from backend:', error);
          appointmentsData = [];
          failedLoads++;
        }

        try {
          medicinesData = await api.medicines.getAll();
        } catch (error) {
          console.warn('Failed to load medicines from backend:', error);
          medicinesData = [];
          failedLoads++;
        }
      } else if (userRole === 'hospital' && userId) {
        // Hospital loads their data
        try {
          doctorsData = await api.hospitals.getDoctors(userId);
        } catch (error) {
          console.warn('Failed to load doctors from backend:', error);
          doctorsData = [];
          failedLoads++;
        }

        try {
          patientsData = await api.hospitals.getPatients(userId);
        } catch (error) {
          console.warn('Failed to load patients from backend:', error);
          patientsData = [];
          failedLoads++;
        }

        try {
          hospitalsData = await api.hospitals.getAll();
        } catch (error) {
          console.warn('Failed to load hospitals from backend:', error);
          hospitalsData = [];
          failedLoads++;
        }

        try {
          appointmentsData = await api.appointments.getAll();
          // Filter appointments for this hospital and normalize status
          appointmentsData = appointmentsData.filter(apt => apt.hospital?.id === userId || apt.hospitalId === userId);
          appointmentsData = appointmentsData.map(apt => ({
            ...apt,
            status: apt.status?.toLowerCase() === 'upcoming' ? 'booked' : apt.status?.toLowerCase(),
            type: apt.type?.toLowerCase(),
            date: apt.appointmentDate,
            time: apt.appointmentTime,
          }));
        } catch (error) {
          console.warn('Failed to load appointments from backend:', error);
          appointmentsData = [];
          failedLoads++;
        }

        try {
          medicinesData = await api.medicines.getAll();
        } catch (error) {
          console.warn('Failed to load medicines from backend:', error);
          medicinesData = [];
          failedLoads++;
        }
      } else {
        // Fallback for other roles or no userId - load general data
        try {
          patientsData = await api.patients.getAll();
        } catch (error) {
          console.warn('Failed to load patients from backend:', error);
          patientsData = [];
          failedLoads++;
        }

        try {
          doctorsData = await api.doctors.getAll();
        } catch (error) {
          console.warn('Failed to load doctors from backend:', error);
          doctorsData = [];
          failedLoads++;
        }

        try {
          hospitalsData = await api.hospitals.getAll();
        } catch (error) {
          console.warn('Failed to load hospitals from backend:', error);
          hospitalsData = [];
          failedLoads++;
        }

        try {
          appointmentsData = await api.appointments.getAll();
        } catch (error) {
          console.warn('Failed to load appointments from backend:', error);
          appointmentsData = [];
          failedLoads++;
        }

        try {
          medicinesData = await api.medicines.getAll();
        } catch (error) {
          console.warn('Failed to load medicines from backend:', error);
          medicinesData = [];
          failedLoads++;
        }
      }

      const normalizedPatients = normalizeList<Patient>(patientsData);
      const normalizedDoctors = normalizeList<Doctor>(doctorsData);
      const normalizedHospitals = normalizeList<Hospital>(hospitalsData);
      const normalizedAppointments = normalizeList<any>(appointmentsData);
      try {
        trainerData = await api.trainers.getAll();
      } catch (error) {
        console.warn('Failed to load trainers from backend:', error);
        trainerData = [];
        failedLoads++;
      }

      try {
        // Also fetch pending counts if needed, or just rely on the components to fetch them
        setRefreshTrigger(prev => prev + 1);
      } catch (error) {
        console.error('Error loading data from backend:', error);
        toast.error('Failed to load data from backend');
      }


      try {
        nutritionPlansData = await api.nutrition.getPlans();
      } catch (error) {
        console.warn('Failed to load nutrition plans from backend:', error);
        nutritionPlansData = [];
        failedLoads++;
      }

      const normalizedMedicines = normalizeList<Medicine>(medicinesData);
      const normalizedTrainers = normalizeList<Trainer>(trainerData);

      const normalizedNutrition = normalizeList<NutritionPlan>(nutritionPlansData);

      setPatients(normalizedPatients);
      setDoctors(normalizedDoctors);
      setHospitals(normalizedHospitals);
      setAppointments(
        normalizedAppointments.map(apt => ({
          ...apt,
          status: apt.status?.toLowerCase() === 'upcoming' ? 'booked' : apt.status?.toLowerCase(),
          type: apt.type?.toLowerCase(),
          date: apt.appointmentDate,
          time: apt.appointmentTime,
        })),
      );
      setMedicines(normalizedMedicines);
      setTrainers(normalizedTrainers);

      setNutritionPlans(normalizedNutrition);

      // Show single toast if any loads failed
      if (failedLoads > 0) {
        toast.error('Unable to load some data from backend. Continuing in offline mode with available data.');
      }

      // Only show success toast if at least some data was loaded
      const hasData =
        normalizedPatients.length > 0 ||
        normalizedDoctors.length > 0 ||
        normalizedHospitals.length > 0 ||
        normalizedAppointments.length > 0 ||
        normalizedMedicines.length > 0;
      if (hasData) {
        // toast.success('Connected to backend successfully!');
      }
    } catch (error) {
      console.warn('Backend initialization error, starting with empty data:', error);
      let failedLoads = 5; // Assume all 5 loads failed in outer catch
      // Initialize with empty arrays
      setPatients([]);
      setDoctors([]);
      setHospitals([]);
      setAppointments([]);
      setMedicines([]);

      // Show toast for outer catch
      toast.error('Unable to load some data from backend. Continuing in offline mode with available data.');
    }
  };

  // Patient Actions
  const addPatient = async (patient: Patient) => {
    if (USE_BACKEND) {
      try {
        const newPatient = await api.patients.create(patient);
        setPatients([...patients, newPatient]);
        toast.success('Patient added successfully');
      } catch (error) {
        toast.error('Failed to add patient');
      }
    } else {
      setPatients([...patients, patient]);
      toast.success('Patient added successfully');
    }
  };

  const updatePatient = async (id: string, updatedData: Partial<Patient>) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.updatePatient(id, updatedData);
        } else {
          await api.patients.update(id, updatedData);
        }
        setPatients(patients.map(p => p.id === id ? { ...p, ...updatedData } : p));
        toast.success('Patient updated successfully');
      } catch (error) {
        toast.error('Failed to update patient');
      }
    } else {
      setPatients(patients.map(p => p.id === id ? { ...p, ...updatedData } : p));
      toast.success('Patient updated successfully');
    }
  };

  const deletePatient = async (id: string) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.deletePatient(id);
        } else {
          await api.patients.delete(id);
        }
        setPatients(patients.filter(p => p.id !== id));
        toast.success('Patient deleted successfully');
      } catch (error) {
        toast.error('Failed to delete patient');
      }
    } else {
      setPatients(patients.filter(p => p.id !== id));
      toast.success('Patient deleted successfully');
    }
  };

  // Doctor Actions
  const addDoctor = async (doctor: Doctor) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        const newDoctor =
          userRole === 'admin' ? await api.admin.createDoctor(doctor) : await api.doctors.create(doctor);
        setDoctors([...doctors, newDoctor]);
        toast.success('Doctor added successfully');
      } catch (error) {
        toast.error('Failed to add doctor');
      }
    } else {
      setDoctors([...doctors, doctor]);
      toast.success('Doctor added successfully');
    }
  };

  const updateDoctor = async (id: string, updatedData: Partial<Doctor>) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.updateDoctor(id, updatedData);
        } else {
          await api.doctors.update(id, updatedData);
        }
        setDoctors(doctors.map(d => d.id === id ? { ...d, ...updatedData } : d));
        toast.success('Doctor updated successfully');
      } catch (error) {
        toast.error('Failed to update doctor');
      }
    } else {
      setDoctors(doctors.map(d => d.id === id ? { ...d, ...updatedData } : d));
      toast.success('Doctor updated successfully');
    }
  };

  const deleteDoctor = async (id: string) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.deleteDoctor(id);
        } else {
          await api.doctors.delete(id);
        }
        setDoctors(doctors.filter(d => d.id !== id));
        toast.success('Doctor removed successfully');
      } catch (error) {
        toast.error('Failed to remove doctor');
      }
    } else {
      setDoctors(doctors.filter(d => d.id !== id));
      toast.success('Doctor removed successfully');
    }
  };

  const approveDoctor = async (id: string) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.approveDoctor(id);
        } else {
          await api.doctors.approve(id);
        }
        setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'approved' } : d));
        toast.success('Doctor approved successfully');
      } catch (error) {
        toast.error('Failed to approve doctor');
      }
    } else {
      setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'approved' } : d));
      toast.success('Doctor approved successfully');
    }
  };

  const suspendDoctor = async (id: string) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.suspendDoctor(id);
        } else {
          await api.doctors.suspend(id);
        }
        setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'suspended' } : d));
        toast.success('Doctor suspended');
      } catch (error) {
        toast.error('Failed to suspend doctor');
      }
    } else {
      setDoctors(doctors.map(d => d.id === id ? { ...d, status: 'suspended' } : d));
      toast.success('Doctor suspended');
    }
  };

  // Hospital Actions
  const addHospital = async (hospital: Hospital) => {
    if (USE_BACKEND) {
      try {
        const newHospital = await api.hospitals.create(hospital);
        setHospitals([...hospitals, newHospital]);
        toast.success('Hospital added successfully');
      } catch (error) {
        toast.error('Failed to add hospital');
      }
    } else {
      setHospitals([...hospitals, hospital]);
      toast.success('Hospital added successfully');
    }
  };

  const updateHospital = async (id: string, updatedData: Partial<Hospital>) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.updateHospital(id, updatedData);
        } else {
          await api.hospitals.update(id, updatedData);
        }
        setHospitals(hospitals.map(h => h.id === id ? { ...h, ...updatedData } : h));
        toast.success('Hospital updated successfully');
      } catch (error) {
        toast.error('Failed to update hospital');
      }
    } else {
      setHospitals(hospitals.map(h => h.id === id ? { ...h, ...updatedData } : h));
      toast.success('Hospital updated successfully');
    }
  };

  const deleteHospital = async (id: string, mode: 'unlink' | 'deleteAll' = 'unlink') => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.deleteHospital(id, mode);
        } else {
          await api.hospitals.delete(id, mode);
        }
        setHospitals(hospitals.filter(h => h.id !== id));
        toast.success('Hospital removed successfully');
      } catch (error) {
        toast.error('Failed to remove hospital');
        throw error;
      }
    } else {
      setHospitals(hospitals.filter(h => h.id !== id));
      toast.success('Hospital removed successfully');
    }
  };

  const approveHospital = async (id: string) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.approveHospital(id);
        } else {
          await api.hospitals.approve(id);
        }
        setHospitals(hospitals.map(h => h.id === id ? { ...h, status: 'approved' } : h));
        toast.success('Hospital approved successfully');
      } catch (error) {
        toast.error('Failed to approve hospital');
      }
    } else {
      setHospitals(hospitals.map(h => h.id === id ? { ...h, status: 'approved' } : h));
      toast.success('Hospital approved successfully');
    }
  };

  const rejectHospital = async (id: string) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.rejectHospital(id);
        } else {
          await api.hospitals.reject(id);
        }
        setHospitals(hospitals.map(h => h.id === id ? { ...h, status: 'rejected' } : h));
        toast.success('Hospital rejected');
      } catch (error) {
        toast.error('Failed to reject hospital');
      }
    } else {
      setHospitals(hospitals.map(h => h.id === id ? { ...h, status: 'rejected' } : h));
      toast.success('Hospital rejected');
    }
  };

  // Appointment Actions
  const bookAppointment = async (appointmentData: Omit<Appointment, 'id'>) => {
    if (USE_BACKEND) {
      try {
        const newAppointment = await api.appointments.create(appointmentData);
        setAppointments([...appointments, newAppointment]);
        toast.success('Appointment booked successfully!');
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to book appointment';
        toast.error(errorMessage);
      }
    } else {
      const newAppointment: Appointment = {
        ...appointmentData,
        id: `APT${String(appointments.length + 1).padStart(3, '0')}`,
      };
      setAppointments([...appointments, newAppointment]);
      toast.success('Appointment booked successfully!');
    }
  };

  const updateAppointment = async (id: string, updatedData: Partial<Appointment>) => {
    if (USE_BACKEND) {
      try {
        await api.appointments.update(id, updatedData);
        setAppointments(appointments.map(a => a.id === id ? { ...a, ...updatedData } : a));
        toast.success('Appointment updated');
      } catch (error) {
        toast.error('Failed to update appointment');
      }
    } else {
      setAppointments(appointments.map(a => a.id === id ? { ...a, ...updatedData } : a));
      toast.success('Appointment updated');
    }
  };

  const cancelAppointment = async (id: string) => {
    if (USE_BACKEND) {
      try {
        await api.appointments.cancel(id);
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
        toast.success('Appointment cancelled');
      } catch (error) {
        toast.error('Failed to cancel appointment');
      }
    } else {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
      toast.success('Appointment cancelled');
    }
  };

  const completeAppointment = async (id: string, notes?: string) => {
    if (USE_BACKEND) {
      try {
        await api.appointments.complete(id, notes);
        setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'completed', notes } : a));
        toast.success('Appointment completed');
      } catch (error) {
        toast.error('Failed to complete appointment');
      }
    } else {
      setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'completed', notes } : a));
      toast.success('Appointment completed');
    }
  };

  const rescheduleAppointment = async (id: string, date: string, time: string) => {
    if (USE_BACKEND) {
      try {
        await api.appointments.reschedule(id, date, time);
        setAppointments(appointments.map(a => a.id === id ? { ...a, date, time } : a));
        toast.success('Appointment rescheduled');
      } catch (error) {
        toast.error('Failed to reschedule appointment');
      }
    } else {
      setAppointments(appointments.map(a => a.id === id ? { ...a, date, time } : a));
      toast.success('Appointment rescheduled');
    }
  };

  // Medicine Actions
  const addMedicine = async (medicine: Medicine) => {
    if (USE_BACKEND) {
      try {
        const newMedicine = await api.medicines.create(medicine);
        setMedicines([...medicines, newMedicine]);
        toast.success('Medicine added successfully');
      } catch (error) {
        toast.error('Failed to add medicine');
      }
    } else {
      setMedicines([...medicines, medicine]);
      toast.success('Medicine added successfully');
    }
  };

  const updateMedicine = async (id: string, updatedData: Partial<Medicine>) => {
    if (USE_BACKEND) {
      try {
        await api.medicines.update(id, updatedData);
        setMedicines(medicines.map(m => m.id === id ? { ...m, ...updatedData } : m));
        toast.success('Medicine updated successfully');
      } catch (error) {
        toast.error('Failed to update medicine');
      }
    } else {
      setMedicines(medicines.map(m => m.id === id ? { ...m, ...updatedData } : m));
      toast.success('Medicine updated successfully');
    }
  };

  const deleteMedicine = async (id: string) => {
    if (USE_BACKEND) {
      try {
        await api.medicines.delete(id);
        setMedicines(medicines.filter(m => m.id !== id));
        toast.success('Medicine deleted successfully');
      } catch (error) {
        toast.error('Failed to delete medicine');
      }
    } else {
      setMedicines(medicines.filter(m => m.id !== id));
      toast.success('Medicine deleted successfully');
    }
  };

  // Prescription Actions
  const addPrescription = (prescription: Prescription) => {
    setPrescriptions([...prescriptions, prescription]);
    toast.success('Prescription added successfully');
  };

  const getPrescriptionsByPatient = (patientId: string) => {
    return prescriptions.filter(p => p.patientId === patientId);
  };

  // Nutrition Actions
  const addNutritionPlan = (plan: NutritionPlan) => {
    setNutritionPlans([...nutritionPlans, plan]);
    toast.success('Nutrition plan created');
  };

  const updateNutritionPlan = (id: string, updatedData: Partial<NutritionPlan>) => {
    setNutritionPlans(nutritionPlans.map(n => n.id === id ? { ...n, ...updatedData } : n));
    toast.success('Nutrition plan updated');
  };

  const getNutritionPlanByPatient = (patientId: string) => {
    return nutritionPlans.find(n => n.patientId === patientId);
  };



  // Trainer Actions
  const addTrainer = async (trainer: Trainer) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        let newTrainer;
        if (userRole === 'admin' && api.admin.createTrainer) {
          newTrainer = await api.admin.createTrainer(trainer);
        } else {
          newTrainer = await api.trainers.create(trainer);
        }
        setTrainers([...trainers, newTrainer]);
        toast.success('Trainer added successfully');
      } catch (error: any) {
        console.error('Failed to add trainer:', error);
        const errorMessage = error?.message || 'Failed to add trainer';
        toast.error(errorMessage);
        throw error; // Re-throw to let the caller handle it
      }
    } else {
      setTrainers([...trainers, trainer]);
      toast.success('Trainer added successfully');
    }
  };

  const updateTrainer = async (id: string, updatedData: Partial<Trainer>) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          if (api.admin.updateTrainer) {
            await api.admin.updateTrainer(id, updatedData);
          } else {
            await api.trainers.update(id, updatedData);
          }
        } else {
          await api.trainers.update(id, updatedData);
        }
        setTrainers(trainers.map(t => t.id === id ? { ...t, ...updatedData } : t));
        toast.success('Trainer updated successfully');
      } catch (error) {
        toast.error('Failed to update trainer');
      }
    } else {
      setTrainers(trainers.map(t => t.id === id ? { ...t, ...updatedData } : t));
      toast.success('Trainer updated successfully');
    }
  };

  const deleteTrainer = async (id: string) => {
    if (USE_BACKEND) {
      try {
        const userRole = getUserRole();
        if (userRole === 'admin') {
          await api.admin.deleteTrainer(id);
        } else {
          await api.trainers.delete(id);
        }
        setTrainers(trainers.filter(t => t.id !== id));
        toast.success('Trainer removed successfully');
      } catch (error) {
        toast.error('Failed to remove trainer');
      }
    } else {
      setTrainers(trainers.filter(t => t.id !== id));
      toast.success('Trainer removed successfully');
    }
  };

  const approveTrainer = async (trainerId: string) => {
    if (USE_BACKEND) {
      try {
        await api.admin.approveTrainer(trainerId);
        setTrainers(trainers.map(t => t.id === trainerId ? { ...t, status: 'approved' } : t));
        toast.success('Trainer approved successfully');
      } catch (error) {
        toast.error('Failed to approve trainer');
      }
    } else {
      setTrainers(trainers.map(t => t.id === trainerId ? { ...t, status: 'approved' } : t));
      toast.success('Trainer approved successfully');
    }
  };

  const rejectTrainer = async (trainerId: string) => {
    if (USE_BACKEND) {
      try {
        await api.admin.rejectTrainer(trainerId);
        setTrainers(trainers.map(t => t.id === trainerId ? { ...t, status: 'rejected' } : t));
        toast.success('Trainer rejected');
      } catch (error) {
        toast.error('Failed to reject trainer');
      }
    } else {
      setTrainers(trainers.map(t => t.id === trainerId ? { ...t, status: 'rejected' } : t));
      toast.success('Trainer rejected');
    }
  };

  const value: AppStoreContextType = {
    patients,
    doctors,
    hospitals,
    appointments,
    medicines,
    prescriptions,
    nutritionPlans,

    trainers,
    refreshData: loadDataFromBackend,
    addPatient,
    updatePatient,
    deletePatient,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    approveDoctor,
    suspendDoctor,
    addHospital,
    updateHospital,
    deleteHospital,
    approveHospital,
    rejectHospital,
    bookAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment,
    rescheduleAppointment,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    addPrescription,
    getPrescriptionsByPatient,
    addNutritionPlan,
    updateNutritionPlan,
    getNutritionPlanByPatient,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    approveTrainer,
    rejectTrainer,
    refreshTrigger,
  };

  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};
