package com.hyno.controller;

import com.hyno.entity.Hospital;
import com.hyno.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @GetMapping
    public List<Hospital> getAllHospitals() {
        return hospitalService.getAllHospitals();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Hospital> getHospitalById(@PathVariable String id) {
        Optional<Hospital> hospital = hospitalService.getHospitalById(id);
        return hospital.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Hospital> getHospitalByEmail(@PathVariable String email) {
        Hospital hospital = hospitalService.getHospitalByEmail(email);
        return hospital != null ? ResponseEntity.ok(hospital) : ResponseEntity.notFound().build();
    }

    @GetMapping("/registration/{registrationNumber}")
    public ResponseEntity<Hospital> getHospitalByRegistrationNumber(@PathVariable String registrationNumber) {
        Hospital hospital = hospitalService.getHospitalByRegistrationNumber(registrationNumber);
        return hospital != null ? ResponseEntity.ok(hospital) : ResponseEntity.notFound().build();
    }

    @GetMapping("/status/{status}")
    public List<Hospital> getHospitalsByStatus(@PathVariable String status) {
        return hospitalService.getHospitalsByStatus(status);
    }

    @GetMapping("/city/{city}")
    public List<Hospital> getHospitalsByCity(@PathVariable String city) {
        return hospitalService.getHospitalsByCity(city);
    }

    @PostMapping
    public Hospital createHospital(@RequestBody Hospital hospital) {
        return hospitalService.createHospital(hospital);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Hospital> updateHospital(@PathVariable String id, @RequestBody Hospital hospitalDetails) {
        Hospital updatedHospital = hospitalService.updateHospital(id, hospitalDetails);
        return updatedHospital != null ? ResponseEntity.ok(updatedHospital) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Hospital> approveHospital(@PathVariable String id) {
        Hospital approvedHospital = hospitalService.approveHospital(id);
        return approvedHospital != null ? ResponseEntity.ok(approvedHospital) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Hospital> rejectHospital(@PathVariable String id) {
        Hospital rejectedHospital = hospitalService.rejectHospital(id);
        return rejectedHospital != null ? ResponseEntity.ok(rejectedHospital) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHospital(@PathVariable String id) {
        hospitalService.deleteHospital(id);
        return ResponseEntity.ok().build();
    }
}
