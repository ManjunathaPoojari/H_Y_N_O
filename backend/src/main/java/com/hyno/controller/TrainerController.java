package com.hyno.controller;

import com.hyno.entity.Trainer;
import com.hyno.service.TrainerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/trainers")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class TrainerController {

    private static final Logger logger = LoggerFactory.getLogger(TrainerController.class);

    @Autowired
    private TrainerService trainerService;

    // Trainer endpoints
    @GetMapping
    public List<Trainer> getAllTrainers() {
        logger.info("Fetching all trainers");
        return trainerService.getAllTrainers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Trainer> getTrainerById(@PathVariable String id) {
        logger.info("Fetching trainer by ID: {}", id);
        Optional<Trainer> trainer = trainerService.getTrainerById(id);
        return trainer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/available")
    public List<Trainer> getAvailableTrainers() {
        logger.info("Fetching available trainers");
        return trainerService.getAvailableTrainers();
    }

    @GetMapping("/type/{trainerType}")
    public List<Trainer> getTrainersByType(@PathVariable Trainer.TrainerType trainerType) {
        logger.info("Fetching trainers by type: {}", trainerType);
        return trainerService.getTrainersByType(trainerType);
    }

    @GetMapping("/search")
    public List<Trainer> searchTrainers(@RequestParam String query) {
        logger.info("Searching trainers with query: {}", query);
        return trainerService.searchTrainers(query);
    }

    @GetMapping("/specialties")
    public List<Trainer> getTrainersBySpecialties(@RequestParam List<String> specialties) {
        logger.info("Fetching trainers by specialties: {}", specialties);
        return trainerService.getTrainersBySpecialties(specialties);
    }

    @GetMapping("/location")
    public List<Trainer> getTrainersByLocation(@RequestParam String location) {
        logger.info("Fetching trainers by location: {}", location);
        return trainerService.getTrainersByLocation(location);
    }

    @GetMapping("/price-range")
    public List<Trainer> getTrainersByPriceRange(@RequestParam BigDecimal minPrice, @RequestParam BigDecimal maxPrice) {
        logger.info("Fetching trainers by price range: {} - {}", minPrice, maxPrice);
        return trainerService.getTrainersByPriceRange(minPrice, maxPrice);
    }

    @GetMapping("/mode")
    public List<Trainer> getTrainersByMode(@RequestParam String mode) {
        logger.info("Fetching trainers by mode: {}", mode);
        return trainerService.getTrainersByMode(mode);
    }

    @GetMapping("/top-rated")
    public List<Trainer> getTopRatedTrainers() {
        logger.info("Fetching top rated trainers");
        return trainerService.getTopRatedTrainers();
    }

    @PostMapping
    public ResponseEntity<?> createTrainer(@RequestBody Trainer trainer) {
        try {
            logger.info("Creating new trainer: {}", trainer.getName());
            
            // Validate required fields
            if (trainer.getName() == null || trainer.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Name is required"));
            }
            if (trainer.getEmail() == null || trainer.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
            }
            
            // Normalize email
            trainer.setEmail(trainer.getEmail().trim().toLowerCase());
            
            // Check if email already exists
            if (trainerService.getTrainerByEmail(trainer.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
            }
            
            // Set default password if not provided
            if (trainer.getPassword() == null || trainer.getPassword().trim().isEmpty()) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                trainer.setPassword(passwordEncoder.encode("Trainer@123"));
            } else {
                // Hash the provided password
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                trainer.setPassword(passwordEncoder.encode(trainer.getPassword()));
            }
            
            // Set defaults for required fields and handle trainerType conversion
            if (trainer.getTrainerType() == null) {
                trainer.setTrainerType(Trainer.TrainerType.FITNESS);
            } else {
                // Ensure trainerType is uppercase enum value
                try {
                    String trainerTypeStr = trainer.getTrainerType().toString().toUpperCase();
                    trainer.setTrainerType(Trainer.TrainerType.valueOf(trainerTypeStr));
                } catch (IllegalArgumentException e) {
                    // If invalid, default to FITNESS
                    trainer.setTrainerType(Trainer.TrainerType.FITNESS);
                }
            }
            if (trainer.getExperienceYears() == null) {
                trainer.setExperienceYears(0);
            }
            if (trainer.getLocation() == null || trainer.getLocation().trim().isEmpty()) {
                trainer.setLocation("");
            }
            if (trainer.getPricePerSession() == null) {
                trainer.setPricePerSession(BigDecimal.ZERO);
            }
            if (trainer.getImage() == null || trainer.getImage().trim().isEmpty()) {
                trainer.setImage("");
            }
            if (trainer.getStatus() == null || trainer.getStatus().trim().isEmpty()) {
                trainer.setStatus("pending");
            }
            if (trainer.getRating() == null) {
                trainer.setRating(0.0);
            }
            if (trainer.getAvailability() == null) {
                trainer.setAvailability(Trainer.AvailabilityStatus.AVAILABLE);
            }
            if (trainer.getSpecialties() == null) {
                trainer.setSpecialties(new ArrayList<>());
            }
            if (trainer.getLanguages() == null) {
                trainer.setLanguages(new ArrayList<>());
            }
            if (trainer.getModes() == null || trainer.getModes().isEmpty()) {
                trainer.setModes(List.of("virtual"));
            }
            if (trainer.getQualifications() == null) {
                trainer.setQualifications(new ArrayList<>());
            }
            
            trainer.setVerified(false);
            
            Trainer createdTrainer = trainerService.createTrainer(trainer);
            return ResponseEntity.ok(createdTrainer);
        } catch (Exception e) {
            logger.error("Error creating trainer: {}", e.getMessage(), e);
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("message", "Failed to create trainer: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Trainer> updateTrainer(@PathVariable String id, @RequestBody Trainer trainerDetails) {
        logger.info("Updating trainer: {}", id);
        Trainer updatedTrainer = trainerService.updateTrainer(id, trainerDetails);
        return updatedTrainer != null ? ResponseEntity.ok(updatedTrainer) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable String id) {
        logger.info("Deleting trainer: {}", id);
        trainerService.deleteTrainer(id);
        return ResponseEntity.ok().build();
    }
}
