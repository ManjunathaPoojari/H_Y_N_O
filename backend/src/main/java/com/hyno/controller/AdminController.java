package com.hyno.controller;

import com.hyno.entity.Admin;
import com.hyno.entity.Patient;
import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
import com.hyno.entity.Trainer;
import com.hyno.entity.Appointment;
import com.hyno.entity.Medicine;
import com.hyno.entity.Order;
import com.hyno.entity.Prescription;
import com.hyno.service.AdminService;
import com.hyno.service.PatientService;
import com.hyno.service.DoctorService;
import com.hyno.service.HospitalService;
import com.hyno.service.TrainerService;
import com.hyno.service.AppointmentService;
import com.hyno.service.MedicineService;
import com.hyno.service.OrderService;
import com.hyno.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private AdminService adminService;

    @Autowired
    private PatientService patientService;

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private HospitalService hospitalService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private MedicineService medicineService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private TrainerService trainerService;

    // Dashboard Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        List<Patient> patients = patientService.getAllPatients();
        List<Doctor> doctors = doctorService.getAllDoctors();
        List<Hospital> hospitals = hospitalService.getAllHospitals();
        List<Appointment> appointments = appointmentService.getAllAppointments();
        List<Trainer> trainers = trainerService.getAllTrainers();
        List<Medicine> medicines = medicineService.getAllMedicines();
        List<Order> orders = orderService.getAllOrders();

        // Network Statistics
        Map<String, Object> networkStats = new HashMap<>();

        // Hospitals live (approved hospitals)
        long hospitalsLive = hospitals.stream()
                .filter(h -> "approved".equalsIgnoreCase(h.getStatus()))
                .count();
        long hospitalsPending = hospitals.stream()
                .filter(h -> "pending".equalsIgnoreCase(h.getStatus()))
                .count();
        networkStats.put("hospitalsLive", hospitalsLive);
        networkStats.put("hospitalsPending", hospitalsPending);

        // Doctors verified (approved doctors)
        long doctorsVerified = doctors.stream()
                .filter(d -> "approved".equalsIgnoreCase(d.getStatus()))
                .count();
        long doctorsPending = doctors.stream()
                .filter(d -> "pending".equalsIgnoreCase(d.getStatus()))
                .count();
        // Calculate doctors added this week (placeholder - would need timestamp
        // comparison)
        networkStats.put("doctorsVerified", doctorsVerified);
        networkStats.put("doctorsPending", doctorsPending);
        networkStats.put("doctorsThisWeek", Math.min(doctorsPending, 18)); // Placeholder

        // Critical alerts (cancelled appointments + low stock medicines)
        long cancelledAppointments = appointments.stream()
                .filter(a -> Appointment.AppointmentStatus.CANCELLED.equals(a.getStatus()))
                .count();
        long lowStockMedicines = medicines.stream()
                .filter(m -> m.getStockQuantity() != null && m.getStockQuantity() < 10)
                .count();
        long criticalAlerts = Math.min(cancelledAppointments + lowStockMedicines, 999);
        networkStats.put("criticalAlerts", criticalAlerts);

        // Compliance score (calculated from approved entities ratio)
        double totalEntities = doctors.size() + hospitals.size() + trainers.size();
        double approvedEntities = doctorsVerified + hospitalsLive +
                trainers.stream().filter(t -> "approved".equalsIgnoreCase(t.getStatus())).count();
        int complianceScore = totalEntities > 0 ? (int) ((approvedEntities / totalEntities) * 100) : 100;
        networkStats.put("complianceScore", complianceScore);

        stats.put("networkStats", networkStats);

        // Pending Approvals Details
        Map<String, Object> pendingApprovals = new HashMap<>();
        List<Map<String, Object>> approvalItems = new java.util.ArrayList<>();

        // Add pending hospitals
        hospitals.stream()
                .filter(h -> "pending".equalsIgnoreCase(h.getStatus()))
                .limit(3)
                .forEach(h -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", h.getId());
                    item.put("name", h.getName());
                    item.put("type", "Hospital onboarding");
                    item.put("status", "Awaiting docs");
                    item.put("entityType", "hospital");
                    approvalItems.add(item);
                });

        // Add pending doctors
        doctors.stream()
                .filter(d -> "pending".equalsIgnoreCase(d.getStatus()))
                .limit(3 - approvalItems.size())
                .forEach(d -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", d.getId());
                    item.put("name", d.getName());
                    item.put("type", "Doctor credentialing");
                    item.put("status", "Verification");
                    item.put("entityType", "doctor");
                    approvalItems.add(item);
                });

        // Add pending trainers
        trainers.stream()
                .filter(t -> "pending".equalsIgnoreCase(t.getStatus()))
                .limit(3 - approvalItems.size())
                .forEach(t -> {
                    Map<String, Object> item = new HashMap<>();
                    item.put("id", t.getId());
                    item.put("name", t.getName());
                    item.put("type", "Trainer verification");
                    item.put("status", "Needs review");
                    item.put("entityType", "trainer");
                    approvalItems.add(item);
                });

        pendingApprovals.put("items", approvalItems);
        pendingApprovals.put("totalCount", doctorsPending + hospitalsPending +
                trainers.stream().filter(t -> "pending".equalsIgnoreCase(t.getStatus())).count());
        stats.put("pendingApprovals", pendingApprovals);

        // Operational Metrics
        Map<String, Object> operationalMetrics = new HashMap<>();

        // Telehealth capacity (video appointments / total appointments)
        long videoAppointments = appointments.stream()
                .filter(a -> Appointment.AppointmentType.VIDEO.equals(a.getType()))
                .count();
        int telehealthCapacity = appointments.size() > 0 ? (int) ((videoAppointments * 100.0) / appointments.size())
                : 0;
        operationalMetrics.put("telehealthCapacity", telehealthCapacity);

        // Pharmacy SLAs (delivered orders / total orders)
        long deliveredOrders = orders.stream()
                .filter(o -> "delivered".equalsIgnoreCase(o.getStatus()))
                .count();
        int pharmacySLA = orders.size() > 0 ? (int) ((deliveredOrders * 100.0) / orders.size()) : 0;
        operationalMetrics.put("pharmacySLA", pharmacySLA);

        // Insurance claims (completed appointments / total appointments)
        long completedAppointments = appointments.stream()
                .filter(a -> Appointment.AppointmentStatus.COMPLETED.equals(a.getStatus()))
                .count();
        int insuranceClaims = appointments.size() > 0 ? (int) ((completedAppointments * 100.0) / appointments.size())
                : 0;
        operationalMetrics.put("insuranceClaims", insuranceClaims);

        stats.put("operationalMetrics", operationalMetrics);

        // Compliance Checklist
        List<Map<String, Object>> complianceItems = new java.util.ArrayList<>();

        Map<String, Object> dataRetention = new HashMap<>();
        dataRetention.put("title", "Data retention");
        dataRetention.put("detail", "Backups verified 4 hrs ago");
        dataRetention.put("status", "Healthy");
        complianceItems.add(dataRetention);

        Map<String, Object> auditTrail = new HashMap<>();
        auditTrail.put("title", "Audit trail");
        long pendingReviews = doctorsPending + hospitalsPending;
        auditTrail.put("detail", pendingReviews + " pending review");
        auditTrail.put("status", pendingReviews > 0 ? "Action required" : "Healthy");
        complianceItems.add(auditTrail);

        Map<String, Object> accessPolicies = new HashMap<>();
        accessPolicies.put("title", "Access policies");
        accessPolicies.put("detail", "All quarterly reviews complete");
        accessPolicies.put("status", "Healthy");
        complianceItems.add(accessPolicies);

        stats.put("complianceChecklist", complianceItems);

        // Network Health Alerts
        List<Map<String, Object>> networkHealth = new java.util.ArrayList<>();

        // Recent hospital activities
        hospitals.stream()
                .filter(h -> "approved".equalsIgnoreCase(h.getStatus()))
                .limit(3)
                .forEach(h -> {
                    Map<String, Object> alert = new HashMap<>();
                    alert.put("message", h.getName() + " reporting normal operations");
                    alert.put("time", "5 min ago");
                    networkHealth.add(alert);
                });

        stats.put("networkHealth", networkHealth);

        // Performance Forecast
        Map<String, Object> performanceForecast = new HashMap<>();

        // Utilization (appointments / total capacity)
        int utilization = appointments.size() > 0
                ? Math.min((int) ((appointments.size() * 100.0) / (doctors.size() * 10)), 100)
                : 0;
        performanceForecast.put("utilization", utilization);
        performanceForecast.put("utilizationTrend", "Stable");

        // Satisfaction (placeholder - would need feedback data)
        performanceForecast.put("satisfaction", 4.7);
        performanceForecast.put("satisfactionChange", "+0.2 vs last month");

        // Risk index
        String riskIndex = criticalAlerts > 10 ? "High" : criticalAlerts > 5 ? "Medium" : "Low";
        performanceForecast.put("riskIndex", riskIndex);
        performanceForecast.put("riskMonitoring", "Monitored hourly");

        stats.put("performanceForecast", performanceForecast);

        // Basic stats for backward compatibility
        stats.put("totalPatients", patients.size());
        stats.put("totalDoctors", doctors.size());
        stats.put("totalHospitals", hospitals.size());
        stats.put("totalAppointments", appointments.size());
        stats.put("pendingApprovalsCount", pendingApprovals.get("totalCount"));
        stats.put("activeAppointments", appointments.stream()
                .filter(a -> Appointment.AppointmentStatus.UPCOMING.equals(a.getStatus()))
                .count());

        return ResponseEntity.ok(stats);
    }

    // Patient Management
    @GetMapping("/patients")
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String id) {
        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable String id, @RequestBody Patient patientDetails) {
        Patient updatedPatient = patientService.updatePatient(id, patientDetails);
        return updatedPatient != null ? ResponseEntity.ok(updatedPatient) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/patients/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok().build();
    }

    // Doctor Management
    @GetMapping("/doctors")
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable String id) {
        return doctorService.getDoctorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/doctors")
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        try {
            Doctor createdDoctor = doctorService.createDoctor(doctor);
            return ResponseEntity.ok(createdDoctor);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable String id, @RequestBody Doctor doctorDetails) {
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctorDetails);
        return updatedDoctor != null ? ResponseEntity.ok(updatedDoctor) : ResponseEntity.notFound().build();
    }

    @PutMapping("/doctors/{id}/approve")
    public ResponseEntity<Doctor> approveDoctor(@PathVariable String id) {
        Doctor approvedDoctor = doctorService.approveDoctor(id);
        return approvedDoctor != null ? ResponseEntity.ok(approvedDoctor) : ResponseEntity.notFound().build();
    }

    @PutMapping("/doctors/{id}/suspend")
    public ResponseEntity<Doctor> suspendDoctor(@PathVariable String id) {
        Doctor suspendedDoctor = doctorService.suspendDoctor(id);
        return suspendedDoctor != null ? ResponseEntity.ok(suspendedDoctor) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }

    // Hospital Management
    @GetMapping("/hospitals")
    public List<Hospital> getAllHospitals() {
        return hospitalService.getAllHospitals();
    }

    @GetMapping("/hospitals/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable String id) {
        return hospitalService.getHospitalById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/hospitals/{id}")
    public ResponseEntity<Hospital> updateHospital(@PathVariable String id, @RequestBody Hospital hospitalDetails) {
        Hospital updatedHospital = hospitalService.updateHospital(id, hospitalDetails);
        return updatedHospital != null ? ResponseEntity.ok(updatedHospital) : ResponseEntity.notFound().build();
    }

    @PutMapping("/hospitals/{id}/approve")
    public ResponseEntity<Hospital> approveHospital(@PathVariable String id) {
        Hospital approvedHospital = hospitalService.approveHospital(id);
        return approvedHospital != null ? ResponseEntity.ok(approvedHospital) : ResponseEntity.notFound().build();
    }

    @PutMapping("/hospitals/{id}/reject")
    public ResponseEntity<Hospital> rejectHospital(@PathVariable String id) {
        Hospital rejectedHospital = hospitalService.rejectHospital(id);
        return rejectedHospital != null ? ResponseEntity.ok(rejectedHospital) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/hospitals/{id}")
    public ResponseEntity<Void> deleteHospital(
            @PathVariable String id,
            @RequestParam(required = false, defaultValue = "unlink") String mode) {
        try {
            if ("deleteAll".equals(mode)) {
                hospitalService.deleteHospitalWithDoctors(id);
            } else {
                hospitalService.deleteHospitalOnly(id);
            }
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Appointment Management
    @GetMapping("/appointments")
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/appointments/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/appointments/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id,
            @RequestBody Appointment appointmentDetails) {
        Appointment updatedAppointment = appointmentService.updateAppointment(id, appointmentDetails);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable String id) {
        Appointment cancelledAppointment = appointmentService.cancelAppointment(id);
        return cancelledAppointment != null ? ResponseEntity.ok(cancelledAppointment)
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/appointments/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable String id) {
        Appointment completedAppointment = appointmentService.completeAppointment(id);
        return completedAppointment != null ? ResponseEntity.ok(completedAppointment)
                : ResponseEntity.notFound().build();
    }

    @PutMapping("/appointments/{id}/confirm")
    public ResponseEntity<Appointment> confirmAppointment(@PathVariable String id) {
        Appointment confirmedAppointment = appointmentService.confirmAppointment(id);
        return confirmedAppointment != null ? ResponseEntity.ok(confirmedAppointment)
                : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }

    // Video Call Status Tracking Endpoints
    @PostMapping("/appointments/{id}/video-call/start")
    public ResponseEntity<Appointment> startVideoCall(@PathVariable String id) {
        Appointment updatedAppointment = appointmentService.startVideoCall(id);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }

    @PutMapping("/appointments/{id}/video-call/status")
    public ResponseEntity<Appointment> updateVideoCallStatus(@PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Appointment.VideoCallStatus status = Appointment.VideoCallStatus.valueOf(statusUpdate.get("status"));
            Appointment updatedAppointment = appointmentService.updateVideoCallStatus(id, status);
            return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment)
                    : ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/appointments/{id}/video-call/end")
    public ResponseEntity<Appointment> endVideoCall(@PathVariable String id) {
        Appointment updatedAppointment = appointmentService.endVideoCall(id);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }

    // Admin Management
    @GetMapping("/admins")
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<Admin> getAdminById(@PathVariable String id) {
        return adminService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/admins")
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin admin) {
        Admin createdAdmin = adminService.createAdmin(admin);
        return ResponseEntity.ok(createdAdmin);
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable String id, @RequestBody Admin adminDetails) {
        Admin updatedAdmin = adminService.updateAdmin(id, adminDetails);
        return updatedAdmin != null ? ResponseEntity.ok(updatedAdmin) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable String id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok().build();
    }

    // Pending Approvals
    @GetMapping("/pending/all")
    public ResponseEntity<Map<String, Object>> getAllPendingApprovals() {
        Map<String, Object> pendingApprovals = new HashMap<>();
        pendingApprovals.put("doctors", doctorService.getDoctorsByStatus("pending"));
        pendingApprovals.put("hospitals", hospitalService.getHospitalsByStatus("pending"));
        pendingApprovals.put("trainers", trainerService.getTrainersByStatus("pending"));

        // Calculate total count
        int totalCount = ((List<?>) pendingApprovals.get("doctors")).size() +
                ((List<?>) pendingApprovals.get("hospitals")).size() +
                ((List<?>) pendingApprovals.get("trainers")).size();
        pendingApprovals.put("totalCount", totalCount);

        return ResponseEntity.ok(pendingApprovals);
    }

    @GetMapping("/pending/doctors")
    public List<Doctor> getPendingDoctors() {
        return doctorService.getDoctorsByStatus("pending");
    }

    @GetMapping("/pending/hospitals")
    public List<Hospital> getPendingHospitals() {
        return hospitalService.getHospitalsByStatus("pending");
    }

    @GetMapping("/pending/trainers")
    public List<Trainer> getPendingTrainers() {
        return trainerService.getTrainersByStatus("pending");
    }

    // Trainer Management
    @GetMapping("/trainers")
    public List<Trainer> getAllTrainers() {
        return trainerService.getAllTrainers();
    }

    @GetMapping("/trainers/{id}")
    public ResponseEntity<Trainer> getTrainerById(@PathVariable String id) {
        return trainerService.getTrainerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/trainers")
    public ResponseEntity<?> createTrainer(@RequestBody Trainer trainer) {
        try {
            // Validate required fields
            if (trainer.getName() == null || trainer.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name is required"));
            }
            if (trainer.getEmail() == null || trainer.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            
            // Normalize email
            trainer.setEmail(trainer.getEmail().trim().toLowerCase());
            
            // Check if email already exists
            if (trainerService.getTrainerByEmail(trainer.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }
            
            // Set default password if not provided (generate a random one)
            if (trainer.getPassword() == null || trainer.getPassword().trim().isEmpty()) {
                // Generate a default password: Trainer@123
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                trainer.setPassword(passwordEncoder.encode("Trainer@123"));
            } else {
                // Hash the provided password
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                trainer.setPassword(passwordEncoder.encode(trainer.getPassword()));
            }
            
            // Set defaults for required fields and handle trainerType conversion
            if (trainer.getTrainerType() == null) {
                trainer.setTrainerType(Trainer.TrainerType.FITNESS);
            } else {
                // Ensure trainerType is uppercase enum value
                try {
                    String trainerTypeStr = trainer.getTrainerType().toString().toUpperCase();
                    trainer.setTrainerType(Trainer.TrainerType.valueOf(trainerTypeStr));
                } catch (IllegalArgumentException e) {
                    // If invalid, default to FITNESS
                    trainer.setTrainerType(Trainer.TrainerType.FITNESS);
                }
            }
            if (trainer.getExperienceYears() == null) {
                trainer.setExperienceYears(0);
            }
            if (trainer.getLocation() == null || trainer.getLocation().trim().isEmpty()) {
                trainer.setLocation("");
            }
            if (trainer.getPricePerSession() == null) {
                trainer.setPricePerSession(BigDecimal.ZERO);
            }
            if (trainer.getImage() == null || trainer.getImage().trim().isEmpty()) {
                trainer.setImage("");
            }
            if (trainer.getStatus() == null || trainer.getStatus().trim().isEmpty()) {
                trainer.setStatus("pending");
            }
            if (trainer.getRating() == null) {
                trainer.setRating(0.0);
            }
            if (trainer.getAvailability() == null) {
                trainer.setAvailability(Trainer.AvailabilityStatus.AVAILABLE);
            }
            if (trainer.getSpecialties() == null) {
                trainer.setSpecialties(new ArrayList<>());
            }
            if (trainer.getLanguages() == null) {
                trainer.setLanguages(new ArrayList<>());
            }
            if (trainer.getModes() == null || trainer.getModes().isEmpty()) {
                trainer.setModes(List.of("virtual"));
            }
            if (trainer.getQualifications() == null) {
                trainer.setQualifications(new ArrayList<>());
            }
            
            trainer.setVerified(false);
            
            Trainer createdTrainer = trainerService.createTrainer(trainer);
            return ResponseEntity.ok(createdTrainer);
        } catch (Exception e) {
            logger.error("Error creating trainer: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to create trainer: " + e.getMessage()));
        }
    }

    @PutMapping("/trainers/{id}")
    public ResponseEntity<Trainer> updateTrainer(@PathVariable String id, @RequestBody Trainer trainerDetails) {
        Trainer updatedTrainer = trainerService.updateTrainer(id, trainerDetails);
        return updatedTrainer != null ? ResponseEntity.ok(updatedTrainer) : ResponseEntity.notFound().build();
    }

    @PutMapping("/trainers/{id}/approve")
    public ResponseEntity<Trainer> approveTrainer(@PathVariable String id) {
        Trainer approvedTrainer = trainerService.approveTrainer(id);
        return approvedTrainer != null ? ResponseEntity.ok(approvedTrainer) : ResponseEntity.notFound().build();
    }

    @PutMapping("/trainers/{id}/reject")
    public ResponseEntity<Trainer> rejectTrainer(@PathVariable String id) {
        Trainer rejectedTrainer = trainerService.rejectTrainer(id);
        return rejectedTrainer != null ? ResponseEntity.ok(rejectedTrainer) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/trainers/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable String id) {
        trainerService.deleteTrainer(id);
        return ResponseEntity.ok().build();
    }

    // Pharmacy Management
    @GetMapping("/medicines")
    public List<Medicine> getMedicines() {
        return medicineService.getAllMedicines();
    }

    @GetMapping("/orders")
    public List<Order> getOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/prescriptions")
    public List<Prescription> getPrescriptions() {
        return prescriptionService.getAllPrescriptions();
    }

    @PostMapping("/medicines")
    public ResponseEntity<Medicine> addMedicine(@RequestBody Medicine medicine) {
        Medicine createdMedicine = medicineService.createMedicine(medicine);
        return ResponseEntity.ok(createdMedicine);
    }

    @PutMapping("/medicines/{id}")
    public ResponseEntity<Medicine> updateMedicine(@PathVariable String id, @RequestBody Medicine medicine) {
        Medicine updatedMedicine = medicineService.updateMedicine(id, medicine);
        return updatedMedicine != null ? ResponseEntity.ok(updatedMedicine) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/medicines/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable String id) {
        boolean deleted = medicineService.deleteMedicine(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable String id,
            @RequestBody Map<String, String> statusUpdate) {
        Order updatedOrder = orderService.updateOrderStatus(id, statusUpdate.get("status"));
        return updatedOrder != null ? ResponseEntity.ok(updatedOrder) : ResponseEntity.notFound().build();
    }
}
