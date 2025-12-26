package com.hyno.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/yoga")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class YogaCategoryController {

    @GetMapping("/categories")
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        List<Map<String, Object>> categories = Arrays.asList(
            Map.of("id", "1", "name", "Beginner", "description", "Perfect for beginners starting their yoga journey", "difficulty", "beginner"),
            Map.of("id", "2", "name", "Intermediate", "description", "For those with some yoga experience", "difficulty", "intermediate"),
            Map.of("id", "3", "name", "Advanced", "description", "Challenging poses for experienced practitioners", "difficulty", "advanced"),
            Map.of("id", "4", "name", "Relaxation", "description", "Gentle poses for stress relief and relaxation", "difficulty", "beginner"),
            Map.of("id", "5", "name", "Strength", "description", "Build strength and muscle tone", "difficulty", "intermediate"),
            Map.of("id", "6", "name", "Flexibility", "description", "Improve flexibility and range of motion", "difficulty", "intermediate")
        );
        return ResponseEntity.ok(categories);
    }
}
