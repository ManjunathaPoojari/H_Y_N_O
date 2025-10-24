import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Doctor, Hospital, Appointment, Medicine, Prescription, NutritionPlan, Meal, YogaTrainer } from '../types';

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
  yogaTrainers: YogaTrainer[];
  
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
  deleteHospital: (id: string) => void;
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
  
  // Yoga Actions
  addYogaTrainer: (trainer: YogaTrainer) => void;
  updateYogaTrainer: (id: string, trainer: Partial<YogaTrainer>) => void;
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
  const [yogaTrainers, setYogaTrainers] = useState<YogaTrainer[]>([
    {
      id: 'YT001',
      name: 'Yoga Guru Amit',
      specialization: ['Hatha Yoga', 'Power Yoga', 'Vinyasa'],
      experience: 10,
      rating: 4.8,
      availability: ['Morning', 'Evening'],
      sessionFee: 800,
      mode: ['virtual', 'inperson'],
    },
    {
      id: 'YT002',
      name: 'Priya Sharma',
      specialization: ['Prenatal Yoga', 'Restorative Yoga'],
      experience: 7,
      rating: 4.9,
      availability: ['Morning', 'Afternoon'],
      sessionFee: 1000,
      mode: ['virtual', 'inperson'],
    },
  ]);

  // Load data from backend on mount (if enabled)
  useEffect(() => {
    if (USE_BACKEND) {
      loadDataFromBackend();
    }
  }, []);

  const loadDataFromBackend = async () => {
    try {
      // Load different data based on user role
      const userRole = localStorage.getItem('userRole');

      if (userRole === 'admin') {
        // Admin loads all data
        const [patientsData, doctorsData, hospitalsData, appointmentsData, medicinesData] = await Promise.all([
          api.admin.getAllPatients().catch(() => []),
          api.admin.getAllDoctors().catch(() => []),
          api.admin.getAllHospitals().catch(() => []),
          api.admin.getAllAppointments().catch(() => []),
          api.medicines.getAll().catch(() => []),
        ]);

        setPatients(patientsData);
        setDoctors(doctorsData);
        setHospitals(hospitalsData);
        setAppointments(appointmentsData);
        setMedicines(medicinesData);
      } else {
        // Regular users load their own data
        const [patientsData, doctorsData, hospitalsData, appointmentsData, medicinesData] = await Promise.all([
          api.patients.getAll().catch(() => []),
          api.doctors.getAll().catch(() => []),
          api.hospitals.getAll().catch(() => []),
          api.appointments.getAll().catch(() => []),
          api.medicines.getAll().catch(() => []),
        ]);

        setPatients(patientsData);
        setDoctors(doctorsData);
        setHospitals(hospitalsData);
        setAppointments(appointmentsData);
        setMedicines(medicinesData);
      }

      toast.success('Connected to backend successfully!');
    } catch (error) {
      console.log('Backend not available, starting with empty data');
      // Initialize with empty arrays instead of fallback to mock data
      setPatients([]);
      setDoctors([]);
      setHospitals([]);
      setAppointments([]);
      setMedicines([]);
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
        await api.patients.update(id, updatedData);
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
        await api.patients.delete(id);
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
        const newDoctor = await api.doctors.create(doctor);
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
        await api.doctors.update(id, updatedData);
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
        await api.doctors.delete(id);
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
        await api.doctors.approve(id);
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
        await api.doctors.suspend(id);
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
        await api.hospitals.update(id, updatedData);
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

  const deleteHospital = async (id: string) => {
    if (USE_BACKEND) {
      try {
        await api.hospitals.delete(id);
        setHospitals(hospitals.filter(h => h.id !== id));
        toast.success('Hospital removed successfully');
      } catch (error) {
        toast.error('Failed to remove hospital');
      }
    } else {
      setHospitals(hospitals.filter(h => h.id !== id));
      toast.success('Hospital removed successfully');
    }
  };

  const approveHospital = async (id: string) => {
    if (USE_BACKEND) {
      try {
        await api.hospitals.approve(id);
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
        await api.hospitals.reject(id);
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
      } catch (error) {
        toast.error('Failed to book appointment');
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

  // Yoga Actions
  const addYogaTrainer = (trainer: YogaTrainer) => {
    setYogaTrainers([...yogaTrainers, trainer]);
    toast.success('Yoga trainer added');
  };

  const updateYogaTrainer = (id: string, updatedData: Partial<YogaTrainer>) => {
    setYogaTrainers(yogaTrainers.map(t => t.id === id ? { ...t, ...updatedData } : t));
    toast.success('Trainer updated');
  };

  const value: AppStoreContextType = {
    patients,
    doctors,
    hospitals,
    appointments,
    medicines,
    prescriptions,
    nutritionPlans,
    yogaTrainers,
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
    addYogaTrainer,
    updateYogaTrainer,
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
