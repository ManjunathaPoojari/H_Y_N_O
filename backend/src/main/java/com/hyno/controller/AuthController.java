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

<<<<<<< Updated upstream
=======
    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Rate limiting for login attempts
    private final Map<String, Integer> loginAttempts = new ConcurrentHashMap<>();
    private final Map<String, Long> lastLoginAttempt = new ConcurrentHashMap<>();
    private static final int MAX_LOGIN_ATTEMPTS = 100; // Temporarily increased for testing
    private static final long LOCKOUT_DURATION_MS = 1000; // 1 second for testing

    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    // Password strength requirements
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$"
    );

>>>>>>> Stashed changes
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        String role = loginRequest.get("role");

        logger.info("Login attempt for email: {} with role: {}", email, role);

<<<<<<< Updated upstream
=======
        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role is required"));
        }

        // Rate limiting check
        long currentTime = System.currentTimeMillis();
        Integer attempts = loginAttempts.get(email);
        Long lastAttempt = lastLoginAttempt.get(email);

        if (attempts != null && attempts >= MAX_LOGIN_ATTEMPTS) {
            if (lastAttempt != null && (currentTime - lastAttempt) < LOCKOUT_DURATION_MS) {
                long remainingTime = (LOCKOUT_DURATION_MS - (currentTime - lastAttempt)) / 1000 / 60;
                return ResponseEntity.status(429).body(Map.of("message", "Too many failed login attempts. Please try again in " + remainingTime + " minutes."));
            } else {
                // Reset attempts after lockout period
                loginAttempts.remove(email);
                lastLoginAttempt.remove(email);
            }
        }

>>>>>>> Stashed changes
        try {
            // For demo purposes, we'll use simple email/password validation
            // In production, use proper authentication with JWT tokens

            Map<String, Object> response = new HashMap<>();

<<<<<<< Updated upstream
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
=======
            // Check user based on role
            switch (role.toUpperCase()) {
                case "ADMIN":
                    Optional<Admin> admin = adminService.findByEmail(email);
                    if (admin.isPresent() && passwordEncoder.matches(password, admin.get().getPassword())) {
                        logger.info("Admin login successful for: {}", email);
                        // Reset login attempts on successful login
                        loginAttempts.remove(email);
                        lastLoginAttempt.remove(email);
                        userData.put("id", admin.get().getId());
                        userData.put("name", admin.get().getName());
                        userData.put("email", admin.get().getEmail());
                        userData.put("role", "admin");
                        token = jwtService.generateToken(admin.get().getId(), email, "admin");
                        response.put("user", userData);
                        response.put("token", token);
                        return ResponseEntity.ok(response);
                    }
                    break;

                case "PATIENT":
                    Optional<Patient> patient = patientService.findByEmail(email);
                    if (patient.isPresent()) {
                        String storedPassword = patient.get().getPassword();
                        // Support both plain text (legacy) and hashed passwords
                        if (password.equals(storedPassword) || passwordEncoder.matches(password, storedPassword)) {
                            logger.info("Patient login successful for: {}", email);
                            // Reset login attempts on successful login
                            loginAttempts.remove(email);
                            lastLoginAttempt.remove(email);
                            userData.put("id", patient.get().getId());
                            userData.put("name", patient.get().getName());
                            userData.put("email", patient.get().getEmail());
                            userData.put("role", "patient");
                            token = jwtService.generateToken(patient.get().getId(), email, "patient");
                            response.put("user", userData);
                            response.put("token", token);
                            return ResponseEntity.ok(response);
                        }
                    }
                    break;

                case "DOCTOR":
                    Optional<Doctor> doctor = Optional.ofNullable(doctorService.getDoctorByEmail(email));
                    if (doctor.isPresent() && passwordEncoder.matches(password, doctor.get().getPassword())) {
                        logger.info("Doctor login successful for: {}", email);
                        // Reset login attempts on successful login
                        loginAttempts.remove(email);
                        lastLoginAttempt.remove(email);
                        userData.put("id", doctor.get().getId());
                        userData.put("name", doctor.get().getName());
                        userData.put("email", doctor.get().getEmail());
                        userData.put("role", "doctor");
                        token = jwtService.generateToken(doctor.get().getId(), email, "doctor");
                        response.put("user", userData);
                        response.put("token", token);
                        return ResponseEntity.ok(response);
                    }
                    break;

                case "HOSPITAL":
                    Optional<Hospital> hospital = Optional.ofNullable(hospitalService.getHospitalByEmail(email));
                    if (hospital.isPresent() && passwordEncoder.matches(password, hospital.get().getPassword())) {
                        logger.info("Hospital login successful for: {}", email);
                        // Reset login attempts on successful login
                        loginAttempts.remove(email);
                        lastLoginAttempt.remove(email);
                        userData.put("id", hospital.get().getId());
                        userData.put("name", hospital.get().getName());
                        userData.put("email", hospital.get().getEmail());
                        userData.put("role", "hospital");
                        token = jwtService.generateToken(hospital.get().getId(), email, "hospital");
                        response.put("user", userData);
                        response.put("token", token);
                        return ResponseEntity.ok(response);
                    }
                    break;

                default:
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid role specified"));
            }

            // Increment failed login attempts
            loginAttempts.put(email, (attempts != null ? attempts : 0) + 1);
            lastLoginAttempt.put(email, currentTime);
            logger.warn("Login failed for email: {} with role: {} - Invalid credentials", email, role);
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
        } catch (Exception e) {
            logger.error("Error during login for email: {} with role: {}", email, role, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Login failed. Please try again."));
>>>>>>> Stashed changes
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
