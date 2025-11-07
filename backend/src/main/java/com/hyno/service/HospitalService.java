package com.hyno.service;

import com.hyno.entity.Hospital;
import com.hyno.entity.Patient;
import com.hyno.repository.HospitalRepository;
import com.hyno.repository.PatientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class HospitalService {

    private static final Logger logger = LoggerFactory.getLogger(HospitalService.class);

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<Hospital> getAllHospitals() {
        logger.info("Fetching all hospitals");
        try {
            List<Hospital> hospitals = hospitalRepository.findAll();
            logger.info("Retrieved {} hospitals", hospitals.size());
            return hospitals;
        } catch (Exception e) {
            logger.error("Error fetching all hospitals", e);
            throw e;
        }
    }

    public Optional<Hospital> getHospitalById(String id) {
        logger.info("Fetching hospital by ID: {}", id);
        try {
            Optional<Hospital> hospital = hospitalRepository.findById(id);
            if (hospital.isPresent()) {
                logger.info("Hospital found: {}", id);
            } else {
                logger.warn("Hospital not found: {}", id);
            }
            return hospital;
        } catch (Exception e) {
            logger.error("Error fetching hospital by ID: {}", id, e);
            throw e;
        }
    }

    public Hospital getHospitalByEmail(String email) {
        logger.info("Getting hospital by email: {}", email);
        try {
            Hospital hospital = hospitalRepository.findByEmail(email);
            if (hospital != null) {
                logger.info("Hospital retrieved by email: {}", email);
            } else {
                logger.warn("Hospital not found by email: {}", email);
            }
            return hospital;
        } catch (Exception e) {
            logger.error("Error getting hospital by email: {}", email, e);
            throw e;
        }
    }

    public Hospital getHospitalByRegistrationNumber(String registrationNumber) {
        logger.info("Getting hospital by registration number: {}", registrationNumber);
        try {
            Hospital hospital = hospitalRepository.findByRegistrationNumber(registrationNumber);
            if (hospital != null) {
                logger.info("Hospital retrieved by registration number: {}", registrationNumber);
            } else {
                logger.warn("Hospital not found by registration number: {}", registrationNumber);
            }
            return hospital;
        } catch (Exception e) {
            logger.error("Error getting hospital by registration number: {}", registrationNumber, e);
            throw e;
        }
    }

    public List<Hospital> getHospitalsByStatus(String status) {
        logger.info("Fetching hospitals by status: {}", status);
        try {
            List<Hospital> hospitals = hospitalRepository.findByStatus(status);
            logger.info("Retrieved {} hospitals with status: {}", hospitals.size(), status);
            return hospitals;
        } catch (Exception e) {
            logger.error("Error fetching hospitals by status: {}", status, e);
            throw e;
        }
    }

    public List<Hospital> getHospitalsByCity(String city) {
        logger.info("Fetching hospitals by city: {}", city);
        try {
            List<Hospital> hospitals = hospitalRepository.findByCity(city);
            logger.info("Retrieved {} hospitals in city: {}", hospitals.size(), city);
            return hospitals;
        } catch (Exception e) {
            logger.error("Error fetching hospitals by city: {}", city, e);
            throw e;
        }
    }

    public Hospital createHospital(Hospital hospital) {
        logger.info("Creating new hospital: {}", hospital.getEmail());
        try {
            // Generate hospital ID starting from H001 and incrementing
            String nextId = generateNextHospitalId();
            hospital.setId(nextId);

            Hospital savedHospital = hospitalRepository.save(hospital);
            logger.info("Hospital created successfully with ID: {}", savedHospital.getId());
            return savedHospital;
        } catch (Exception e) {
            logger.error("Error creating hospital: {}", hospital.getEmail(), e);
            throw e;
        }
    }

    private String generateNextHospitalId() {
        Optional<Hospital> lastHospital = hospitalRepository.findTopByOrderByIdDesc();
        if (lastHospital.isPresent()) {
            String lastId = lastHospital.get().getId();
            if (lastId.startsWith("H")) {
                try {
                    int number = Integer.parseInt(lastId.substring(1));
                    return String.format("H%03d", number + 1);
                } catch (NumberFormatException e) {
                    // If parsing fails, start from H001
                }
            }
        }
        return "H001";
    }

    public Hospital updateHospital(String id, Hospital hospitalDetails) {
        logger.info("Updating hospital: {}", id);
        try {
            Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
            if (optionalHospital.isPresent()) {
                Hospital hospital = optionalHospital.get();
                hospital.setName(hospitalDetails.getName());
                hospital.setEmail(hospitalDetails.getEmail());
                hospital.setPhone(hospitalDetails.getPhone());
                hospital.setAddress(hospitalDetails.getAddress());
                hospital.setCity(hospitalDetails.getCity());
                hospital.setState(hospitalDetails.getState());
                hospital.setPincode(hospitalDetails.getPincode());
                hospital.setRegistrationNumber(hospitalDetails.getRegistrationNumber());
                hospital.setTotalDoctors(hospitalDetails.getTotalDoctors());
                hospital.setStatus(hospitalDetails.getStatus());
                Hospital updatedHospital = hospitalRepository.save(hospital);
                logger.info("Hospital updated successfully: {}", id);
                return updatedHospital;
            } else {
                logger.warn("Hospital not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating hospital: {}", id, e);
            throw e;
        }
    }

    public void deleteHospital(String id) {
        logger.info("Deleting hospital: {}", id);
        try {
            hospitalRepository.deleteById(id);
            logger.info("Hospital deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting hospital: {}", id, e);
            throw e;
        }
    }

    public Hospital approveHospital(String id) {
        logger.info("Approving hospital: {}", id);
        try {
            Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
            if (optionalHospital.isPresent()) {
                Hospital hospital = optionalHospital.get();
                hospital.setStatus("approved");
                Hospital approvedHospital = hospitalRepository.save(hospital);
                logger.info("Hospital approved successfully: {}", id);
                return approvedHospital;
            } else {
                logger.warn("Hospital not found for approval: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error approving hospital: {}", id, e);
            throw e;
        }
    }

    public Hospital rejectHospital(String id) {
        logger.info("Rejecting hospital: {}", id);
        try {
            Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
            if (optionalHospital.isPresent()) {
                Hospital hospital = optionalHospital.get();
                hospital.setStatus("rejected");
                Hospital rejectedHospital = hospitalRepository.save(hospital);
                logger.info("Hospital rejected successfully: {}", id);
                return rejectedHospital;
            } else {
                logger.warn("Hospital not found for rejection: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error rejecting hospital: {}", id, e);
            throw e;
        }
    }

    public List<Patient> getHospitalPatients(String hospitalId) {
        logger.info("Fetching patients for hospital: {}", hospitalId);
        try {
            List<Patient> patients = patientRepository.findByHospitalId(hospitalId);
            logger.info("Retrieved {} patients for hospital: {}", patients.size(), hospitalId);
            return patients;
        } catch (Exception e) {
            logger.error("Error fetching patients for hospital: {}", hospitalId, e);
            throw e;
        }
    }

    // Report generation methods
    public Map<String, Object> generateAppointmentReport(String hospitalId, String startDate, String endDate) {
        logger.info("Generating appointment report for hospital: {} from {} to {}", hospitalId, startDate, endDate);
        Map<String, Object> report = new HashMap<>();
        try {
            List<Patient> patients = getHospitalPatients(hospitalId);
            int totalPatients = patients.size();
            int activePatients = patients.size(); // Simplified - in real implementation, check recent appointments

            report.put("hospitalId", hospitalId);
            report.put("totalPatients", totalPatients);
            report.put("activePatients", activePatients);
            report.put("reportPeriod", startDate + " to " + endDate);
            report.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            logger.info("Appointment report generated successfully for hospital: {}", hospitalId);
        } catch (Exception e) {
            logger.error("Error generating appointment report for hospital: {}", hospitalId, e);
            report.put("error", "Failed to generate appointment report: " + e.getMessage());
        }
        return report;
    }

    public Map<String, Object> generatePatientReport(String hospitalId) {
        logger.info("Generating patient report for hospital: {}", hospitalId);
        Map<String, Object> report = new HashMap<>();
        try {
            List<Patient> patients = getHospitalPatients(hospitalId);
            int totalPatients = patients.size();

            // Age distribution
            Map<String, Integer> ageGroups = new HashMap<>();
            ageGroups.put("0-18", 0);
            ageGroups.put("19-35", 0);
            ageGroups.put("36-50", 0);
            ageGroups.put("51-65", 0);
            ageGroups.put("65+", 0);

            for (Patient patient : patients) {
                int age = patient.getAge() != null ? patient.getAge() : 0;
                if (age <= 18) ageGroups.put("0-18", ageGroups.get("0-18") + 1);
                else if (age <= 35) ageGroups.put("19-35", ageGroups.get("19-35") + 1);
                else if (age <= 50) ageGroups.put("36-50", ageGroups.get("36-50") + 1);
                else if (age <= 65) ageGroups.put("51-65", ageGroups.get("51-65") + 1);
                else ageGroups.put("65+", ageGroups.get("65+") + 1);
            }

            report.put("hospitalId", hospitalId);
            report.put("totalPatients", totalPatients);
            report.put("ageDistribution", ageGroups);
            report.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            logger.info("Patient report generated successfully for hospital: {}", hospitalId);
        } catch (Exception e) {
            logger.error("Error generating patient report for hospital: {}", hospitalId, e);
            report.put("error", "Failed to generate patient report: " + e.getMessage());
        }
        return report;
    }

    public Map<String, Object> generateDoctorPerformanceReport(String hospitalId, String startDate, String endDate) {
        logger.info("Generating doctor performance report for hospital: {} from {} to {}", hospitalId, startDate, endDate);
        Map<String, Object> report = new HashMap<>();
        try {
            List<Patient> patients = getHospitalPatients(hospitalId);
            int totalPatients = patients.size();

            report.put("hospitalId", hospitalId);
            report.put("totalPatients", totalPatients);
            report.put("reportPeriod", startDate + " to " + endDate);
            report.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            // In a real implementation, this would include doctor-specific metrics
            report.put("doctorMetrics", "Doctor performance metrics would be calculated here");
            logger.info("Doctor performance report generated successfully for hospital: {}", hospitalId);
        } catch (Exception e) {
            logger.error("Error generating doctor performance report for hospital: {}", hospitalId, e);
            report.put("error", "Failed to generate doctor performance report: " + e.getMessage());
        }
        return report;
    }

    public Map<String, Object> generateHospitalOverviewReport(String hospitalId, String startDate, String endDate) {
        logger.info("Generating hospital overview report for hospital: {} from {} to {}", hospitalId, startDate, endDate);
        Map<String, Object> report = new HashMap<>();
        try {
            List<Patient> patients = getHospitalPatients(hospitalId);
            int totalPatients = patients.size();

            Map<String, Object> summary = new HashMap<>();
            summary.put("totalPatients", totalPatients);
            summary.put("activePatients", totalPatients); // Simplified
            summary.put("totalAppointments", totalPatients * 2); // Simplified estimate
            summary.put("completedAppointments", totalPatients); // Simplified

            report.put("hospitalId", hospitalId);
            report.put("reportPeriod", startDate + " to " + endDate);
            report.put("summary", summary);
            report.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            logger.info("Hospital overview report generated successfully for hospital: {}", hospitalId);
        } catch (Exception e) {
            logger.error("Error generating hospital overview report for hospital: {}", hospitalId, e);
            report.put("error", "Failed to generate hospital overview report: " + e.getMessage());
        }
        return report;
    }
}
