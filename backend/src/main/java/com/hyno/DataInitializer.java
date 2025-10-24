package com.hyno;

import com.hyno.entity.Admin;
import com.hyno.entity.Patient;
import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
import com.hyno.repository.AdminRepository;
import com.hyno.repository.PatientRepository;
import com.hyno.repository.DoctorRepository;
import com.hyno.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.math.BigDecimal;
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

    @Override
    public void run(String... args) throws Exception {
        // Create sample patient
        if (patientRepository.findByEmail("patient@example.com").isEmpty()) {
            Patient patient = new Patient();
            patient.setId("patient-1");
            patient.setName("John Doe");
            patient.setEmail("patient@example.com");
            patient.setPhone("1234567890");
            patient.setPassword("password123");
            patientRepository.save(patient);
        }

        // Create sample doctors
        if (doctorRepository.findByEmail("doctor@example.com").isEmpty()) {
            Doctor doctor = new Doctor();
            doctor.setId("doctor-1");
            doctor.setName("Dr. Jane Smith");
            doctor.setEmail("doctor@example.com");
            doctor.setPhone("0987654321");
            doctor.setPassword("password123");
            doctor.setSpecialization("General Medicine");
            doctor.setQualification("MBBS, MD");
            doctor.setExperience(5);
            doctor.setRating(BigDecimal.valueOf(4.8));
            doctor.setAvailable(true);
            doctor.setConsultationFee(BigDecimal.valueOf(500.0));
            doctor.setStatus("approved");
            doctor.setAvatarUrl("https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor);
        }

        if (doctorRepository.findByEmail("doctor2@example.com").isEmpty()) {
            Doctor doctor2 = new Doctor();
            doctor2.setId("doctor-2");
            doctor2.setName("Dr. Michael Johnson");
            doctor2.setEmail("doctor2@example.com");
            doctor2.setPhone("1231231234");
            doctor2.setPassword("password123");
            doctor2.setSpecialization("Cardiology");
            doctor2.setQualification("MBBS, MD, DM Cardiology");
            doctor2.setExperience(8);
            doctor2.setRating(BigDecimal.valueOf(4.9));
            doctor2.setAvailable(true);
            doctor2.setConsultationFee(BigDecimal.valueOf(800.0));
            doctor2.setStatus("approved");
            doctor2.setAvatarUrl("https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor2);
        }

        if (doctorRepository.findByEmail("doctor3@example.com").isEmpty()) {
            Doctor doctor3 = new Doctor();
            doctor3.setId("doctor-3");
            doctor3.setName("Dr. Sarah Wilson");
            doctor3.setEmail("doctor3@example.com");
            doctor3.setPhone("4564564567");
            doctor3.setPassword("password123");
            doctor3.setSpecialization("Pediatrics");
            doctor3.setQualification("MBBS, MD Pediatrics");
            doctor3.setExperience(6);
            doctor3.setRating(BigDecimal.valueOf(4.7));
            doctor3.setAvailable(true);
            doctor3.setConsultationFee(BigDecimal.valueOf(600.0));
            doctor3.setStatus("approved");
            doctor3.setAvatarUrl("https://images.unsplash.com/photo-1594824804732-ca8db723f8fa?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor3);
        }

        if (doctorRepository.findByEmail("doctor4@example.com").isEmpty()) {
            Doctor doctor4 = new Doctor();
            doctor4.setId("doctor-4");
            doctor4.setName("Dr. David Chen");
            doctor4.setEmail("doctor4@example.com");
            doctor4.setPhone("7897897890");
            doctor4.setPassword("password123");
            doctor4.setSpecialization("Orthopedics");
            doctor4.setQualification("MBBS, MS Orthopedics");
            doctor4.setExperience(10);
            doctor4.setRating(BigDecimal.valueOf(4.6));
            doctor4.setAvailable(true);
            doctor4.setConsultationFee(BigDecimal.valueOf(700.0));
            doctor4.setStatus("approved");
            doctor4.setAvatarUrl("https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor4);
        }

        if (doctorRepository.findByEmail("doctor5@example.com").isEmpty()) {
            Doctor doctor5 = new Doctor();
            doctor5.setId("doctor-5");
            doctor5.setName("Dr. Emily Davis");
            doctor5.setEmail("doctor5@example.com");
            doctor5.setPhone("3213213210");
            doctor5.setPassword("password123");
            doctor5.setSpecialization("Dermatology");
            doctor5.setQualification("MBBS, MD Dermatology");
            doctor5.setExperience(7);
            doctor5.setRating(BigDecimal.valueOf(4.8));
            doctor5.setAvailable(true);
            doctor5.setConsultationFee(BigDecimal.valueOf(650.0));
            doctor5.setStatus("approved");
            doctor5.setAvatarUrl("https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face");
            doctorRepository.save(doctor5);
        }

        // Create sample hospitals
        if (hospitalRepository.findByEmail("hospital@example.com") == null) {
            Hospital hospital = new Hospital();
            hospital.setId("hospital-1");
            hospital.setName("City General Hospital");
            hospital.setEmail("hospital@example.com");
            hospital.setPhone("1122334455");
            hospital.setPassword("password123");
            hospital.setAddress("123 Main St, City, State");
            hospital.setStatus("approved");
            hospitalRepository.save(hospital);
        }

        if (hospitalRepository.findByEmail("hospital2@example.com") == null) {
            Hospital hospital2 = new Hospital();
            hospital2.setId("hospital-2");
            hospital2.setName("Metro Health Center");
            hospital2.setEmail("hospital2@example.com");
            hospital2.setPhone("6677889900");
            hospital2.setPassword("password123");
            hospital2.setAddress("456 Health Ave, Metro City, State");
            hospital2.setStatus("approved");
            hospitalRepository.save(hospital2);
        }

        if (hospitalRepository.findByEmail("hospital3@example.com") == null) {
            Hospital hospital3 = new Hospital();
            hospital3.setId("hospital-3");
            hospital3.setName("Regional Medical Center");
            hospital3.setEmail("hospital3@example.com");
            hospital3.setPhone("3344556677");
            hospital3.setPassword("password123");
            hospital3.setAddress("789 Care Blvd, Regional Area, State");
            hospital3.setStatus("approved");
            hospitalRepository.save(hospital3);
        }

        // Remove any admin from patients table (legacy cleanup)
        Optional<Patient> existingAdminPatient = patientRepository.findByEmail("admin@example.com");
        if (existingAdminPatient.isPresent()) {
            patientRepository.delete(existingAdminPatient.get());
        }

        // Create sample admin in proper admins table
        if (adminRepository.findByEmail("admin@example.com").isEmpty()) {
            Admin admin = new Admin();
            admin.setId("admin-1");
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPhone("5555555555");
            admin.setPassword("admin123");
            admin.setRole(Admin.AdminRole.SUPER_ADMIN);
            adminRepository.save(admin);
        }
    }
}
