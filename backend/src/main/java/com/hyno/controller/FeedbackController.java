package com.hyno.controller;

import com.hyno.entity.Feedback;
import com.hyno.service.FeedbackService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class FeedbackController {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackController.class);

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping
    public List<Feedback> getAllFeedback() {
        logger.info("Fetching all feedback");
        return feedbackService.getAllFeedback();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable String id) {
        logger.info("Fetching feedback by ID: {}", id);
        Optional<Feedback> feedback = feedbackService.getFeedbackById(id);
        return feedback.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Feedback> getFeedbackByPatient(@PathVariable String patientId) {
        logger.info("Fetching feedback for patient: {}", patientId);
        return feedbackService.getFeedbackByPatient(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Feedback> getFeedbackByDoctor(@PathVariable String doctorId) {
        logger.info("Fetching feedback for doctor: {}", doctorId);
        return feedbackService.getFeedbackByDoctor(doctorId);
    }

    @GetMapping("/appointment/{appointmentId}")
    public List<Feedback> getFeedbackByAppointment(@PathVariable String appointmentId) {
        logger.info("Fetching feedback for appointment: {}", appointmentId);
        return feedbackService.getFeedbackByAppointment(appointmentId);
    }

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody Map<String, Object> request) {
        logger.info("Creating new feedback");

        try {
            String appointmentId = (String) request.get("appointmentId");
            String patientId = (String) request.get("patientId");
            Integer rating = ((Number) request.get("rating")).intValue();
            String comments = (String) request.get("comments");
            String suggestions = (String) request.get("suggestions");
            String typeStr = (String) request.get("type");

            Feedback.FeedbackType type = Feedback.FeedbackType.valueOf(typeStr.toUpperCase());

            Feedback feedback = feedbackService.createFeedback(appointmentId, patientId, rating, comments, suggestions, type);
            logger.info("Feedback created successfully with ID: {}", feedback.getId());

            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating feedback: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating feedback", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(@PathVariable String id, @RequestBody Map<String, Object> request) {
        logger.info("Updating feedback: {}", id);

        try {
            Integer rating = request.get("rating") != null ? ((Number) request.get("rating")).intValue() : null;
            String comments = (String) request.get("comments");
            String suggestions = (String) request.get("suggestions");

            Feedback feedback = feedbackService.updateFeedback(id, rating, comments, suggestions);
            logger.info("Feedback updated successfully: {}", id);

            return ResponseEntity.ok(feedback);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error updating feedback: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error updating feedback: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/doctor/{doctorId}/rating")
    public ResponseEntity<Map<String, Object>> getDoctorRating(@PathVariable String doctorId) {
        logger.info("Fetching rating stats for doctor: {}", doctorId);

        try {
            Double averageRating = feedbackService.getAverageRatingByDoctor(doctorId);
            long feedbackCount = feedbackService.getFeedbackCountByDoctor(doctorId);

            Map<String, Object> ratingStats = Map.of(
                "averageRating", averageRating != null ? averageRating : 0.0,
                "feedbackCount", feedbackCount
            );

            return ResponseEntity.ok(ratingStats);
        } catch (Exception e) {
            logger.error("Error fetching rating stats for doctor: {}", doctorId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/recent/{type}")
    public List<Feedback> getRecentFeedbackByType(@PathVariable Feedback.FeedbackType type, @RequestParam(defaultValue = "10") int limit) {
        logger.info("Fetching recent feedback of type: {} with limit: {}", type, limit);
        return feedbackService.getRecentFeedbackByType(type, limit);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFeedback(@PathVariable String id) {
        logger.info("Deleting feedback: {}", id);

        try {
            feedbackService.deleteFeedback(id);
            logger.info("Feedback deleted successfully: {}", id);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            logger.error("Validation error deleting feedback: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error deleting feedback: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
