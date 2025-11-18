package com.hyno;

import com.hyno.entity.Admin;
import com.hyno.entity.Patient;
import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
import com.hyno.entity.Appointment;
import com.hyno.entity.ChatRoom;
import com.hyno.entity.ChatMessage;
import com.hyno.entity.Medicine;
import com.hyno.repository.AdminRepository;
import com.hyno.repository.PatientRepository;
import com.hyno.repository.DoctorRepository;
import com.hyno.repository.HospitalRepository;
import com.hyno.repository.AppointmentRepository;
import com.hyno.repository.ChatRoomRepository;
import com.hyno.repository.ChatMessageRepository;
import com.hyno.repository.MedicineRepository;
import com.hyno.repository.HospitalDoctorRepository;
import com.hyno.entity.HospitalDoctor;
import com.hyno.entity.HospitalDoctorId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private MedicineRepository medicineRepository;

    @Autowired
    private HospitalDoctorRepository hospitalDoctorRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        // Create sample patients
        if (patientRepository.findByEmail("patient@example.com").isEmpty()) {
            Patient patient = new Patient();
            patient.setId("1");
            patient.setName("John Doe");
            patient.setEmail("patient@example.com");
            patient.setPhone("1234567890");
            patient.setPassword(passwordEncoder.encode("password123"));
            patient.setAge(30);
            patient.setGender("Male");
            patient.setBloodGroup("O+");
            patient.setDateOfBirth(LocalDate.parse("1994-01-15"));
            patient.setAddress("123 Main St, City, State");
            patient.setEmergencyContact("Jane Doe - 0987654321");
            patient.setAllergies(List.of("Penicillin", "Peanuts"));
            patient.setMedicalHistory(List.of("Hypertension", "Diabetes"));
            patient.setCurrentMedications(List.of("Metformin 500mg", "Lisinopril 10mg"));
            patient.setNotes("Patient has been compliant with medication regimen");
            patientRepository.save(patient);
        }

        if (patientRepository.findByEmail("patient2@example.com").isEmpty()) {
            Patient patient2 = new Patient();
            patient2.setId("patient-2");
            patient2.setName("Alice Johnson");
            patient2.setEmail("patient2@example.com");
            patient2.setPhone("2345678901");
            patient2.setPassword(passwordEncoder.encode("password123"));
            patientRepository.save(patient2);
        }

        if (patientRepository.findByEmail("patient3@example.com").isEmpty()) {
            Patient patient3 = new Patient();
            patient3.setId("patient-3");
            patient3.setName("Robert Brown");
            patient3.setEmail("patient3@example.com");
            patient3.setPhone("3456789012");
            patient3.setPassword(passwordEncoder.encode("password123"));
            patientRepository.save(patient3);
        }

        if (patientRepository.findByEmail("patient4@example.com").isEmpty()) {
            Patient patient4 = new Patient();
            patient4.setId("patient-4");
            patient4.setName("Emma Wilson");
            patient4.setEmail("patient4@example.com");
            patient4.setPhone("4567890123");
            patient4.setPassword(passwordEncoder.encode("password123"));
            patientRepository.save(patient4);
        }

        if (patientRepository.findByEmail("patient5@example.com").isEmpty()) {
            Patient patient5 = new Patient();
            patient5.setId("patient-5");
            patient5.setName("Michael Davis");
            patient5.setEmail("patient5@example.com");
            patient5.setPhone("5678901234");
            patient5.setPassword(passwordEncoder.encode("password123"));
            patientRepository.save(patient5);
        }

        // Create sample hospitals
        if (hospitalRepository.findById("hospital-1").isEmpty()) {
            Hospital hospital = new Hospital();
            hospital.setId("hospital-1");
            hospital.setName("City General Hospital");
            hospital.setEmail("hospital@example.com");
            hospital.setPhone("1122334455");
            hospital.setPassword(passwordEncoder.encode("password123"));
            hospital.setAddress("123 Main St, City, State");
            hospital.setCity("New York");
            hospital.setState("NY");
            hospital.setPincode("10001");
            hospital.setRegistrationNumber("HOSP001");
            hospital.setTotalDoctors(5);
            hospital.setStatus("approved");
            hospital.setFacilities(List.of("Emergency Care", "Surgery", "Radiology", "Laboratory", "Pharmacy", "ICU"));
            hospitalRepository.save(hospital);
        }

        // Create test hospital matching API response
        if (hospitalRepository.findByEmail("test@example.com") == null) {
            Hospital testHospital = new Hospital();
            testHospital.setId("hospital-test");
            testHospital.setName("Test Hospital");
            testHospital.setEmail("test@example.com");
            testHospital.setPhone("1234567890");
            testHospital.setPassword(passwordEncoder.encode("password123"));
            testHospital.setAddress("Test Address");
            testHospital.setStatus("approved");
            testHospital.setVerified(false);
            hospitalRepository.save(testHospital);
        }

        // Create Keerthi hospital for login testing
        if (hospitalRepository.findByEmail("keerthi@example.com") == null) {
            Hospital keerthiHospital = new Hospital();
            keerthiHospital.setId("hospital-keerthi");
            keerthiHospital.setName("Keerthi Hospital");
            keerthiHospital.setEmail("keerthi@example.com");
            keerthiHospital.setPhone("9876543210");
            keerthiHospital.setPassword(passwordEncoder.encode("Keerthi@028"));
            keerthiHospital.setAddress("Keerthi Hospital Address");
            keerthiHospital.setStatus("approved");
            keerthiHospital.setVerified(false);
            hospitalRepository.save(keerthiHospital);
        }

        if (hospitalRepository.findById("hospital-2").isEmpty()) {
            Hospital hospital2 = new Hospital();
            hospital2.setId("hospital-2");
            hospital2.setName("Metro Health Center");
            hospital2.setEmail("hospital2@example.com");
            hospital2.setPhone("6677889900");
            hospital2.setPassword(passwordEncoder.encode("password123"));
            hospital2.setAddress("456 Health Ave, Metro City, State");
            hospital2.setCity("Los Angeles");
            hospital2.setState("CA");
            hospital2.setPincode("90210");
            hospital2.setRegistrationNumber("HOSP002");
            hospital2.setTotalDoctors(3);
            hospital2.setStatus("approved");
            hospital2.setFacilities(List.of("Primary Care", "Cardiology", "Dental", "Pharmacy", "X-Ray"));
            hospitalRepository.save(hospital2);
        }

        if (hospitalRepository.findById("hospital-3").isEmpty()) {
            Hospital hospital3 = new Hospital();
            hospital3.setId("hospital-3");
            hospital3.setName("Regional Medical Center");
            hospital3.setEmail("hospital3@example.com");
            hospital3.setPhone("3344556677");
            hospital3.setPassword(passwordEncoder.encode("password123"));
            hospital3.setAddress("789 Care Blvd, Regional Area, State");
            hospital3.setCity("Chicago");
            hospital3.setState("IL");
            hospital3.setPincode("60601");
            hospital3.setRegistrationNumber("HOSP003");
            hospital3.setTotalDoctors(8);
            hospital3.setStatus("approved");
            hospital3.setFacilities(List.of("Emergency Care", "Surgery", "Oncology", "Pediatrics", "Maternity", "ICU", "Laboratory"));
            hospitalRepository.save(hospital3);
        }

        // Create sample doctors
        if (doctorRepository.findByEmail("doctor@example.com").isEmpty()) {
            Doctor doctor = new Doctor();
            doctor.setId("1");
            doctor.setName("Dr. Jane Smith");
            doctor.setEmail("doctor@example.com");
            doctor.setPhone("0987654321");
            doctor.setPassword(passwordEncoder.encode("password123"));
            doctor.setSpecialization("General Medicine");
            doctor.setQualification("MBBS, MD");
            doctor.setExperience(5);
            doctor.setRating(BigDecimal.valueOf(4.8));
            doctor.setAvailable(true);
            doctor.setConsultationFee(BigDecimal.valueOf(500.0));
            doctor.setStatus("approved");
            doctor.setHospitalId("hospital-1");
            doctorRepository.save(doctor);
        }

        if (doctorRepository.findByEmail("doctor2@example.com").isEmpty()) {
            Doctor doctor2 = new Doctor();
            doctor2.setId("doctor-2");
            doctor2.setName("Dr. Michael Johnson");
            doctor2.setEmail("doctor2@example.com");
            doctor2.setPhone("1231231234");
            doctor2.setPassword(passwordEncoder.encode("password123"));
            doctor2.setSpecialization("Cardiology");
            doctor2.setQualification("MBBS, MD, DM Cardiology");
            doctor2.setExperience(8);
            doctor2.setRating(BigDecimal.valueOf(4.9));
            doctor2.setAvailable(true);
            doctor2.setConsultationFee(BigDecimal.valueOf(800.0));
            doctor2.setStatus("approved");
            doctor2.setHospitalId("hospital-2");
            doctorRepository.save(doctor2);
        }

        if (doctorRepository.findByEmail("doctor3@example.com").isEmpty()) {
            Doctor doctor3 = new Doctor();
            doctor3.setId("doctor-3");
            doctor3.setName("Dr. Sarah Wilson");
            doctor3.setEmail("doctor3@example.com");
            doctor3.setPhone("4564564567");
            doctor3.setPassword(passwordEncoder.encode("password123"));
            doctor3.setSpecialization("Pediatrics");
            doctor3.setQualification("MBBS, MD Pediatrics");
            doctor3.setExperience(6);
            doctor3.setRating(BigDecimal.valueOf(4.7));
            doctor3.setAvailable(true);
            doctor3.setConsultationFee(BigDecimal.valueOf(600.0));
            doctor3.setStatus("approved");
            doctor3.setHospitalId("hospital-3");
            doctorRepository.save(doctor3);
        }

        if (doctorRepository.findByEmail("doctor4@example.com").isEmpty()) {
            Doctor doctor4 = new Doctor();
            doctor4.setId("doctor-4");
            doctor4.setName("Dr. David Chen");
            doctor4.setEmail("doctor4@example.com");
            doctor4.setPhone("7897897890");
            doctor4.setPassword(passwordEncoder.encode("password123"));
            doctor4.setSpecialization("Orthopedics");
            doctor4.setQualification("MBBS, MS Orthopedics");
            doctor4.setExperience(10);
            doctor4.setRating(BigDecimal.valueOf(4.6));
            doctor4.setAvailable(true);
            doctor4.setConsultationFee(BigDecimal.valueOf(700.0));
            doctor4.setStatus("approved");
            doctor4.setHospitalId("hospital-1");
            doctor4.setAvatarUrl("https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor4);
        }

        if (doctorRepository.findByEmail("doctor5@example.com").isEmpty()) {
            Doctor doctor5 = new Doctor();
            doctor5.setId("doctor-5");
            doctor5.setName("Dr. Emily Davis");
            doctor5.setEmail("doctor5@example.com");
            doctor5.setPhone("3213213210");
            doctor5.setPassword(passwordEncoder.encode("password123"));
            doctor5.setSpecialization("Dermatology");
            doctor5.setQualification("MBBS, MD Dermatology");
            doctor5.setExperience(7);
            doctor5.setRating(BigDecimal.valueOf(4.8));
            doctor5.setAvailable(true);
            doctor5.setConsultationFee(BigDecimal.valueOf(650.0));
            doctor5.setStatus("approved");
            doctor5.setHospitalId("hospital-2");
            doctor5.setAvatarUrl("https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor5);
        }

        // Create HospitalDoctor associations
        createHospitalDoctorAssociations();

        // Remove any admin from patients table (legacy cleanup)
        Optional<Patient> existingAdminPatient = patientRepository.findByEmail("admin@example.com");
        if (existingAdminPatient.isPresent()) {
            patientRepository.delete(existingAdminPatient.get());
        }

        // Create sample admin in proper admins table
        // First, delete any existing admin to ensure clean state
        Optional<Admin> existingAdmin = adminRepository.findByEmail("admin@example.com");
        if (existingAdmin.isPresent()) {
            adminRepository.delete(existingAdmin.get());
        }

        Admin admin = new Admin();
        admin.setId("admin-1");
        admin.setName("Admin User");
        admin.setEmail("admin@example.com");
        admin.setPhone("5555555555");
        admin.setRole(Admin.AdminRole.SUPER_ADMIN);
        admin.setPassword("password123"); // Plain text for admin login
        adminRepository.save(admin);

        // Create sample appointments and chat rooms
        if (appointmentRepository.findByPatient_Id("1").isEmpty()) {
            // Get existing patient and doctor
            Optional<Patient> patient = patientRepository.findById("1");
            Optional<Doctor> doctor = doctorRepository.findById("1");

            if (patient.isPresent() && doctor.isPresent()) {
                // Create appointment
                Appointment appointment = new Appointment();
                appointment.setId("appointment-1");
                appointment.setPatient(patient.get());
                appointment.setDoctor(doctor.get());
                appointment.setPatientName(patient.get().getName());
                appointment.setDoctorName(doctor.get().getName());
                appointment.setAppointmentDate(LocalDate.now().plusDays(1));
                appointment.setAppointmentTime(LocalTime.of(10, 0));
                appointment.setType(Appointment.AppointmentType.CHAT);
                appointment.setStatus(Appointment.AppointmentStatus.UPCOMING);
                appointment.setNotes("Initial consultation");
                appointment.setCreatedAt(LocalDateTime.now());
                appointmentRepository.save(appointment);

                // Create chat room for this appointment
                ChatRoom chatRoom = new ChatRoom();
                chatRoom.setAppointment(appointment);
                chatRoom.setPatient(patient.get());
                chatRoom.setDoctor(doctor.get());
                chatRoom.setPatientName(patient.get().getName());
                chatRoom.setDoctorName(doctor.get().getName());
                chatRoom.setCreatedAt(LocalDateTime.now());
                chatRoom.setStatus(ChatRoom.ChatRoomStatus.ACTIVE);
                chatRoomRepository.save(chatRoom);

                // Add sample messages
                ChatMessage message1 = new ChatMessage();
                message1.setChatRoom(chatRoom);
                message1.setSenderId(doctor.get().getId());
                message1.setSenderName(doctor.get().getName());
                message1.setSenderRole(ChatMessage.SenderRole.DOCTOR);
                message1.setSenderType(ChatMessage.SenderType.DOCTOR);
                message1.setContent("Hello John, how are you feeling today?");
                message1.setCreatedAt(LocalDateTime.now().minusMinutes(30));
                message1.setStatus(ChatMessage.MessageStatus.SENT);
                chatMessageRepository.save(message1);

                ChatMessage message2 = new ChatMessage();
                message2.setChatRoom(chatRoom);
                message2.setSenderId(patient.get().getId());
                message2.setSenderName(patient.get().getName());
                message2.setSenderRole(ChatMessage.SenderRole.PATIENT);
                message2.setSenderType(ChatMessage.SenderType.PATIENT);
                message2.setContent("Hi Dr. Smith, I'm feeling much better now. Thank you for asking.");
                message2.setCreatedAt(LocalDateTime.now().minusMinutes(25));
                message2.setStatus(ChatMessage.MessageStatus.SENT);
                chatMessageRepository.save(message2);

                ChatMessage message3 = new ChatMessage();
                message3.setChatRoom(chatRoom);
                message3.setSenderId(doctor.get().getId());
                message3.setSenderName(doctor.get().getName());
                message3.setSenderRole(ChatMessage.SenderRole.DOCTOR);
                message3.setSenderType(ChatMessage.SenderType.DOCTOR);
                message3.setContent("That's great to hear! Please continue taking the prescribed medication.");
                message3.setCreatedAt(LocalDateTime.now().minusMinutes(20));
                message3.setStatus(ChatMessage.MessageStatus.SENT);
                chatMessageRepository.save(message3);

                // Update chat room with last message info
                chatRoom.setLastMessage("That's great to hear! Please continue taking the prescribed medication.");
                chatRoom.setLastMessageTime(message3.getCreatedAt());
                chatRoomRepository.save(chatRoom);
            }
        }

        // Create another appointment and chat room
        if (appointmentRepository.findByPatient_Id("1").size() < 2) {
            Optional<Patient> patient = patientRepository.findById("1");
            Optional<Doctor> doctor = doctorRepository.findById("doctor-2");

            if (patient.isPresent() && doctor.isPresent()) {
                // Create appointment
                Appointment appointment = new Appointment();
                appointment.setId("appointment-2");
                appointment.setPatient(patient.get());
                appointment.setDoctor(doctor.get());
                appointment.setPatientName(patient.get().getName());
                appointment.setDoctorName(doctor.get().getName());
                appointment.setAppointmentDate(LocalDate.now().plusDays(3));
                appointment.setAppointmentTime(LocalTime.of(14, 0));
                appointment.setType(Appointment.AppointmentType.HOSPITAL);
                appointment.setStatus(Appointment.AppointmentStatus.UPCOMING);
                appointment.setNotes("Follow-up appointment");
                appointment.setCreatedAt(LocalDateTime.now());
                appointmentRepository.save(appointment);

                // Create chat room for this appointment
                ChatRoom chatRoom = new ChatRoom();
                chatRoom.setAppointment(appointment);
                chatRoom.setPatient(patient.get());
                chatRoom.setDoctor(doctor.get());
                chatRoom.setPatientName(patient.get().getName());
                chatRoom.setDoctorName(doctor.get().getName());
                chatRoom.setCreatedAt(LocalDateTime.now());
                chatRoom.setStatus(ChatRoom.ChatRoomStatus.ACTIVE);
                chatRoomRepository.save(chatRoom);

                // Add sample messages
                ChatMessage message1 = new ChatMessage();
                message1.setChatRoom(chatRoom);
                message1.setSenderId(doctor.get().getId());
                message1.setSenderName(doctor.get().getName());
                message1.setSenderRole(ChatMessage.SenderRole.DOCTOR);
                message1.setSenderType(ChatMessage.SenderType.DOCTOR);
                message1.setContent("Your test results are ready. Please come for the follow-up.");
                message1.setCreatedAt(LocalDateTime.now().minusHours(2));
                message1.setStatus(ChatMessage.MessageStatus.SENT);
                chatMessageRepository.save(message1);

                // Update chat room with last message info
                chatRoom.setLastMessage("Your test results are ready. Please come for the follow-up.");
                chatRoom.setLastMessageTime(message1.getCreatedAt());
                chatRoomRepository.save(chatRoom);
            }
        }

        // Create sample medicines
        if (medicineRepository.count() == 0) {
            // Create sample medicines
            Medicine medicine1 = new Medicine();
            medicine1.setName("Paracetamol");
            medicine1.setGenericName("Acetaminophen");
            medicine1.setDescription("Pain reliever and fever reducer");
            medicine1.setManufacturer("Generic Pharma");
            medicine1.setDosageForm("Tablet");
            medicine1.setStrength("500mg");
            medicine1.setIndications("Pain relief, fever reduction");
            medicine1.setContraindications("Liver disease, alcohol consumption");
            medicine1.setSideEffects("Nausea, rash, liver damage (rare)");
            medicine1.setPrecautions("Do not exceed recommended dose");
            medicine1.setInteractions("Warfarin, alcohol");
            medicine1.setCategory("Analgesic");
            medicine1.setPrice(BigDecimal.valueOf(25.50));
            medicine1.setStockQuantity(100);
            medicine1.setPrescriptionRequired("NO");
            medicine1.setStatus("ACTIVE");
            medicineRepository.save(medicine1);

            Medicine medicine2 = new Medicine();
            medicine2.setName("Amoxicillin");
            medicine2.setGenericName("Amoxicillin");
            medicine2.setDescription("Antibiotic for bacterial infections");
            medicine2.setManufacturer("Antibiotic Corp");
            medicine2.setDosageForm("Capsule");
            medicine2.setStrength("500mg");
            medicine2.setIndications("Ear infections, urinary tract infections");
            medicine2.setContraindications("Penicillin allergy");
            medicine2.setSideEffects("Diarrhea, nausea, rash");
            medicine2.setPrecautions("Complete full course of treatment");
            medicine2.setInteractions("Oral contraceptives");
            medicine2.setCategory("Antibiotic");
            medicine2.setPrice(BigDecimal.valueOf(45.00));
            medicine2.setStockQuantity(75);
            medicine2.setPrescriptionRequired("YES");
            medicine2.setStatus("ACTIVE");
            medicineRepository.save(medicine2);

            Medicine medicine3 = new Medicine();
            medicine3.setName("Ibuprofen");
            medicine3.setGenericName("Ibuprofen");
            medicine3.setDescription("Non-steroidal anti-inflammatory drug");
            medicine3.setManufacturer("Pain Relief Ltd");
            medicine3.setDosageForm("Tablet");
            medicine3.setStrength("200mg");
            medicine3.setIndications("Pain, inflammation, fever");
            medicine3.setContraindications("Stomach ulcers, heart disease");
            medicine3.setSideEffects("Stomach upset, heartburn");
            medicine3.setPrecautions("Take with food");
            medicine3.setInteractions("Aspirin, blood thinners");
            medicine3.setCategory("NSAID");
            medicine3.setPrice(BigDecimal.valueOf(18.75));
            medicine3.setStockQuantity(120);
            medicine3.setPrescriptionRequired("NO");
            medicine3.setStatus("ACTIVE");
            medicineRepository.save(medicine3);

            Medicine medicine4 = new Medicine();
            medicine4.setName("Omeprazole");
            medicine4.setGenericName("Omeprazole");
            medicine4.setDescription("Proton pump inhibitor for acid reflux");
            medicine4.setManufacturer("Digestive Health Inc");
            medicine4.setDosageForm("Capsule");
            medicine4.setStrength("20mg");
            medicine4.setIndications("GERD, ulcers");
            medicine4.setContraindications("Severe liver disease");
            medicine4.setSideEffects("Headache, diarrhea");
            medicine4.setPrecautions("Long-term use may affect bone health");
            medicine4.setInteractions("Clopidogrel, digoxin");
            medicine4.setCategory("PPI");
            medicine4.setPrice(BigDecimal.valueOf(32.00));
            medicine4.setStockQuantity(60);
            medicine4.setPrescriptionRequired("YES");
            medicine4.setStatus("ACTIVE");
            medicineRepository.save(medicine4);

            Medicine medicine5 = new Medicine();
            medicine5.setName("Vitamin D3");
            medicine5.setGenericName("Cholecalciferol");
            medicine5.setDescription("Vitamin supplement for bone health");
            medicine5.setManufacturer("NutriHealth");
            medicine5.setDosageForm("Tablet");
            medicine5.setStrength("1000 IU");
            medicine5.setIndications("Vitamin D deficiency, bone health");
            medicine5.setContraindications("Hypercalcemia");
            medicine5.setSideEffects("Nausea, constipation (rare)");
            medicine5.setPrecautions("Monitor calcium levels");
            medicine5.setInteractions("Calcium supplements");
            medicine5.setCategory("Vitamin");
            medicine5.setPrice(BigDecimal.valueOf(15.25));
            medicine5.setStockQuantity(200);
            medicine5.setPrescriptionRequired("NO");
            medicine5.setStatus("ACTIVE");
            medicineRepository.save(medicine5);
        }
    }

    private void createHospitalDoctorAssociations() {
        // Association for doctor1 with hospital-1
        if (hospitalDoctorRepository.findById(new HospitalDoctorId("hospital-1", "1")).isEmpty()) {
            Optional<Hospital> hOpt1 = hospitalRepository.findById("hospital-1");
            Optional<Doctor> dOpt1 = doctorRepository.findById("1");
            if (hOpt1.isPresent() && dOpt1.isPresent()) {
                HospitalDoctor hd1 = new HospitalDoctor();
                HospitalDoctorId id1 = new HospitalDoctorId("hospital-1", "1");
                hd1.setId(id1);
                hd1.setHospital(hOpt1.get());
                hd1.setDoctor(dOpt1.get());
                hd1.setStatus("approved");
                hd1.setJoinedAt(LocalDateTime.now());
                hd1.setCreatedAt(LocalDateTime.now());
                hospitalDoctorRepository.save(hd1);
            }
        }

        // Association for doctor2 with hospital-2
        if (hospitalDoctorRepository.findById(new HospitalDoctorId("hospital-2", "doctor-2")).isEmpty()) {
            Optional<Hospital> hOpt2 = hospitalRepository.findById("hospital-2");
            Optional<Doctor> dOpt2 = doctorRepository.findById("doctor-2");
            if (hOpt2.isPresent() && dOpt2.isPresent()) {
                HospitalDoctor hd2 = new HospitalDoctor();
                HospitalDoctorId id2 = new HospitalDoctorId("hospital-2", "doctor-2");
                hd2.setId(id2);
                hd2.setHospital(hOpt2.get());
                hd2.setDoctor(dOpt2.get());
                hd2.setStatus("approved");
                hd2.setJoinedAt(LocalDateTime.now());
                hd2.setCreatedAt(LocalDateTime.now());
                hospitalDoctorRepository.save(hd2);
            }
        }

        // Association for doctor3 with hospital-3
        if (hospitalDoctorRepository.findById(new HospitalDoctorId("hospital-3", "doctor-3")).isEmpty()) {
            Optional<Hospital> hOpt3 = hospitalRepository.findById("hospital-3");
            Optional<Doctor> dOpt3 = doctorRepository.findById("doctor-3");
            if (hOpt3.isPresent() && dOpt3.isPresent()) {
                HospitalDoctor hd3 = new HospitalDoctor();
                HospitalDoctorId id3 = new HospitalDoctorId("hospital-3", "doctor-3");
                hd3.setId(id3);
                hd3.setHospital(hOpt3.get());
                hd3.setDoctor(dOpt3.get());
                hd3.setStatus("approved");
                hd3.setJoinedAt(LocalDateTime.now());
                hd3.setCreatedAt(LocalDateTime.now());
                hospitalDoctorRepository.save(hd3);
            }
        }

        // Association for doctor4 with hospital-1
        if (hospitalDoctorRepository.findById(new HospitalDoctorId("hospital-1", "doctor-4")).isEmpty()) {
            Optional<Hospital> hOpt4 = hospitalRepository.findById("hospital-1");
            Optional<Doctor> dOpt4 = doctorRepository.findById("doctor-4");
            if (hOpt4.isPresent() && dOpt4.isPresent()) {
                HospitalDoctor hd4 = new HospitalDoctor();
                HospitalDoctorId id4 = new HospitalDoctorId("hospital-1", "doctor-4");
                hd4.setId(id4);
                hd4.setHospital(hOpt4.get());
                hd4.setDoctor(dOpt4.get());
                hd4.setStatus("approved");
                hd4.setJoinedAt(LocalDateTime.now());
                hd4.setCreatedAt(LocalDateTime.now());
                hospitalDoctorRepository.save(hd4);
            }
        }

        // Association for doctor5 with hospital-2
        if (hospitalDoctorRepository.findById(new HospitalDoctorId("hospital-2", "doctor-5")).isEmpty()) {
            Optional<Hospital> hOpt5 = hospitalRepository.findById("hospital-2");
            Optional<Doctor> dOpt5 = doctorRepository.findById("doctor-5");
            if (hOpt5.isPresent() && dOpt5.isPresent()) {
                HospitalDoctor hd5 = new HospitalDoctor();
                HospitalDoctorId id5 = new HospitalDoctorId("hospital-2", "doctor-5");
                hd5.setId(id5);
                hd5.setHospital(hOpt5.get());
                hd5.setDoctor(dOpt5.get());
                hd5.setStatus("approved");
                hd5.setJoinedAt(LocalDateTime.now());
                hd5.setCreatedAt(LocalDateTime.now());
                hospitalDoctorRepository.save(hd5);
            }
        }
    }
}
