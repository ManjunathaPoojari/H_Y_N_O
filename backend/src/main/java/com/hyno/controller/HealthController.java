package com.hyno.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "HYNO Health Management System Backend is running");
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
}

// Add a security configuration to allow unauthenticated access to /health endpoint
