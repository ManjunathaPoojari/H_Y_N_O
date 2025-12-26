package com.hyno.controller;

import com.hyno.entity.Symptom;
import com.hyno.service.SymptomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/symptoms")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SymptomController {
    private final SymptomService symptomService;

    @GetMapping
    public ResponseEntity<List<Symptom>> getAllSymptoms() {
        return ResponseEntity.ok(symptomService.getAllSymptoms());
    }
}
