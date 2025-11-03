package com.hyno.service;

import com.hyno.entity.Appointment;
import com.hyno.entity.Feedback;
import com.hyno.repository.AppointmentRepository;
import com.hyno.repository.FeedbackRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(FeedbackService.class);

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Feedback> getAllFeedback() {
        logger.info("Fetching all feedback");
        return feedbackRepository.findAll();
    }

    public Optional<Feedback> getFeedbackById(String id) {
        logger.info("Fetching feedback by ID: {}", id);
        return feedbackRepository.findById(id);
    }

    public List<Feedback> getFeedbackByPatient(String patientId) {
        logger.info("Fetching feedback for patient: {}", patientId);
        return feedbackRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
    }

    public List<Feedback> getFeedbackByDoctor(String doctorId) {
        logger.info("Fetching feedback for doctor: {}", doctorId);
        return feedbackRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId);
    }

    public List<Feedback> getFeedbackByAppointment(String appointmentId) {
        logger.info("Fetching feedback for appointment: {}", appointmentId);
        return feedbackRepository.findByAppointmentId(appointmentId);
    }

    @Transactional
    public Feedback createFeedback(String appointmentId, String patientId, Integer rating, String comments, String suggestions, Feedback.FeedbackType type) {
        logger.info("Creating feedback for appointment: {}, patient: {}", appointmentId, patientId);

        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            throw new IllegalArgumentException("Appointment not found");
        }

        Appointment appointment = appointmentOpt.get();

        // Check if patient matches appointment
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new IllegalArgumentException("Patient does not match appointment");
        }

        // Check if appointment is completed
        if (appointment.getStatus() != Appointment.AppointmentStatus.COMPLETED) {
            throw new IllegalArgumentException("Feedback can only be given for completed appointments");
        }

        // Check if feedback already exists for this appointment and patient
        List<Feedback> existingFeedback = feedbackRepository.findByAppointmentIdAndPatientId(appointmentId, patientId);
        if (!existingFeedback.isEmpty()) {
            throw new IllegalArgumentException("Feedback already exists for this appointment");
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        Feedback feedback = new Feedback(
            appointment,
            appointment.getPatient(),
            appointment.getDoctor(),
            rating,
            comments,
            type
        );

        if (suggestions != null && !suggestions.trim().isEmpty()) {
            feedback.setSuggestions(suggestions);
        }

        Feedback savedFeedback = feedbackRepository.save(feedback);
        logger.info("Feedback created with ID: {}", savedFeedback.getId());

        return savedFeedback;
    }

    @Transactional
    public Feedback updateFeedback(String feedbackId, Integer rating, String comments, String suggestions) {
        logger.info("Updating feedback: {}", feedbackId);

        Optional<Feedback> feedbackOpt = feedbackRepository.findById(feedbackId);
        if (feedbackOpt.isEmpty()) {
            throw new IllegalArgumentException("Feedback not found");
        }

        Feedback feedback = feedbackOpt.get();

        // Validate rating
        if (rating != null && (rating < 1 || rating > 5)) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        if (rating != null) {
            feedback.setRating(rating);
        }
        if (comments != null) {
            feedback.setComments(comments);
        }
        if (suggestions != null) {
            feedback.setSuggestions(suggestions);
        }

        feedback.setUpdatedAt(java.time.LocalDateTime.now());

        Feedback updatedFeedback = feedbackRepository.save(feedback);
        logger.info("Feedback updated: {}", feedbackId);

        return updatedFeedback;
    }

    public Double getAverageRatingByDoctor(String doctorId) {
        return feedbackRepository.getAverageRatingByDoctor(doctorId);
    }

    public long getFeedbackCountByDoctor(String doctorId) {
        return feedbackRepository.countFeedbackByDoctor(doctorId);
    }

    public List<Feedback> getRecentFeedbackByType(Feedback.FeedbackType type, int limit) {
        List<Feedback> feedback = feedbackRepository.findByTypeOrderByCreatedAtDesc(type);
        return feedback.size() > limit ? feedback.subList(0, limit) : feedback;
    }

    @Transactional
    public void deleteFeedback(String feedbackId) {
        logger.info("Deleting feedback: {}", feedbackId);

        if (!feedbackRepository.existsById(feedbackId)) {
            throw new IllegalArgumentException("Feedback not found");
        }

        feedbackRepository.deleteById(feedbackId);
        logger.info("Feedback deleted: {}", feedbackId);
    }
}
