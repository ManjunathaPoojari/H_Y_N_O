package com.hyno.controller;

import com.hyno.entity.Trainer;
import com.hyno.service.TrainerService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
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
    public Trainer createTrainer(@RequestBody Trainer trainer) {
        logger.info("Creating new trainer: {}", trainer.getName());
        return trainerService.createTrainer(trainer);
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
