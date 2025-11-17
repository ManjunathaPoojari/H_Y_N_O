package com.hyno.controller;

import com.hyno.entity.YogaTrainer;
import com.hyno.entity.YogaVideo;
import com.hyno.entity.YogaSession;
import com.hyno.service.YogaTrainerService;
import com.hyno.service.YogaVideoService;
import com.hyno.service.YogaSessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/yoga")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class YogaController {

    private static final Logger logger = LoggerFactory.getLogger(YogaController.class);

    @Autowired
    private YogaTrainerService yogaTrainerService;

    @Autowired
    private YogaVideoService yogaVideoService;

    @Autowired
    private YogaSessionService yogaSessionService;

    // Trainer endpoints
    @GetMapping("/trainers")
    public List<YogaTrainer> getAllTrainers() {
        logger.info("Fetching all yoga trainers");
        return yogaTrainerService.getAllTrainers();
    }

    @GetMapping("/trainers/{id}")
    public ResponseEntity<YogaTrainer> getTrainerById(@PathVariable String id) {
        logger.info("Fetching yoga trainer by ID: {}", id);
        Optional<YogaTrainer> trainer = yogaTrainerService.getTrainerById(id);
        return trainer.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/trainers/available")
    public List<YogaTrainer> getAvailableTrainers() {
        logger.info("Fetching available yoga trainers");
        return yogaTrainerService.getAvailableTrainers();
    }

    @GetMapping("/trainers/search")
    public List<YogaTrainer> searchTrainers(@RequestParam String query) {
        logger.info("Searching yoga trainers with query: {}", query);
        return yogaTrainerService.searchTrainers(query);
    }

    @GetMapping("/trainers/specialties")
    public List<YogaTrainer> getTrainersBySpecialties(@RequestParam List<String> specialties) {
        logger.info("Fetching yoga trainers by specialties: {}", specialties);
        return yogaTrainerService.getTrainersBySpecialties(specialties);
    }

    @GetMapping("/trainers/location")
    public List<YogaTrainer> getTrainersByLocation(@RequestParam String location) {
        logger.info("Fetching yoga trainers by location: {}", location);
        return yogaTrainerService.getTrainersByLocation(location);
    }

    @GetMapping("/trainers/price-range")
    public List<YogaTrainer> getTrainersByPriceRange(@RequestParam BigDecimal minPrice, @RequestParam BigDecimal maxPrice) {
        logger.info("Fetching yoga trainers by price range: {} - {}", minPrice, maxPrice);
        return yogaTrainerService.getTrainersByPriceRange(minPrice, maxPrice);
    }

    @GetMapping("/trainers/mode")
    public List<YogaTrainer> getTrainersByMode(@RequestParam String mode) {
        logger.info("Fetching yoga trainers by mode: {}", mode);
        return yogaTrainerService.getTrainersByMode(mode);
    }

    @GetMapping("/trainers/top-rated")
    public List<YogaTrainer> getTopRatedTrainers() {
        logger.info("Fetching top rated yoga trainers");
        return yogaTrainerService.getTopRatedTrainers();
    }

    @PostMapping("/trainers")
    public YogaTrainer createTrainer(@RequestBody YogaTrainer trainer) {
        logger.info("Creating new yoga trainer: {}", trainer.getName());
        return yogaTrainerService.createTrainer(trainer);
    }

    @PutMapping("/trainers/{id}")
    public ResponseEntity<YogaTrainer> updateTrainer(@PathVariable String id, @RequestBody YogaTrainer trainerDetails) {
        logger.info("Updating yoga trainer: {}", id);
        YogaTrainer updatedTrainer = yogaTrainerService.updateTrainer(id, trainerDetails);
        return updatedTrainer != null ? ResponseEntity.ok(updatedTrainer) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/trainers/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable String id) {
        logger.info("Deleting yoga trainer: {}", id);
        yogaTrainerService.deleteTrainer(id);
        return ResponseEntity.ok().build();
    }

    // Video endpoints
    @GetMapping("/videos")
    public List<YogaVideo> getAllVideos() {
        logger.info("Fetching all yoga videos");
        return yogaVideoService.getAllVideos();
    }

    @GetMapping("/videos/{id}")
    public ResponseEntity<YogaVideo> getVideoById(@PathVariable Long id) {
        logger.info("Fetching yoga video by ID: {}", id);
        Optional<YogaVideo> video = yogaVideoService.getVideoById(id);
        return video.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/videos/level/{level}")
    public List<YogaVideo> getVideosByLevel(@PathVariable YogaVideo.DifficultyLevel level) {
        logger.info("Fetching yoga videos by level: {}", level);
        return yogaVideoService.getVideosByLevel(level);
    }

    @GetMapping("/videos/style/{style}")
    public List<YogaVideo> getVideosByStyle(@PathVariable String style) {
        logger.info("Fetching yoga videos by style: {}", style);
        return yogaVideoService.getVideosByStyle(style);
    }

    @GetMapping("/videos/search")
    public List<YogaVideo> searchVideos(@RequestParam String query) {
        logger.info("Searching yoga videos with query: {}", query);
        return yogaVideoService.searchVideos(query);
    }

    @GetMapping("/videos/most-viewed")
    public List<YogaVideo> getMostViewedVideos() {
        logger.info("Fetching most viewed yoga videos");
        return yogaVideoService.getMostViewedVideos();
    }

    @GetMapping("/videos/top-rated")
    public List<YogaVideo> getTopRatedVideos() {
        logger.info("Fetching top rated yoga videos");
        return yogaVideoService.getTopRatedVideos();
    }

    @GetMapping("/videos/duration")
    public List<YogaVideo> getVideosByDurationRange(@RequestParam Integer minDuration, @RequestParam Integer maxDuration) {
        logger.info("Fetching yoga videos by duration range: {} - {}", minDuration, maxDuration);
        return yogaVideoService.getVideosByDurationRange(minDuration, maxDuration);
    }

    @GetMapping("/videos/benefit")
    public List<YogaVideo> getVideosByBenefit(@RequestParam String benefit) {
        logger.info("Fetching yoga videos by benefit: {}", benefit);
        return yogaVideoService.getVideosByBenefit(benefit);
    }

    @PostMapping("/videos")
    public YogaVideo createVideo(@RequestBody YogaVideo video) {
        logger.info("Creating new yoga video: {}", video.getTitle());
        return yogaVideoService.createVideo(video);
    }

    @PutMapping("/videos/{id}")
    public ResponseEntity<YogaVideo> updateVideo(@PathVariable Long id, @RequestBody YogaVideo videoDetails) {
        logger.info("Updating yoga video: {}", id);
        YogaVideo updatedVideo = yogaVideoService.updateVideo(id, videoDetails);
        return updatedVideo != null ? ResponseEntity.ok(updatedVideo) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/videos/{id}")
    public ResponseEntity<Void> deleteVideo(@PathVariable Long id) {
        logger.info("Deleting yoga video: {}", id);
        yogaVideoService.deleteVideo(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/videos/{id}/view")
    public ResponseEntity<Void> incrementViewCount(@PathVariable Long id) {
        logger.info("Incrementing view count for yoga video: {}", id);
        yogaVideoService.incrementViewCount(id);
        return ResponseEntity.ok().build();
    }

    // Session endpoints
    @GetMapping("/sessions")
    public List<YogaSession> getAllSessions() {
        logger.info("Fetching all yoga sessions");
        return yogaSessionService.getAllSessions();
    }

    @GetMapping("/sessions/{id}")
    public ResponseEntity<YogaSession> getSessionById(@PathVariable Long id) {
        logger.info("Fetching yoga session by ID: {}", id);
        Optional<YogaSession> session = yogaSessionService.getSessionById(id);
        return session.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/sessions/patient/{patientId}")
    public List<YogaSession> getSessionsByPatient(@PathVariable String patientId) {
        logger.info("Fetching yoga sessions for patient: {}", patientId);
        return yogaSessionService.getSessionsByPatient(patientId);
    }

    @GetMapping("/sessions/trainer/{trainerId}")
    public List<YogaSession> getSessionsByTrainer(@PathVariable String trainerId) {
        logger.info("Fetching yoga sessions for trainer: {}", trainerId);
        return yogaSessionService.getSessionsByTrainer(trainerId);
    }

    @GetMapping("/sessions/status/{status}")
    public List<YogaSession> getSessionsByStatus(@PathVariable YogaSession.SessionStatus status) {
        logger.info("Fetching yoga sessions by status: {}", status);
        return yogaSessionService.getSessionsByStatus(status);
    }

    @GetMapping("/sessions/upcoming/patient/{patientId}")
    public List<YogaSession> getUpcomingSessionsByPatient(@PathVariable String patientId) {
        logger.info("Fetching upcoming yoga sessions for patient: {}", patientId);
        return yogaSessionService.getUpcomingSessionsByPatient(patientId);
    }

    @GetMapping("/sessions/upcoming/trainer/{trainerId}")
    public List<YogaSession> getUpcomingSessionsByTrainer(@PathVariable String trainerId) {
        logger.info("Fetching upcoming yoga sessions for trainer: {}", trainerId);
        return yogaSessionService.getUpcomingSessionsByTrainer(trainerId);
    }

    @PostMapping("/sessions")
    public YogaSession createSession(@RequestBody Map<String, Object> request) {
        logger.info("Creating new yoga session");
        try {
            YogaSession session = new YogaSession();

            // Set patient
            if (request.get("patientId") != null) {
                com.hyno.entity.Patient patient = new com.hyno.entity.Patient();
                patient.setId((String) request.get("patientId"));
                session.setPatient(patient);
            }

            // Set trainer
            if (request.get("trainerId") != null) {
                com.hyno.entity.YogaTrainer trainer = new com.hyno.entity.YogaTrainer();
                trainer.setId(request.get("trainerId").toString());
                session.setTrainer(trainer);
            }

            session.setSessionDate(LocalDate.parse((String) request.get("sessionDate")));
            session.setSessionTime(java.time.LocalTime.parse((String) request.get("sessionTime")));
            session.setMode(YogaSession.SessionMode.valueOf(((String) request.get("mode")).toUpperCase()));

            if (request.get("price") != null) {
                session.setPrice(BigDecimal.valueOf(Double.parseDouble(request.get("price").toString())));
            }

            if (request.get("notes") != null) {
                session.setNotes((String) request.get("notes"));
            }

            YogaSession createdSession = yogaSessionService.createSession(session);
            logger.info("Yoga session created successfully with ID: {}", createdSession.getId());
            return createdSession;
        } catch (Exception e) {
            logger.error("Error creating yoga session", e);
            throw e;
        }
    }

    @PutMapping("/sessions/{id}")
    public ResponseEntity<YogaSession> updateSession(@PathVariable Long id, @RequestBody Map<String, Object> updateRequest) {
        logger.info("Updating yoga session: {}", id);
        try {
            Optional<YogaSession> optionalSession = yogaSessionService.getSessionById(id);
            if (optionalSession.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            YogaSession session = optionalSession.get();

            if (updateRequest.get("sessionDate") != null) {
                session.setSessionDate(LocalDate.parse((String) updateRequest.get("sessionDate")));
            }
            if (updateRequest.get("sessionTime") != null) {
                session.setSessionTime(java.time.LocalTime.parse((String) updateRequest.get("sessionTime")));
            }
            if (updateRequest.get("mode") != null) {
                session.setMode(YogaSession.SessionMode.valueOf(((String) updateRequest.get("mode")).toUpperCase()));
            }
            if (updateRequest.get("price") != null) {
                session.setPrice(BigDecimal.valueOf(Double.parseDouble(updateRequest.get("price").toString())));
            }
            if (updateRequest.get("notes") != null) {
                session.setNotes((String) updateRequest.get("notes"));
            }
            if (updateRequest.get("feedback") != null) {
                session.setFeedback((String) updateRequest.get("feedback"));
            }

            YogaSession updatedSession = yogaSessionService.updateSession(id, session);
            return ResponseEntity.ok(updatedSession);
        } catch (Exception e) {
            logger.error("Error updating yoga session: {}", id, e);
            throw e;
        }
    }

    @PutMapping("/sessions/{id}/cancel")
    public ResponseEntity<YogaSession> cancelSession(@PathVariable Long id) {
        logger.info("Cancelling yoga session: {}", id);
        YogaSession cancelledSession = yogaSessionService.cancelSession(id);
        return cancelledSession != null ? ResponseEntity.ok(cancelledSession) : ResponseEntity.notFound().build();
    }

    @PutMapping("/sessions/{id}/complete")
    public ResponseEntity<YogaSession> completeSession(@PathVariable Long id) {
        logger.info("Completing yoga session: {}", id);
        YogaSession completedSession = yogaSessionService.completeSession(id);
        return completedSession != null ? ResponseEntity.ok(completedSession) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/sessions/{id}")
    public ResponseEntity<Void> deleteSession(@PathVariable Long id) {
        logger.info("Deleting yoga session: {}", id);
        yogaSessionService.deleteSession(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sessions/date-range")
    public List<YogaSession> getSessionsByDateRange(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        logger.info("Fetching yoga sessions by date range: {} to {}", startDate, endDate);
        return yogaSessionService.getSessionsByDateRange(startDate, endDate);
    }
}
