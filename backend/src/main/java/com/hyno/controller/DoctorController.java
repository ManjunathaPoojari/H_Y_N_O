package com.hyno.controller;

import com.hyno.entity.Doctor;
import com.hyno.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable String id) {
        Optional<Doctor> doctor = doctorService.getDoctorById(id);
        return doctor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Doctor> getDoctorByEmail(@PathVariable String email) {
        Doctor doctor = doctorService.getDoctorByEmail(email);
        return doctor != null ? ResponseEntity.ok(doctor) : ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public List<Doctor> getDoctorsByStatus(@PathVariable String status) {
        return doctorService.getDoctorsByStatus(status);
    }

    @GetMapping("/hospital/{hospitalId}")
    public List<Doctor> getDoctorsByHospital(@PathVariable String hospitalId) {
        return doctorService.getDoctorsByHospital(hospitalId);
    }

    @GetMapping("/specialization/{specialization}")
    public List<Doctor> getDoctorsBySpecialization(@PathVariable String specialization) {
        return doctorService.getDoctorsBySpecialization(specialization);
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.createDoctor(doctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable String id, @RequestBody Doctor doctorDetails) {
        Doctor updatedDoctor = doctorService.updateDoctor(id, doctorDetails);
        return updatedDoctor != null ? ResponseEntity.ok(updatedDoctor) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Doctor> approveDoctor(@PathVariable String id) {
        Doctor approvedDoctor = doctorService.approveDoctor(id);
        return approvedDoctor != null ? ResponseEntity.ok(approvedDoctor) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/suspend")
    public ResponseEntity<Doctor> suspendDoctor(@PathVariable String id) {
        Doctor suspendedDoctor = doctorService.suspendDoctor(id);
        return suspendedDoctor != null ? ResponseEntity.ok(suspendedDoctor) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok().build();
    }
}
