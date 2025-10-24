package com.hyno.controller;

import com.hyno.entity.Appointment;
import com.hyno.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:3000")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable String id) {
        Optional<Appointment> appointment = appointmentService.getAppointmentById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Appointment> getAppointmentsByPatient(@PathVariable String patientId) {
        return appointmentService.getAppointmentsByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(@PathVariable String doctorId) {
        return appointmentService.getAppointmentsByDoctor(doctorId);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Appointment> getAppointmentsByHospital(@PathVariable String hospitalId) {
        return appointmentService.getAppointmentsByHospital(hospitalId);
    }

    @GetMapping("/status/{status}")
    public List<Appointment> getAppointmentsByStatus(@PathVariable Appointment.AppointmentStatus status) {
        return appointmentService.getAppointmentsByStatus(status);
    }

    @GetMapping("/date/{date}")
    public List<Appointment> getAppointmentsByDate(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return appointmentService.getAppointmentsByDate(date);
    }

    @GetMapping("/upcoming")
    public List<Appointment> getUpcomingAppointments(@RequestParam String userId, @RequestParam String userType) {
        if ("patient".equals(userType)) {
            return appointmentService.getUpcomingAppointmentsByPatient(userId);
        } else if ("doctor".equals(userType)) {
            return appointmentService.getUpcomingAppointmentsByDoctor(userId);
        }
        return List.of();
    }

    @PostMapping
    public Appointment createAppointment(@RequestBody Appointment appointment) {
        return appointmentService.createAppointment(appointment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable String id, @RequestBody Appointment appointmentDetails) {
        Appointment updatedAppointment = appointmentService.updateAppointment(id, appointmentDetails);
        return updatedAppointment != null ? ResponseEntity.ok(updatedAppointment) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable String id) {
        Appointment cancelledAppointment = appointmentService.cancelAppointment(id);
        return cancelledAppointment != null ? ResponseEntity.ok(cancelledAppointment) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Appointment> completeAppointment(@PathVariable String id) {
        Appointment completedAppointment = appointmentService.completeAppointment(id);
        return completedAppointment != null ? ResponseEntity.ok(completedAppointment) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<Appointment> confirmAppointment(@PathVariable String id) {
        Appointment confirmedAppointment = appointmentService.confirmAppointment(id);
        return confirmedAppointment != null ? ResponseEntity.ok(confirmedAppointment) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable String id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok().build();
    }
}
