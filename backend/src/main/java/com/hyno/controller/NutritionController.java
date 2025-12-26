package com.hyno.controller;

import com.hyno.entity.NutritionPlan;
import com.hyno.service.NutritionPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class NutritionController {

    private final NutritionPlanService nutritionPlanService;

    @GetMapping("/plans")
    public ResponseEntity<java.util.List<NutritionPlan>> getAllNutritionPlans() {
        return ResponseEntity.ok(nutritionPlanService.getAllPlans());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<NutritionPlan> getPlanByPatientId(@PathVariable String patientId) {
        return nutritionPlanService.getPlanByPatientId(patientId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/plans")
    public ResponseEntity<NutritionPlan> createNutritionPlan(@RequestBody NutritionPlan plan) {
        return ResponseEntity.ok(nutritionPlanService.savePlan(plan));
    }

    @PutMapping("/plans/{id}")
    public ResponseEntity<NutritionPlan> updateNutritionPlan(@PathVariable String id, @RequestBody NutritionPlan plan) {
        plan.setId(id);
        return ResponseEntity.ok(nutritionPlanService.savePlan(plan));
    }

    @DeleteMapping("/plans/{id}")
    public ResponseEntity<Void> deleteNutritionPlan(@PathVariable String id) {
        nutritionPlanService.deletePlan(id);
        return ResponseEntity.ok().build();
    }
}
