package com.hyno.service;

import com.hyno.entity.YogaSession;
import com.hyno.repository.YogaSessionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class YogaSessionService {

    private static final Logger logger = LoggerFactory.getLogger(YogaSessionService.class);

    @Autowired
    private YogaSessionRepository yogaSessionRepository;

    @Autowired
    private com.hyno.repository.PatientRepository patientRepository;

    @Autowired
    private com.hyno.repository.YogaTrainerRepository yogaTrainerRepository;

    public List<YogaSession> getAllSessions() {
        logger.info("Fetching all yoga sessions");
        try {
            List<YogaSession> sessions = yogaSessionRepository.findAll();
            logger.info("Retrieved {} yoga sessions", sessions.size());
            return sessions;
        } catch (Exception e) {
            logger.error("Error fetching all yoga sessions", e);
            throw e;
        }
    }

    public Optional<YogaSession> getSessionById(Long id) {
        logger.info("Fetching yoga session by ID: {}", id);
        try {
            Optional<YogaSession> session = yogaSessionRepository.findById(id);
            if (session.isPresent()) {
                logger.info("Yoga session found: {}", id);
            } else {
                logger.warn("Yoga session not found: {}", id);
            }
            return session;
        } catch (Exception e) {
            logger.error("Error fetching yoga session by ID: {}", id, e);
            throw e;
        }
    }

    public List<YogaSession> getSessionsByPatient(String patientId) {
        logger.info("Fetching yoga sessions for patient: {}", patientId);
        try {
            List<YogaSession> sessions = yogaSessionRepository.findByPatient_Id(patientId);
            logger.info("Retrieved {} yoga sessions for patient: {}", sessions.size(), patientId);
            return sessions;
        } catch (Exception e) {
            logger.error("Error fetching yoga sessions for patient: {}", patientId, e);
            throw e;
        }
    }

    public List<YogaSession> getSessionsByTrainer(Long trainerId) {
        logger.info("Fetching yoga sessions for trainer: {}", trainerId);
        try {
            List<YogaSession> sessions = yogaSessionRepository.findByTrainer_Id(trainerId);
            logger.info("Retrieved {} yoga sessions for trainer: {}", sessions.size(), trainerId);
            return sessions;
        } catch (Exception e) {
            logger.error("Error fetching yoga sessions for trainer: {}", trainerId, e);
            throw e;
        }
    }

    public List<YogaSession> getSessionsByStatus(YogaSession.SessionStatus status) {
        logger.info("Fetching yoga sessions by status: {}", status);
        try {
            List<YogaSession> sessions = yogaSessionRepository.findByStatus(status);
            logger.info("Retrieved {} yoga sessions with status: {}", sessions.size(), status);
            return sessions;
        } catch (Exception e) {
            logger.error("Error fetching yoga sessions by status: {}", status, e);
            throw e;
        }
    }

    public List<YogaSession> getUpcomingSessionsByPatient(String patientId) {
        logger.info("Fetching upcoming yoga sessions for patient: {}", patientId);
        try {
            List<YogaSession> sessions = yogaSessionRepository.findUpcomingByPatientId(patientId, LocalDate.now());
            logger.info("Retrieved {} upcoming yoga sessions for patient: {}", sessions.size(), patientId);
            return sessions;
        } catch (Exception e) {
            logger.error("Error fetching upcoming yoga sessions for patient: {}", patientId, e);
            throw e;
        }
    }

    public List<YogaSession> getUpcomingSessionsByTrainer(Long trainerId) {
        logger.info("Fetching upcoming yoga sessions for trainer: {}", trainerId);
        try {
            List<YogaSession> sessions = yogaSessionRepository.findUpcomingByTrainerId(trainerId, LocalDate.now());
            logger.info("Retrieved {} upcoming yoga sessions for trainer: {}", sessions.size(), trainerId);
            return sessions;
        } catch (Exception e) {
            logger.error("Error fetching upcoming yoga sessions for trainer: {}", trainerId, e);
            throw e;
        }
    }

    @Transactional
    public YogaSession createSession(YogaSession session) {
        logger.info("Creating new yoga session for patient: {}", session.getPatient().getId());
        try {
            // Validate patient
            if (session.getPatient() == null || session.getPatient().getId() == null) {
                throw new IllegalArgumentException("Patient ID is required");
            }
            Optional<com.hyno.entity.Patient> patient = patientRepository.findById(session.getPatient().getId());
            if (patient.isEmpty()) {
                throw new IllegalArgumentException("Patient not found with ID: " + session.getPatient().getId());
            }
            session.setPatient(patient.get());

            // Validate trainer
            if (session.getTrainer() == null || session.getTrainer().getId() == null) {
                throw new IllegalArgumentException("Trainer ID is required");
            }
            Optional<com.hyno.entity.YogaTrainer> trainer = yogaTrainerRepository.findById(session.getTrainer().getId());
            if (trainer.isEmpty()) {
                throw new IllegalArgumentException("Trainer not found with ID: " + session.getTrainer().getId());
            }
            session.setTrainer(trainer.get());

            // Set price based on trainer if not provided
            if (session.getPrice() == null) {
                session.setPrice(trainer.get().getPricePerSession());
            }

            YogaSession savedSession = yogaSessionRepository.save(session);
            logger.info("Yoga session created successfully with ID: {}", savedSession.getId());
            return savedSession;
        } catch (Exception e) {
            logger.error("Error creating yoga session for patient: {}", session.getPatient().getId(), e);
            throw e;
        }
    }

    public YogaSession updateSession(Long id, YogaSession sessionDetails) {
        logger.info("Updating yoga session: {}", id);
        try {
            Optional<YogaSession> optionalSession = yogaSessionRepository.findById(id);
            if (optionalSession.isPresent()) {
                YogaSession session = optionalSession.get();
                session.setSessionDate(sessionDetails.getSessionDate());
                session.setSessionTime(sessionDetails.getSessionTime());
                session.setMode(sessionDetails.getMode());
                session.setStatus(sessionDetails.getStatus());
                session.setPrice(sessionDetails.getPrice());
                session.setNotes(sessionDetails.getNotes());
                session.setFeedback(sessionDetails.getFeedback());
                YogaSession updatedSession = yogaSessionRepository.save(session);
                logger.info("Yoga session updated successfully: {}", id);
                return updatedSession;
            } else {
                logger.warn("Yoga session not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating yoga session: {}", id, e);
            throw e;
        }
    }

    public void deleteSession(Long id) {
        logger.info("Deleting yoga session: {}", id);
        try {
            yogaSessionRepository.deleteById(id);
            logger.info("Yoga session deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting yoga session: {}", id, e);
            throw e;
        }
    }

    public YogaSession cancelSession(Long id) {
        logger.info("Cancelling yoga session: {}", id);
        try {
            Optional<YogaSession> optionalSession = yogaSessionRepository.findById(id);
            if (optionalSession.isPresent()) {
                YogaSession session = optionalSession.get();
                session.setStatus(YogaSession.SessionStatus.CANCELLED);
                YogaSession cancelledSession = yogaSessionRepository.save(session);
                logger.info("Yoga session cancelled successfully: {}", id);
                return cancelledSession;
            } else {
                logger.warn("Yoga session not found for cancellation: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error cancelling yoga session: {}", id, e);
            throw e;
        }
    }

    public YogaSession completeSession(Long id) {
        logger.info("Completing yoga session: {}", id);
        try {
            Optional<YogaSession> optionalSession = yogaSessionRepository.findById(id);
            if (optionalSession.isPresent()) {
                YogaSession session = optionalSession.get();
                session.setStatus(YogaSession.SessionStatus.COMPLETED);
                YogaSession completedSession = yogaSessionRepository.save(session);
                logger.info("Yoga session completed successfully: {}", id);
                return completedSession;
            } else {
                logger.warn("Yoga session not found for completion: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error completing yoga session: {}", id, e);
            throw e;
        }
    }

    public List<YogaSession> getSessionsByDateRange(LocalDate startDate, LocalDate endDate) {
        logger.info("Fetching yoga sessions by date range: {} to {}", startDate, endDate);
        try {
            List<YogaSession> sessions = yogaSessionRepository.findByDateRange(startDate, endDate);
            logger.info("Retrieved {} yoga sessions in date range: {} to {}", sessions.size(), startDate, endDate);
            return sessions;
        } catch (Exception e) {
            logger.error("Error fetching yoga sessions by date range: {} to {}", startDate, endDate, e);
            throw e;
        }
    }
}
