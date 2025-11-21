package com.hyno.controller;

import com.hyno.entity.Doctor;
import com.hyno.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.PrintWriter;
import java.io.StringWriter;

@RestController
@RequestMapping("/api/diagnostic")
public class DiagnosticController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("/test")
    public String test() {
        return "Diagnostic Controller is working";
    }

    @GetMapping("/update-doctor/{id}")
    public ResponseEntity<String> updateDoctor(@PathVariable String id) {
        try {
            Doctor doctorDetails = new Doctor();
            doctorDetails.setPhone("1234567890");

            if (doctorService == null) {
                return ResponseEntity.ok("Error: doctorService is null");
            }

            Doctor updated = doctorService.updateDoctor(id, doctorDetails);
            if (updated != null) {
                return ResponseEntity.ok("Doctor updated successfully: " + updated.getPhone());
            } else {
                return ResponseEntity.ok("Doctor not found");
            }
        } catch (Throwable e) {
            StringWriter sw = new StringWriter();
            PrintWriter pw = new PrintWriter(sw);
            e.printStackTrace(pw);
            return ResponseEntity.ok("Error updating doctor: " + sw.toString());
        }
    }
}
