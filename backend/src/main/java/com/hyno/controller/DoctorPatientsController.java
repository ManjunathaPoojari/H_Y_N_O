package com.hyno.controller;

import com.hyno.entity.Appointment;
import com.hyno.entity.Patient;
import com.hyno.repository.AppointmentRepository;
import com.hyno.repository.PatientRepository;
import com.hyno.service.AppointmentService;
import com.hyno.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors/{doctorId}/patients")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class DoctorPatientsController {

    @Autowired
    private PatientService patientService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getDoctorPatients(@PathVariable String doctorId) {
        try {
            // Get all appointments for this doctor
            List<Appointment> appointments = appointmentRepository.findByDoctor_Id(doctorId);

            // Get unique patient IDs
            Set<String> patientIds = appointments.stream()
                    .map(Appointment::getPatientId)
                    .collect(Collectors.toSet());

            // Get patient details
            List<Map<String, Object>> patients = new ArrayList<>();
            for (String patientId : patientIds) {
                Optional<Patient> patientOpt = patientRepository.findById(patientId);
                if (patientOpt.isPresent()) {
                    Patient patient = patientOpt.get();

                    // Get patient stats
                    List<Appointment> patientAppointments = appointments.stream()
                            .filter(app -> app.getPatientId().equals(patientId))
                            .collect(Collectors.toList());

                    long totalVisits = patientAppointments.size();
                    long completedVisits = patientAppointments.stream()
                            .filter(app -> "COMPLETED".equals(app.getStatus()))
                            .count();

                    // Find last visit
                    Optional<Appointment> lastCompletedAppointment = patientAppointments.stream()
                            .filter(app -> "COMPLETED".equals(app.getStatus()))
                            .max(Comparator.comparing(Appointment::getAppointmentDate));

                    String lastVisitDate = lastCompletedAppointment
                            .map(app -> app.getAppointmentDate().toString())
                            .orElse("Never");

                    Map<String, Object> patientData = new HashMap<>();
                    patientData.put("id", patient.getId());
                    patientData.put("name", patient.getName());
                    patientData.put("email", patient.getEmail());
                    patientData.put("phone", patient.getPhone());
                    patientData.put("dateOfBirth", patient.getDateOfBirth() != null ? patient.getDateOfBirth().toString() : null);
                    patientData.put("gender", patient.getGender());
                    patientData.put("address", patient.getAddress());
                    patientData.put("medicalHistory", patient.getMedicalHistory() != null ? patient.getMedicalHistory() : new ArrayList<>());
                    patientData.put("allergies", patient.getAllergies() != null ? patient.getAllergies() : new ArrayList<>());
                    patientData.put("currentMedications", patient.getCurrentMedications() != null ? patient.getCurrentMedications() : new ArrayList<>());
                    patientData.put("emergencyContact", patient.getEmergencyContact() != null ? patient.getEmergencyContact() : new HashMap<>());
                    patientData.put("lastVisit", lastVisitDate);
                    patientData.put("totalVisits", totalVisits);
                    patientData.put("completedVisits", completedVisits);

                    patients.add(patientData);
                }
            }

            return ResponseEntity.ok(patients);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<Map<String, Object>> getPatientDetails(
            @PathVariable String doctorId,
            @PathVariable String patientId) {
        try {
            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            if (!patientOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Patient patient = patientOpt.get();

            // Get appointments for this patient with this doctor
            List<Appointment> appointments = appointmentRepository.findByDoctorIdAndPatientId(doctorId, patientId);

            Map<String, Object> patientData = new HashMap<>();
            patientData.put("id", patient.getId());
            patientData.put("name", patient.getName());
            patientData.put("email", patient.getEmail());
            patientData.put("phone", patient.getPhone());
            patientData.put("dateOfBirth", patient.getDateOfBirth() != null ? patient.getDateOfBirth().toString() : null);
            patientData.put("gender", patient.getGender());
            patientData.put("address", patient.getAddress());
            patientData.put("medicalHistory", patient.getMedicalHistory() != null ? patient.getMedicalHistory() : new ArrayList<>());
            patientData.put("allergies", patient.getAllergies() != null ? patient.getAllergies() : new ArrayList<>());
            patientData.put("currentMedications", patient.getCurrentMedications() != null ? patient.getCurrentMedications() : new ArrayList<>());
            patientData.put("emergencyContact", patient.getEmergencyContact() != null ? patient.getEmergencyContact() : new HashMap<>());

            // Add appointment history
            List<Map<String, Object>> appointmentHistory = appointments.stream()
                    .sorted((a, b) -> b.getAppointmentDate().compareTo(a.getAppointmentDate()))
                    .map(app -> {
                        Map<String, Object> appData = new HashMap<>();
                        appData.put("id", app.getId());
                        appData.put("date", app.getAppointmentDate().toString());
                        appData.put("time", app.getTime());
                        appData.put("type", app.getType());
                        appData.put("status", app.getStatus());
                        appData.put("reason", app.getReason());
                        appData.put("notes", app.getNotes());
                        return appData;
                    })
                    .collect(Collectors.toList());

            patientData.put("appointmentHistory", appointmentHistory);

            return ResponseEntity.ok(patientData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{patientId}/notes")
    public ResponseEntity<Map<String, Object>> addPatientNote(
            @PathVariable String doctorId,
            @PathVariable String patientId,
            @RequestBody Map<String, String> noteData) {
        try {
            String note = noteData.get("note");
            if (note == null || note.trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            // Find the most recent appointment for this patient
            List<Appointment> appointments = appointmentRepository.findByDoctorIdAndPatientId(doctorId, patientId);
            Optional<Appointment> latestAppointment = appointments.stream()
                    .max(Comparator.comparing(Appointment::getAppointmentDate));

            if (latestAppointment.isPresent()) {
                Appointment appointment = latestAppointment.get();
                String existingNotes = appointment.getNotes() != null ? appointment.getNotes() : "";
                String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                String newNotes = existingNotes + "\n\n[" + timestamp + "] " + note;

                appointment.setNotes(newNotes);
                appointmentRepository.save(appointment);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "Note added successfully");
                response.put("appointmentId", appointment.getId());

                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
