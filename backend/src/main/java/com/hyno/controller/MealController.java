package com.hyno.controller;

import com.hyno.entity.Meal;
import com.hyno.service.MealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class MealController {

    private final MealService mealService;

    @GetMapping("/meals")
    public ResponseEntity<List<Meal>> getAllMeals() {
        return ResponseEntity.ok(mealService.getAllMeals());
    }

    @GetMapping("/recipes")
    public ResponseEntity<List<Meal>> getRecipesByDisease(@RequestParam String disease) {
        // Assuming disease mapping corresponds to categories or tags in a real scenario
        // For now, filtering by category to align with frontend intent
        return ResponseEntity.ok(mealService.getMealsByCategory(disease));
    }
}
