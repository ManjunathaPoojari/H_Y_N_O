package com.hyno.service;

import com.hyno.entity.Patient;
import com.hyno.repository.PatientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import jakarta.persistence.criteria.Predicate;

@Service
public class PatientService {

    private static final Logger logger = LoggerFactory.getLogger(PatientService.class);

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        logger.info("Fetching all patients");
        try {
            List<Patient> patients = patientRepository.findAll();
            logger.info("Retrieved {} patients", patients.size());
            return patients;
        } catch (Exception e) {
            logger.error("Error fetching all patients", e);
            throw e;
        }
    }

    public Optional<Patient> getPatientById(String id) {
        logger.info("Fetching patient by ID: {}", id);
        try {
            Optional<Patient> patient = patientRepository.findById(id);
            if (patient.isPresent()) {
                logger.info("Patient found: {}", id);
            } else {
                logger.warn("Patient not found: {}", id);
            }
            return patient;
        } catch (Exception e) {
            logger.error("Error fetching patient by ID: {}", id, e);
            throw e;
        }
    }

    public Optional<Patient> findByEmail(String email) {
        logger.info("Finding patient by email: {}", email);
        try {
            Optional<Patient> patient = patientRepository.findByEmail(email);
            if (patient.isPresent()) {
                logger.info("Patient found by email: {}", email);
            } else {
                logger.warn("Patient not found by email: {}", email);
            }
            return patient;
        } catch (Exception e) {
            logger.error("Error finding patient by email: {}", email, e);
            throw e;
        }
    }

    public Patient getPatientByEmail(String email) {
        logger.info("Getting patient by email: {}", email);
        try {
            Optional<Patient> patient = patientRepository.findByEmail(email);
            if (patient.isPresent()) {
                logger.info("Patient retrieved by email: {}", email);
                return patient.get();
            } else {
                logger.warn("Patient not found by email: {}", email);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error getting patient by email: {}", email, e);
            throw e;
        }
    }

    public Patient createPatient(Patient patient) {
        logger.info("Creating new patient: {}", patient.getEmail());
        try {
            Patient savedPatient = patientRepository.save(patient);
            logger.info("Patient created successfully with ID: {}", savedPatient.getId());
            return savedPatient;
        } catch (Exception e) {
            logger.error("Error creating patient: {}", patient.getEmail(), e);
            throw e;
        }
    }

    public Patient save(Patient patient) {
        logger.info("Saving patient: {}", patient.getId() != null ? patient.getId() : patient.getEmail());
        try {
            Patient savedPatient = patientRepository.save(patient);
            logger.info("Patient saved successfully with ID: {}", savedPatient.getId());
            return savedPatient;
        } catch (Exception e) {
            logger.error("Error saving patient: {}", patient.getId(), e);
            throw e;
        }
    }

    public Patient updatePatient(String id, Patient patientDetails) {
        logger.info("Updating patient: {}", id);
        try {
            Optional<Patient> optionalPatient = patientRepository.findById(id);
            if (optionalPatient.isPresent()) {
                Patient patient = optionalPatient.get();
                patient.setName(patientDetails.getName());
                patient.setEmail(patientDetails.getEmail());
                patient.setPhone(patientDetails.getPhone());
                patient.setAge(patientDetails.getAge());
                patient.setGender(patientDetails.getGender());
                patient.setBloodGroup(patientDetails.getBloodGroup());
                patient.setAllergies(patientDetails.getAllergies());
                patient.setMedicalHistory(patientDetails.getMedicalHistory());
                patient.setAddress(patientDetails.getAddress());
                patient.setEmergencyContact(patientDetails.getEmergencyContact());
                Patient updatedPatient = patientRepository.save(patient);
                logger.info("Patient updated successfully: {}", id);
                return updatedPatient;
            } else {
                logger.warn("Patient not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating patient: {}", id, e);
            throw e;
        }
    }

    public void deletePatient(String id) {
        logger.info("Deleting patient: {}", id);
        try {
            patientRepository.deleteById(id);
            logger.info("Patient deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting patient: {}", id, e);
            throw e;
        }
    }

    public Page<Patient> getAllPatients(Pageable pageable, String search) {
        logger.info("Fetching patients with pagination and search");
        try {
            Specification<Patient> spec = (root, query, criteriaBuilder) -> {
                if (search != null && !search.trim().isEmpty()) {
                    String searchTerm = "%" + search.toLowerCase() + "%";
                    Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchTerm);
                    Predicate emailPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchTerm);
                    Predicate phonePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchTerm);
                    return criteriaBuilder.or(namePredicate, emailPredicate, phonePredicate);
                }
                return criteriaBuilder.conjunction();
            };

            Page<Patient> patients = patientRepository.findAll(spec, pageable);
            logger.info("Retrieved {} patients out of {} total", patients.getNumberOfElements(), patients.getTotalElements());
            return patients;
        } catch (Exception e) {
            logger.error("Error fetching patients with pagination", e);
            throw e;
        }
    }

    public List<Patient> searchPatients(String query) {
        logger.info("Searching patients with query: {}", query);
        try {
            Specification<Patient> spec = (root, criteriaQuery, criteriaBuilder) -> {
                if (query != null && !query.trim().isEmpty()) {
                    String searchTerm = "%" + query.toLowerCase() + "%";
                    Predicate namePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), searchTerm);
                    Predicate emailPredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchTerm);
                    Predicate phonePredicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("phone")), searchTerm);
                    return criteriaBuilder.or(namePredicate, emailPredicate, phonePredicate);
                }
                return criteriaBuilder.conjunction();
            };

            List<Patient> patients = patientRepository.findAll(spec);
            logger.info("Found {} patients matching query: {}", patients.size(), query);
            return patients;
        } catch (Exception e) {
            logger.error("Error searching patients with query: {}", query, e);
            throw e;
        }
    }
}
