package com.hyno.controller;

import com.hyno.entity.Patient;
import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
import com.hyno.entity.Admin;
import com.hyno.service.PatientService;
import com.hyno.service.DoctorService;
import com.hyno.service.HospitalService;
import com.hyno.service.AdminService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        logger.info("Login attempt for email: {}", email);

        try {
            // For demo purposes, we'll use simple email/password validation
            // In production, use proper authentication with JWT tokens

            Map<String, Object> response = new HashMap<>();

            // Check for admin first using proper Admin entity
            Optional<Admin> admin = adminService.findByEmail(email);
            if (admin.isPresent() && password.equals(admin.get().getPassword())) {
                logger.info("Admin login successful for: {}", email);
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", admin.get().getId());
                userData.put("name", admin.get().getName());
                userData.put("email", admin.get().getEmail());
                userData.put("role", "admin");
                response.put("user", userData);
                response.put("token", "demo-token-" + admin.get().getId());
                return ResponseEntity.ok(response);
            }

            // Check patients (excluding admin)
            Optional<Patient> patient = patientService.findByEmail(email);
            if (patient.isPresent() && password.equals(patient.get().getPassword())) {
                logger.info("Patient login successful for: {}", email);
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", patient.get().getId());
                userData.put("name", patient.get().getName());
                userData.put("email", patient.get().getEmail());
                userData.put("role", "patient");
                response.put("user", userData);
                response.put("token", "demo-token-" + patient.get().getId());
                return ResponseEntity.ok(response);
            }

            // Check doctors
            Optional<Doctor> doctor = Optional.ofNullable(doctorService.getDoctorByEmail(email));
            if (doctor.isPresent() && password.equals(doctor.get().getPassword())) {
                logger.info("Doctor login successful for: {}", email);
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", doctor.get().getId());
                userData.put("name", doctor.get().getName());
                userData.put("email", doctor.get().getEmail());
                userData.put("role", "doctor");
                response.put("user", userData);
                response.put("token", "demo-token-" + doctor.get().getId());
                return ResponseEntity.ok(response);
            }

            // Check hospitals
            Optional<Hospital> hospital = Optional.ofNullable(hospitalService.getHospitalByEmail(email));
            if (hospital.isPresent() && password.equals(hospital.get().getPassword())) {
                logger.info("Hospital login successful for: {}", email);
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", hospital.get().getId());
                userData.put("name", hospital.get().getName());
                userData.put("email", hospital.get().getEmail());
                userData.put("role", "hospital");
                response.put("user", userData);
                response.put("token", "demo-token-" + hospital.get().getId());
                return ResponseEntity.ok(response);
            }

            logger.warn("Login failed for email: {} - Invalid credentials", email);
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid credentials"));
        } catch (Exception e) {
            logger.error("Error during login for email: {}", email, e);
            throw e; // Let GlobalExceptionHandler handle it
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> registerRequest) {
        String name = (String) registerRequest.get("name");
        String email = (String) registerRequest.get("email");
        String phone = (String) registerRequest.get("phone");
        String password = (String) registerRequest.get("password");
        String role = (String) registerRequest.get("role");

        logger.info("Registration attempt for email: {} with role: {}", email, role);

        Map<String, Object> response = new HashMap<>();

        try {
            switch (role.toUpperCase()) {
                case "PATIENT":
                    Patient patient = new Patient();
                    patient.setId(UUID.randomUUID().toString());
                    patient.setName(name);
                    patient.setEmail(email);
                    patient.setPhone(phone);
                    patient.setPassword(password);
                    Patient savedPatient = patientService.save(patient);
                    logger.info("Patient registered successfully: {}", email);
                    response.put("user", savedPatient);
                    response.put("token", "demo-token-" + savedPatient.getId());
                    break;

                case "DOCTOR":
                    Doctor doctor = new Doctor();
                    doctor.setId(UUID.randomUUID().toString());
                    doctor.setName(name);
                    doctor.setEmail(email);
                    doctor.setPhone(phone);
                    doctor.setPassword(password);
                    doctor.setSpecialization("General Medicine"); // Default
                    doctor.setExperience(0);
                    doctor.setStatus("PENDING"); // Needs approval
                    Doctor savedDoctor = doctorService.createDoctor(doctor);
                    logger.info("Doctor registered successfully: {}", email);
                    response.put("user", savedDoctor);
                    response.put("token", "demo-token-" + savedDoctor.getId());
                    break;

                case "HOSPITAL":
                    Hospital hospital = new Hospital();
                    hospital.setId(UUID.randomUUID().toString());
                    hospital.setName(name);
                    hospital.setEmail(email);
                    hospital.setPhone(phone);
                    hospital.setPassword(password);
                    hospital.setAddress(""); // Will be updated later
                    hospital.setStatus("PENDING"); // Needs approval
                    Hospital savedHospital = hospitalService.createHospital(hospital);
                    logger.info("Hospital registered successfully: {}", email);
                    response.put("user", savedHospital);
                    response.put("token", "demo-token-" + savedHospital.getId());
                    break;

                default:
                    logger.warn("Invalid role provided during registration: {}", role);
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid role"));
            }

            response.put("message", "Account created successfully!");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Registration failed for email: {}", email, e);
            throw e; // Let GlobalExceptionHandler handle it
        }
    }
}
