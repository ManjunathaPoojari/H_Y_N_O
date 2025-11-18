import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Patient, Doctor, Hospital, Appointment, Medicine, Prescription, NutritionPlan, Meal, YogaTrainer, Trainer } from '../types';

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

  // Trainer Actions
  addTrainer: (trainer: Trainer) => void;
  updateTrainer: (id: string, trainer: Partial<Trainer>) => void;
  deleteTrainer: (id: string) => void;
  approveTrainer: (trainerId: string) => void;
  rejectTrainer: (trainerId: string) => void;
}

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);

export const AppStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "John Doe",
      email: "patient@example.com",
      phone: "1234567890",
      age: 30,
      gender: "Male",
      bloodGroup: "O+",
      dateOfBirth: "1994-01-15",
      allergies: ["Penicillin", "Peanuts"],
      medicalHistory: ["Hypertension", "Diabetes"],
      currentMedications: ["Metformin 500mg", "Lisinopril 10mg"],
      address: "123 Main St, City, State",
      emergencyContact: "Jane Doe - 0987654321",
      notes: "Patient has been compliant with medication regimen",
      createdAt: new Date().toISOString(),
      hospitalId: "hospital-1",
    },
    {
      id: "patient-2",
      name: "Alice Johnson",
      email: "patient2@example.com",
      phone: "2345678901",
      age: 28,
      gender: "Female",
      bloodGroup: "A+",
      dateOfBirth: "1996-03-22",
      allergies: [],
      medicalHistory: [],
      currentMedications: [],
      address: "",
      emergencyContact: "",
      notes: "",
      createdAt: new Date().toISOString(),
      hospitalId: "",
    },
    {
      id: "patient-3",
      name: "Robert Brown",
      email: "patient3@example.com",
      phone: "3456789012",
      age: 45,
      gender: "Male",
      bloodGroup: "B+",
      dateOfBirth: "1979-05-10",
      allergies: [],
      medicalHistory: [],
      currentMedications: [],
      address: "",
      emergencyContact: "",
      notes: "",
      createdAt: new Date().toISOString(),
      hospitalId: "",
    },
    {
      id: "patient-4",
      name: "Emma Wilson",
      email: "patient4@example.com",
      phone: "4567890123",
      age: 32,
      gender: "Female",
      bloodGroup: "AB-",
      dateOfBirth: "1992-08-15",
      allergies: [],
      medicalHistory: [],
      currentMedications: [],
      address: "",
      emergencyContact: "",
      notes: "",
      createdAt: new Date().toISOString(),
      hospitalId: "",
    },
    {
      id: "patient-5",
      name: "Michael Davis",
      email: "patient5@example.com",
      phone: "5678901234",
      age: 50,
      gender: "Male",
      bloodGroup: "O-",
      dateOfBirth: "1974-12-01",
      allergies: [],
      medicalHistory: [],
      currentMedications: [],
      address: "",
      emergencyContact: "",
      notes: "",
      createdAt: new Date().toISOString(),
      hospitalId: "",
    },
  ]);

  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: 'D001',
      name: 'Dr. Sarah Mitchell',
      email: 'sarah.mitchell@hospital.com',
      phone: '+1-555-0201',
      specialization: 'Cardiology',
      qualification: 'MD, FACC',
      experience: 12,
      rating: 4.8,
      available: true,
      hospitalId: 'H001',
      consultationFee: 250,
      avatarUrl: '/placeholder/150/150',
      status: 'approved',
    },
    {
      id: 'D002',
      name: 'Dr. Michael Chen',
      email: 'michael.chen@hospital.com',
      phone: '+1-555-0202',
      specialization: 'Internal Medicine',
      qualification: 'MD',
      experience: 8,
      rating: 4.6,
      available: true,
      hospitalId: 'H001',
      consultationFee: 200,
      avatarUrl: '/placeholder/150/150',
      status: 'approved',
    },
    {
      id: 'D003',
      name: 'Dr. Emily Rodriguez',
      email: 'emily.rodriguez@hospital.com',
      phone: '+1-555-0203',
      specialization: 'Pediatrics',
      qualification: 'MD, FAAP',
      experience: 10,
      rating: 4.9,
      available: true,
      hospitalId: 'H001',
      consultationFee: 180,
      avatarUrl: '/placeholder/150/150',
      status: 'approved',
    },
    {
      id: 'D004',
      name: 'Dr. James Thompson',
      email: 'james.thompson@hospital.com',
      phone: '+1-555-0204',
      specialization: 'Orthopedics',
      qualification: 'MD, FAAOS',
      experience: 15,
      rating: 4.7,
      available: false,
      hospitalId: 'H001',
      consultationFee: 300,
      avatarUrl: '/placeholder/150/150',
      status: 'approved',
    },
    {
      id: 'D005',
      name: 'Dr. Lisa Park',
      email: 'lisa.park@hospital.com',
      phone: '+1-555-0205',
      specialization: 'Dermatology',
      qualification: 'MD',
      experience: 6,
      rating: 4.5,
      available: true,
      hospitalId: 'H001',
      consultationFee: 220,
      avatarUrl: '/placeholder/150/150',
      status: 'approved',
    },
  ]);

  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      id: 'hospital-1',
      name: 'City General Hospital',
      email: 'hospital@example.com',
      phone: '1122334455',
      address: '123 Main St, City, State',
      city: 'New York',
      state: 'NY',
      totalDoctors: 5,
      facilities: ['Emergency Care', 'Surgery', 'Radiology', 'Laboratory', 'Pharmacy', 'ICU'],
      status: 'approved',
      registrationNumber: 'HOSP001',
    },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'A001',
      patientId: 'P001',
      patientName: 'John Doe',
      doctorId: 'D001',
      doctorName: 'Dr. Sarah Mitchell',
      hospitalId: 'H001',
      type: 'inperson',
      date: '2024-01-15',
      time: '10:00',
      status: 'completed',
      reason: 'Regular checkup',
      notes: 'Blood pressure normal, continue current medication',
    },
    {
      id: 'A002',
      patientId: 'P002',
      patientName: 'Jane Smith',
      doctorId: 'D002',
      doctorName: 'Dr. Michael Chen',
      hospitalId: 'H001',
      type: 'inperson',
      date: '2024-01-16',
      time: '14:30',
      status: 'completed',
      reason: 'Asthma follow-up',
      notes: 'Asthma well controlled, adjust inhaler usage',
    },
    {
      id: 'A003',
      patientId: 'P003',
      patientName: 'Robert Johnson',
      doctorId: 'D001',
      doctorName: 'Dr. Sarah Mitchell',
      hospitalId: 'H001',
      type: 'inperson',
      date: '2024-01-17',
      time: '09:00',
      status: 'completed',
      reason: 'Cardiac consultation',
      notes: 'EKG shows normal sinus rhythm, continue medications',
    },
    {
      id: 'A004',
      patientId: 'P004',
      patientName: 'Maria Garcia',
      doctorId: 'D005',
      doctorName: 'Dr. Lisa Park',
      hospitalId: 'H001',
      type: 'inperson',
      date: '2024-01-18',
      time: '11:15',
      status: 'booked',
      reason: 'Thyroid check',
    },
    {
      id: 'A005',
      patientId: 'P005',
      patientName: 'David Wilson',
      doctorId: 'D002',
      doctorName: 'Dr. Michael Chen',
      hospitalId: 'H001',
      type: 'video',
      date: '2024-01-19',
      time: '15:00',
      status: 'booked',
      reason: 'Arthritis management',
    },
    {
      id: 'A006',
      patientId: 'P001',
      patientName: 'John Doe',
      doctorId: 'D003',
      doctorName: 'Dr. Emily Rodriguez',
      hospitalId: 'H001',
      type: 'inperson',
      date: '2024-01-20',
      time: '13:30',
      status: 'pending',
      reason: 'Follow-up consultation',
    },
    {
      id: 'A007',
      patientId: 'P002',
      patientName: 'Jane Smith',
      doctorId: 'D004',
      doctorName: 'Dr. James Thompson',
      hospitalId: 'H001',
      type: 'inperson',
      date: '2024-01-21',
      time: '10:30',
      status: 'cancelled',
      reason: 'Knee pain assessment',
    },
  ]);

  const [medicines, setMedicines] = useState<Medicine[]>([
    {
      id: 'M001',
      name: 'Lisinopril',
      description: 'ACE inhibitor for hypertension',
      price: 15.99,
      stock: 150,
      category: 'Cardiovascular',
      manufacturer: 'Generic Pharma',
      requiresPrescription: true,
    },
    {
      id: 'M002',
      name: 'Albuterol Inhaler',
      description: 'Bronchodilator for asthma',
      price: 45.50,
      stock: 75,
      category: 'Respiratory',
      manufacturer: 'AstraZeneca',
      requiresPrescription: true,
    },
    {
      id: 'M003',
      name: 'Metformin',
      description: 'Oral diabetes medication',
      price: 12.25,
      stock: 200,
      category: 'Endocrine',
      manufacturer: 'Generic Pharma',
      requiresPrescription: true,
    },
    {
      id: 'M004',
      name: 'Ibuprofen',
      description: 'NSAID for pain and inflammation',
      price: 8.99,
      stock: 300,
      category: 'Pain Relief',
      manufacturer: 'Generic Pharma',
      requiresPrescription: false,
    },
    {
      id: 'M005',
      name: 'Levothyroxine',
      description: 'Thyroid hormone replacement',
      price: 22.75,
      stock: 100,
      category: 'Endocrine',
      manufacturer: 'AbbVie',
      requiresPrescription: true,
    },
  ]);

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

  const [trainers, setTrainers] = useState<Trainer[]>([
    {
      id: 'T001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0101',
      trainerType: 'Fitness Trainer',
      experienceYears: 8,
      location: 'New York',
      pricePerSession: 75,
      bio: 'Certified personal trainer with 8 years of experience in strength training and weight loss programs.',
      specialties: ['Strength Training', 'Weight Loss', 'HIIT'],
      qualifications: ['NASM-CPT', 'ACSM'],
      languages: ['English', 'Spanish'],
      modes: ['in-person', 'virtual'],
      status: 'approved',
      rating: 4.7,
      reviews: 45,
      profileImage: '/placeholder/150/150',
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 'T002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1-555-0102',
      trainerType: 'Yoga Instructor',
      experienceYears: 6,
      location: 'Los Angeles',
      pricePerSession: 65,
      bio: 'Passionate yoga instructor specializing in Vinyasa and restorative yoga for all levels.',
      specialties: ['Vinyasa Yoga', 'Restorative Yoga', 'Meditation'],
      qualifications: ['RYT-500', 'Prenatal Yoga Certified'],
      languages: ['English', 'French'],
      modes: ['in-person', 'virtual'],
      status: 'approved',
      rating: 4.9,
      reviews: 32,
      profileImage: '/placeholder/150/150',
      createdAt: '2024-02-20T14:30:00Z',
    },
  ]);

  // Load data from backend on mount (if enabled)
  useEffect(() => {
    if (USE_BACKEND) {
      loadDataFromBackend();
    }
  }, []);

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
      }

      setPatients(patientsData);
      setDoctors(doctorsData);
      setHospitals(hospitalsData);
      setAppointments(appointmentsData);
      setMedicines(medicinesData);

      // Show single toast if any loads failed
      if (failedLoads > 0) {
        toast.error('Unable to load some data from backend. Continuing in offline mode with available data.');
      }

      // Only show success toast if at least some data was loaded
      const hasData = patientsData.length > 0 || doctorsData.length > 0 || hospitalsData.length > 0 ||
                     appointmentsData.length > 0 || medicinesData.length > 0;
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

  // Yoga Actions
  const addYogaTrainer = (trainer: YogaTrainer) => {
    setYogaTrainers([...yogaTrainers, trainer]);
    toast.success('Yoga trainer added');
  };

  const updateYogaTrainer = (id: string, updatedData: Partial<YogaTrainer>) => {
    setYogaTrainers(yogaTrainers.map(t => t.id === id ? { ...t, ...updatedData } : t));
    toast.success('Trainer updated');
  };

  // Trainer Actions
  const addTrainer = async (trainer: Trainer) => {
    if (USE_BACKEND) {
      try {
        const newTrainer = await api.trainers.create(trainer);
        setTrainers([...trainers, newTrainer]);
        toast.success('Trainer added successfully');
      } catch (error) {
        toast.error('Failed to add trainer');
      }
    } else {
      setTrainers([...trainers, trainer]);
      toast.success('Trainer added successfully');
    }
  };

  const updateTrainer = async (id: string, updatedData: Partial<Trainer>) => {
    if (USE_BACKEND) {
      try {
        await api.trainers.update(id, updatedData);
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
        await api.trainers.delete(id);
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
        await api.trainers.approve(trainerId);
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
        await api.trainers.reject(trainerId);
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
    yogaTrainers,
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
    addYogaTrainer,
    updateYogaTrainer,
    addTrainer,
    updateTrainer,
    deleteTrainer,
    approveTrainer,
    rejectTrainer,
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
