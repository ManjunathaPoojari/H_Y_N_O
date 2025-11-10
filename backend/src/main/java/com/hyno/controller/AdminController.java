package com.hyno.controller;

import com.hyno.entity.Admin;
import com.hyno.entity.Patient;
import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
import com.hyno.entity.Appointment;
import com.hyno.service.AdminService;
import com.hyno.service.PatientService;
import com.hyno.service.DoctorService;
import com.hyno.service.HospitalService;
import com.hyno.service.AppointmentService;
import com.hyno.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class AdminController {

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
    private JwtService jwtService;

    // Dashboard Statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        List<Patient> patients = patientService.getAllPatients();
        List<Doctor> doctors = doctorService.getAllDoctors();
        List<Hospital> hospitals = hospitalService.getAllHospitals();
        List<Appointment> appointments = appointmentService.getAllAppointments();

        stats.put("totalPatients", patients.size());
        stats.put("totalDoctors", doctors.size());
        stats.put("totalHospitals", hospitals.size());
        stats.put("totalAppointments", appointments.size());

        // Pending approvals
        long pendingDoctors = doctors.stream().filter(d -> "pending".equals(d.getStatus())).count();
        long pendingHospitals = hospitals.stream().filter(h -> "pending".equals(h.getStatus())).count();
        stats.put("pendingApprovals", pendingDoctors + pendingHospitals);

        // Active appointments (upcoming)
        long activeAppointments = appointments.stream()
            .filter(a -> "upcoming".equals(a.getStatus().toString().toLowerCase()))
            .count();
        stats.put("activeAppointments", activeAppointments);

        // Emergency requests (placeholder - would need additional logic)
        stats.put("emergencies", 2);

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
    public ResponseEntity<Void> deleteHospital(@PathVariable String id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.ok().build();
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
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Appointment appointmentDetails) {
        Appointment updatedAppointment = appointmentService.updateAppointment(id, appointmentDetails);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable String id) {
        Appointment cancelledAppointment = appointmentService.cancelAppointment(id);
        return cancelledAppointment != null ? ResponseEntity.ok(cancelledAppointment) : ResponseEntity.notFound().build();
    }

    @PutMapping("/appointments/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable String id) {
        Appointment completedAppointment = appointmentService.completeAppointment(id);
        return completedAppointment != null ? ResponseEntity.ok(completedAppointment) : ResponseEntity.notFound().build();
    }

    @PutMapping("/appointments/{id}/confirm")
    public ResponseEntity<Appointment> confirmAppointment(@PathVariable String id) {
        Appointment confirmedAppointment = appointmentService.confirmAppointment(id);
        return confirmedAppointment != null ? ResponseEntity.ok(confirmedAppointment) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/appointments/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }

    // Admin Management
    @GetMapping("/admins")
    public List<Admin> getAllAdmins() {
        return adminService.getAllAdmins();
    }

    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        if (email == null || email.trim().isEmpty() || password == null || password.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email and password are required"));
        }

        try {
            Optional<Admin> admin = adminService.findByEmail(email);
            if (admin.isPresent() && adminService.getPasswordEncoder().matches(password, admin.get().getPassword())) {
                Map<String, Object> response = new HashMap<>();
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", admin.get().getId());
                userData.put("name", admin.get().getName());
                userData.put("email", admin.get().getEmail());
                userData.put("role", "admin");

                // Generate JWT token
                String token = jwtService.generateToken(admin.get().getId(), email, "admin");

                response.put("user", userData);
                response.put("token", token);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid email or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Login failed. Please try again."));
        }
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
    @GetMapping("/pending/doctors")
    public List<Doctor> getPendingDoctors() {
        return doctorService.getDoctorsByStatus("pending");
    }

    @GetMapping("/pending/hospitals")
    public List<Hospital> getPendingHospitals() {
        return hospitalService.getHospitalsByStatus("pending");
    }
}
