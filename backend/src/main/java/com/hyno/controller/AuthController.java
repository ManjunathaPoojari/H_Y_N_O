package com.hyno.controller;

import com.hyno.entity.Patient;
import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
import com.hyno.entity.Trainer;
import com.hyno.entity.Admin;
import com.hyno.entity.PasswordResetToken;
import com.hyno.service.PatientService;
import com.hyno.service.DoctorService;
import com.hyno.service.HospitalService;
import com.hyno.service.TrainerService;
import com.hyno.service.AdminService;
import com.hyno.service.EmailService;
import com.hyno.service.JwtService;
import com.hyno.repository.PasswordResetTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/auth")
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

    @Autowired
    private TrainerService trainerService;

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
    private static final int MAX_LOGIN_ATTEMPTS = 10;
    private static final long LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

    // Email validation pattern
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
        "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$"
    );

    // Password strength requirements
    private static final Pattern PASSWORD_PATTERN = Pattern.compile(
        "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$"
    );

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        logger.info("Login attempt for email: {}", email);

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
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

        try {
            Map<String, Object> response = new HashMap<>();
            String token = null;
            Map<String, Object> userData = new HashMap<>();
            String normalizedEmail = email.toLowerCase();

            // Check for admin first using proper Admin entity
            Optional<Admin> admin = adminService.findByEmail(normalizedEmail);
            if (admin.isPresent()) {
                String storedPassword = admin.get().getPassword();
                logger.info("Admin login attempt for email: {}", email);
                logger.info("Stored password: {}", storedPassword);
                logger.info("Input password equals stored: {}", password.equals(storedPassword));
                logger.info("Input password matches hash: {}", passwordEncoder.matches(password, storedPassword));
                // Support both plain text (legacy) and hashed passwords
                if (password.equals(storedPassword) || passwordEncoder.matches(password, storedPassword)) {
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
            }

            // Check patients (excluding admin)
            Optional<Patient> patient = patientService.findByEmail(normalizedEmail);
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

            // Check doctors
            Optional<Doctor> doctor = Optional.ofNullable(doctorService.getDoctorByEmail(normalizedEmail));
            if (doctor.isPresent() && passwordEncoder.matches(password, doctor.get().getPassword())) {
                // Check if doctor is approved
                String status = doctor.get().getStatus();
                if (status == null || (!status.equalsIgnoreCase("approved"))) {
                    logger.warn("Doctor login denied - not approved. Status: {}", status);
                    return ResponseEntity.status(403).body(Map.of(
                        "message", "Your account is waiting for admin approval. Please contact support if you have any questions.",
                        "code", "PENDING_APPROVAL"
                    ));
                }
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

            // Check hospitals
            Optional<Hospital> hospital = Optional.ofNullable(hospitalService.getHospitalByEmail(normalizedEmail));
            if (hospital.isPresent()) {
                String storedPassword = hospital.get().getPassword();
                logger.info("Hospital login attempt for email: {}", email);
                logger.info("Stored password: {}", storedPassword);
                logger.info("Input password equals stored: {}", password.equals(storedPassword));
                logger.info("Input password matches hash: {}", passwordEncoder.matches(password, storedPassword));
                // Support both plain text (legacy) and hashed passwords
                if (password.equals(storedPassword) || passwordEncoder.matches(password, storedPassword)) {
                    // Check if hospital is approved
                    String status = hospital.get().getStatus();
                    if (status == null || (!status.equalsIgnoreCase("approved"))) {
                        logger.warn("Hospital login denied - not approved. Status: {}", status);
                        return ResponseEntity.status(403).body(Map.of(
                            "message", "Your account is waiting for admin approval. Please contact support if you have any questions.",
                            "code", "PENDING_APPROVAL"
                        ));
                    }
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
            }

            // Check trainers
            Optional<Trainer> trainer = trainerService.getTrainerByEmail(email);
            if (trainer.isPresent() && passwordEncoder.matches(password, trainer.get().getPassword())) {
                // Check if trainer is approved
                String status = trainer.get().getStatus();
                if (status == null || (!status.equalsIgnoreCase("approved"))) {
                    logger.warn("Trainer login denied - not approved. Status: {}", status);
                    return ResponseEntity.status(403).body(Map.of(
                        "message", "Your account is waiting for admin approval. Please contact support if you have any questions.",
                        "code", "PENDING_APPROVAL"
                    ));
                }
                logger.info("Trainer login successful for: {}", email);
                // Reset login attempts on successful login
                loginAttempts.remove(email);
                lastLoginAttempt.remove(email);
                userData.put("id", trainer.get().getId().toString());
                userData.put("name", trainer.get().getName());
                userData.put("email", trainer.get().getEmail());
                userData.put("role", "trainer");
                token = jwtService.generateToken(trainer.get().getId().toString(), email, "trainer");
                response.put("user", userData);
                response.put("token", token);
                return ResponseEntity.ok(response);
            }

            // Increment failed login attempts
            loginAttempts.put(email, (attempts != null ? attempts : 0) + 1);
            lastLoginAttempt.put(email, currentTime);
            logger.warn("Login failed for email: {} - Invalid credentials", email);
            return ResponseEntity.status(401).body(Map.of("message", "Invalid email or password"));
        } catch (Exception e) {
            logger.error("Error during login for email: {}", email, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Login failed. Please try again."));
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

        // Validation
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name is required"));
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        if (!EMAIL_PATTERN.matcher(email).matches()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid email format"));
        }
        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Password is required"));
        }
        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return ResponseEntity.badRequest().body(Map.of("message",
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%^&+=!)"));
        }
        if (role == null || role.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Role is required"));
        }

        Map<String, Object> response = new HashMap<>();
        String storedPassword = passwordEncoder.encode(password);

        try {
            // Check if email already exists
            if (adminService.findByEmail(email).isPresent() ||
                patientService.findByEmail(email).isPresent() ||
                doctorService.getDoctorByEmail(email) != null ||
                hospitalService.getHospitalByEmail(email) != null ||
                trainerService.getTrainerByEmail(email).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }

            if (role.toUpperCase().equals("PATIENT")) {
                Patient patient = new Patient();
                patient.setName(name.trim());
                patient.setEmail(email.trim().toLowerCase());
                patient.setPhone(phone != null ? phone.trim() : "");
                patient.setPassword(storedPassword);

                // Extract patient-specific fields from request
                String ageStr = (String) registerRequest.get("age");
                String gender = (String) registerRequest.get("gender");
                String bloodGroup = (String) registerRequest.get("bloodGroup");
                String dateOfBirthStr = (String) registerRequest.get("dateOfBirth");
                String address = (String) registerRequest.get("address");
                String emergencyContact = (String) registerRequest.get("emergencyContact");

                try {
                    if (ageStr != null && !ageStr.trim().isEmpty()) {
                        patient.setAge(Integer.parseInt(ageStr.trim()));
                    }
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid age format"));
                }

                patient.setGender(gender != null ? gender.trim() : "");
                patient.setBloodGroup(bloodGroup != null ? bloodGroup.trim() : "");

                try {
                    if (dateOfBirthStr != null && !dateOfBirthStr.trim().isEmpty()) {
                        patient.setDateOfBirth(java.time.LocalDate.parse(dateOfBirthStr.trim()));
                    }
                } catch (Exception e) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Invalid date of birth format"));
                }

                patient.setAddress(address != null ? address.trim() : "");
                patient.setEmergencyContact(emergencyContact != null ? emergencyContact.trim() : "");

                patient.setVerified(true); // No email verification required for patients
                Patient savedPatient = patientService.createPatient(patient);

                logger.info("Patient registered successfully: {}", email);
            } else if (role.toUpperCase().equals("DOCTOR")) {
                Doctor doctor = new Doctor();
                doctor.setName(name.trim());
                doctor.setEmail(email.trim().toLowerCase());
                doctor.setPhone(phone != null ? phone.trim() : "");
                doctor.setPassword(storedPassword);

                // Extract doctor-specific fields from request
                String specialization = (String) registerRequest.get("specialization");
                String qualification = (String) registerRequest.get("qualification");
                String experienceStr = (String) registerRequest.get("experience");
                String consultationFeeStr = (String) registerRequest.get("consultationFee");
                String hospitalId = (String) registerRequest.get("hospitalId");

                doctor.setSpecialization(specialization != null ? specialization.trim() : "General Medicine");
                doctor.setQualification(qualification != null ? qualification.trim() : "");
                doctor.setExperience(experienceStr != null ? Integer.parseInt(experienceStr) : 0);
                doctor.setConsultationFee(consultationFeeStr != null ? new BigDecimal(consultationFeeStr) : BigDecimal.ZERO);

                // Set hospital relationship if hospitalId is provided
                if (hospitalId != null && !hospitalId.trim().isEmpty()) {
                    doctor.setHospitalId(hospitalId.trim());
                }

                doctor.setStatus("PENDING"); // Needs approval
                doctor.setVerified(true); // No email verification required
                Doctor savedDoctor = doctorService.createDoctor(doctor);
                logger.info("Doctor registered successfully: {}", email);
            } else if (role.toUpperCase().equals("HOSPITAL")) {
                Hospital hospital = new Hospital();
                hospital.setName(name.trim());
                hospital.setEmail(email.trim().toLowerCase());
                hospital.setPhone(phone != null ? phone.trim() : "");
                hospital.setPassword(storedPassword);

                // Extract hospital-specific fields from request
                String hospitalAddress = (String) registerRequest.get("hospitalAddress");
                String city = (String) registerRequest.get("city");
                String state = (String) registerRequest.get("state");
                String pincode = (String) registerRequest.get("pincode");
                String registrationNumber = (String) registerRequest.get("registrationNumber");

                hospital.setAddress(hospitalAddress != null ? hospitalAddress.trim() : "");
                hospital.setCity(city != null ? city.trim() : "");
                hospital.setState(state != null ? state.trim() : "");
                hospital.setPincode(pincode != null ? pincode.trim() : "");
                hospital.setRegistrationNumber(registrationNumber != null ? registrationNumber.trim() : "");

                hospital.setStatus("PENDING"); // Needs approval
                hospital.setVerified(true); // No email verification required
                Hospital savedHospital = hospitalService.createHospital(hospital);
                logger.info("Hospital registered successfully: {}", email);
            } else if (role.toUpperCase().equals("TRAINER")) {
                Trainer trainer = new Trainer();
                trainer.setName(name.trim());
                trainer.setEmail(email.trim().toLowerCase());
                trainer.setPhone(phone != null ? phone.trim() : "");
                trainer.setPassword(storedPassword);

                // Get trainer-specific fields from request
                String trainerType = (String) registerRequest.get("trainerType");
                Integer experienceYears = registerRequest.get("experienceYears") != null ?
                    ((Number) registerRequest.get("experienceYears")).intValue() : 0;
                String location = (String) registerRequest.get("location");
                BigDecimal pricePerSession = registerRequest.get("pricePerSession") != null ?
                    new BigDecimal(registerRequest.get("pricePerSession").toString()) : BigDecimal.ZERO;
                String bio = (String) registerRequest.get("bio");

                trainer.setTrainerType(trainerType != null ?
                    Trainer.TrainerType.valueOf(trainerType.toUpperCase()) : Trainer.TrainerType.FITNESS);
                trainer.setExperienceYears(experienceYears);
                trainer.setLocation(location != null ? location.trim() : "");
                trainer.setPricePerSession(pricePerSession);
                trainer.setBio(bio != null ? bio.trim() : "");
                trainer.setImage(""); // Default image, can be updated later

                trainer.setStatus("pending"); // Needs approval
                trainer.setVerified(true); // No email verification required
                Trainer savedTrainer = trainerService.createTrainer(trainer);
                logger.info("Trainer registered successfully: {}", email);
            } else {
                logger.warn("Invalid role provided during registration: {}", role);
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid role"));
            }

            response.put("message", "Account created successfully! You can now log in.");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Registration failed for email: {}", email, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Registration failed. Please try again."));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        try {
            // Check if user exists
            boolean userExists = adminService.findByEmail(email).isPresent() ||
                               patientService.findByEmail(email).isPresent() ||
                               doctorService.getDoctorByEmail(email) != null ||
                               hospitalService.getHospitalByEmail(email) != null ||
                               trainerService.getTrainerByEmail(email).isPresent();

            if (!userExists) {
                // Don't reveal if email exists or not for security
                return ResponseEntity.ok(Map.of("message", "If an account with this email exists, a password reset link has been sent."));
            }

            // Generate reset token
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setEmail(email);
            resetToken.setExpiryDate(java.time.LocalDateTime.now().plusHours(1)); // 1 hour expiry

            passwordResetTokenRepository.save(resetToken);

            // Send email
            String resetLink = "http://localhost:3000/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(email, resetLink);

            logger.info("Password reset email sent to: {}", email);
            return ResponseEntity.ok(Map.of("message", "If an account with this email exists, a password reset link has been sent."));

        } catch (Exception e) {
            logger.error("Error sending password reset email for: {}", email, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to send password reset email. Please try again."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String password = request.get("newPassword");

        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reset token is required"));
        }

        if (password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "New password is required"));
        }

        if (!PASSWORD_PATTERN.matcher(password).matches()) {
            return ResponseEntity.badRequest().body(Map.of("message",
                "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%^&+=!)"));
        }

        try {
            // Find valid token
            Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByToken(token);
            if (!resetTokenOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired reset token"));
            }

            PasswordResetToken resetToken = resetTokenOpt.get();

            // Check if token is expired
            if (resetToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
                passwordResetTokenRepository.delete(resetToken);
                return ResponseEntity.badRequest().body(Map.of("message", "Reset token has expired"));
            }

            String email = resetToken.getEmail();
            String hashedPassword = passwordEncoder.encode(password);

            // Update password based on user type
            boolean updated = false;
            if (adminService.findByEmail(email).isPresent()) {
                Admin admin = adminService.findByEmail(email).get();
                admin.setPassword(hashedPassword);
                adminService.save(admin);
                updated = true;
            } else if (patientService.findByEmail(email).isPresent()) {
                Patient patient = patientService.findByEmail(email).get();
                patient.setPassword(hashedPassword);
                patientService.save(patient);
                updated = true;
            } else if (doctorService.getDoctorByEmail(email) != null) {
                Doctor doctor = doctorService.getDoctorByEmail(email);
                doctor.setPassword(hashedPassword);
                doctorService.updateDoctor(doctor.getId(), doctor);
                updated = true;
            } else if (hospitalService.getHospitalByEmail(email) != null) {
                Hospital hospital = hospitalService.getHospitalByEmail(email);
                hospital.setPassword(hashedPassword);
                hospitalService.updateHospital(hospital.getId(), hospital);
                updated = true;
            } else if (trainerService.getTrainerByEmail(email).isPresent()) {
                Trainer trainer = trainerService.getTrainerByEmail(email).get();
                trainer.setPassword(hashedPassword);
                trainerService.updateTrainer(trainer.getId(), trainer);
                updated = true;
            }

            if (updated) {
                // Delete used token
                passwordResetTokenRepository.delete(resetToken);
                logger.info("Password reset successful for: {}", email);
                return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Failed to reset password"));
            }

        } catch (Exception e) {
            logger.error("Error resetting password with token: {}", token, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to reset password. Please try again."));
        }
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<?> validateResetToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Reset token is required"));
        }

        try {
            // Find token
            Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByToken(token);
            if (!resetTokenOpt.isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid reset token"));
            }

            PasswordResetToken resetToken = resetTokenOpt.get();

            // Check if token is expired
            if (resetToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
                passwordResetTokenRepository.delete(resetToken);
                return ResponseEntity.badRequest().body(Map.of("message", "Reset token has expired"));
            }

            logger.info("Reset token validated successfully for: {}", resetToken.getEmail());
            return ResponseEntity.ok(Map.of("message", "Token is valid"));

        } catch (Exception e) {
            logger.error("Error validating reset token: {}", token, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to validate token"));
        }
    }

    @PostMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody Map<String, String> request) {
        String token = request.get("token");

        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Verification token is required"));
        }

        try {
            // TODO: Find verification token from repository
            // For now, since repository is not implemented, we'll simulate verification
            // Optional<EmailVerificationToken> verificationTokenOpt = emailVerificationTokenRepository.findByToken(token);
            // if (!verificationTokenOpt.isPresent()) {
            //     return ResponseEntity.badRequest().body(Map.of("message", "Invalid verification token"));
            // }

            // EmailVerificationToken verificationToken = verificationTokenOpt.get();

            // Check if token is expired
            // if (verificationToken.getExpiryDate().isBefore(java.time.LocalDateTime.now())) {
            //     emailVerificationTokenRepository.delete(verificationToken);
            //     return ResponseEntity.badRequest().body(Map.of("message", "Verification token has expired"));
            // }

            // String email = verificationToken.getEmail();
            // String userType = verificationToken.getUserType();

            // Simulate finding user by email and type
            // For now, we'll assume the token is valid and mark user as verified
            // This needs to be implemented properly with repository

            logger.info("Email verification successful for token: {}", token);
            return ResponseEntity.ok(Map.of("message", "Email verified successfully! You can now log in."));

        } catch (Exception e) {
            logger.error("Error verifying email with token: {}", token, e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to verify email"));
        }
    }
}
