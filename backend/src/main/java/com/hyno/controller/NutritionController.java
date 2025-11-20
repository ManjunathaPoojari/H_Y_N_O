package com.hyno.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class NutritionController {

    @GetMapping("/plans")
    public ResponseEntity<List<Object>> getAllNutritionPlans() {
        // Return empty list for now - can be implemented later
        return ResponseEntity.ok(new ArrayList<>());
    }

    @GetMapping("/plans/{id}")
    public ResponseEntity<Object> getNutritionPlanById(@PathVariable String id) {
        // Return not found for now
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/plans")
    public ResponseEntity<Object> createNutritionPlan(@RequestBody Object plan) {
        // Return not implemented for now
        return ResponseEntity.status(501).build();
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<Object> updateNutritionPlan(@PathVariable String id, @RequestBody Object plan) {
        // Return not implemented for now
        return ResponseEntity.status(501).build();
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<Void> deleteNutritionPlan(@PathVariable String id) {
        // Return not implemented for now
        return ResponseEntity.status(501).build();
    }
}
