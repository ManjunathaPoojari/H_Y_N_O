
package com.hyno.service;

import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
import com.hyno.entity.HospitalDoctor;
import com.hyno.entity.HospitalDoctorId;
import com.hyno.repository.DoctorRepository;
import com.hyno.repository.HospitalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorService.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private HospitalDoctorService hospitalDoctorService;

    public List<Doctor> getAllDoctors() {
        logger.info("Fetching all doctors");
        try {
            List<Doctor> doctors = doctorRepository.findAll();
            logger.info("Retrieved {} doctors", doctors.size());
            return doctors;
        } catch (Exception e) {
            logger.error("Error fetching all doctors", e);
            throw e;
        }
    }

    public Optional<Doctor> getDoctorById(String id) {
        logger.info("Fetching doctor by ID: {}", id);
        try {
            Optional<Doctor> doctor = doctorRepository.findById(id);
            if (doctor.isPresent()) {
                logger.info("Doctor found: {}", id);
            } else {
                logger.warn("Doctor not found: {}", id);
            }
            return doctor;
        } catch (Exception e) {
            logger.error("Error fetching doctor by ID: {}", id, e);
            throw e;
        }
    }

    public Doctor getDoctorByEmail(String email) {
        logger.info("Getting doctor by email: {}", email);
        try {
            Optional<Doctor> doctor = doctorRepository.findByEmail(email);
            if (doctor.isPresent()) {
                logger.info("Doctor retrieved by email: {}", email);
                return doctor.get();
            } else {
                logger.warn("Doctor not found by email: {}", email);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error getting doctor by email: {}", email, e);
            throw e;
        }
    }

    public List<Doctor> getDoctorsByStatus(String status) {
        logger.info("Fetching doctors by status: {}", status);
        try {
            List<Doctor> doctors = doctorRepository.findByStatus(status);
            // Check for both uppercase and lowercase to handle inconsistencies
            if (status.equalsIgnoreCase("pending")) {
                List<Doctor> pendingUpper = doctorRepository.findByStatus("PENDING");
                // Combine and remove duplicates
                for (Doctor doc : pendingUpper) {
                    if (!doctors.stream().anyMatch(d -> d.getId().equals(doc.getId()))) {
                        doctors.add(doc);
                    }
                }
            }
            logger.info("Retrieved {} doctors with status: {}", doctors.size(), status);
            return doctors;
        } catch (Exception e) {
            logger.error("Error fetching doctors by status: {}", status, e);
            throw e;
        }
    }

    public List<Doctor> getDoctorsByHospital(String hospitalId) {
        logger.info("Fetching doctors by hospital: {}", hospitalId);
        try {
            List<Doctor> doctors = doctorRepository.findByHospitalId(hospitalId);
            logger.info("Retrieved {} doctors for hospital: {}", doctors.size(), hospitalId);
            return doctors;
        } catch (Exception e) {
            logger.error("Error fetching doctors by hospital: {}", hospitalId, e);
            throw e;
        }
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        logger.info("Fetching doctors by specialization: {}", specialization);
        try {
            List<Doctor> doctors = doctorRepository.findBySpecialization(specialization);
            logger.info("Retrieved {} doctors with specialization: {}", doctors.size(), specialization);
            return doctors;
        } catch (Exception e) {
            logger.error("Error fetching doctors by specialization: {}", specialization, e);
            throw e;
        }
    }

    public Doctor createDoctor(Doctor doctor) {
        logger.info("Creating new doctor: {}", doctor.getEmail());
        try {
            // Generate doctor ID starting from D001 and incrementing
            String nextId = generateNextDoctorId();
            doctor.setId(nextId);

            // Save doctor first to ensure it exists in database
            Doctor savedDoctor = doctorRepository.save(doctor);

            // Set hospital relationship if hospitalId is provided
            if (doctor.getHospitalId() != null) {
                Optional<Hospital> hospital = hospitalRepository.findById(doctor.getHospitalId());
                if (hospital.isPresent()) {
                    // Create HospitalDoctor association
                    HospitalDoctor hospitalDoctor = new HospitalDoctor();
                    HospitalDoctorId id = new HospitalDoctorId(doctor.getHospitalId(), nextId);
                    hospitalDoctor.setId(id);
                    hospitalDoctor.setHospital(hospital.get());
                    hospitalDoctor.setDoctor(savedDoctor);
                    hospitalDoctor.setStatus("pending");
                    hospitalDoctor.setJoinedAt(java.time.LocalDateTime.now());
                    hospitalDoctorService.save(hospitalDoctor);
                } else {
                    logger.warn("Hospital not found with ID: {}", doctor.getHospitalId());
                }
            }

            logger.info("Doctor created successfully with ID: {}", savedDoctor.getId());
            return savedDoctor;
        } catch (Exception e) {
            logger.error("Error creating doctor: {}", doctor.getEmail(), e);
            throw e;
        }
    }

    private String generateNextDoctorId() {
        List<Doctor> allDoctors = doctorRepository.findAll();
        int maxNumber = 0;
        for (Doctor d : allDoctors) {
            String id = d.getId();
            if (id != null && id.startsWith("D")) {
                try {
                    int number = Integer.parseInt(id.substring(1));
                    if (number > maxNumber) {
                        maxNumber = number;
                    }
                } catch (NumberFormatException e) {
                    // ignore invalid IDs
                }
            }
        }
        return String.format("D%03d", maxNumber + 1);
    }

    public Doctor updateDoctor(String id, Doctor doctorDetails) {
        logger.info("Updating doctor: {}", id);
        try {
            Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
            if (optionalDoctor.isPresent()) {
                Doctor doctor = optionalDoctor.get();

                if (doctorDetails.getName() != null) {
                    doctor.setName(doctorDetails.getName());
                }
                if (doctorDetails.getEmail() != null) {
                    doctor.setEmail(doctorDetails.getEmail());
                }
                if (doctorDetails.getPhone() != null) {
                    doctor.setPhone(doctorDetails.getPhone());
                }
                if (doctorDetails.getSpecialization() != null) {
                    doctor.setSpecialization(doctorDetails.getSpecialization());
                }
                if (doctorDetails.getQualification() != null) {
                    doctor.setQualification(doctorDetails.getQualification());
                }
                if (doctorDetails.getExperience() != null) {
                    doctor.setExperience(doctorDetails.getExperience());
                }
                if (doctorDetails.getRating() != null) {
                    doctor.setRating(doctorDetails.getRating());
                }
                if (doctorDetails.getAvailable() != null) {
                    doctor.setAvailable(doctorDetails.getAvailable());
                }
                if (doctorDetails.getHospitalId() != null) {
                    doctor.setHospitalId(doctorDetails.getHospitalId());
                }
                if (doctorDetails.getConsultationFee() != null) {
                    doctor.setConsultationFee(doctorDetails.getConsultationFee());
                }
                if (doctorDetails.getStatus() != null) {
                    doctor.setStatus(doctorDetails.getStatus());
                }
                if (doctorDetails.getAvatarUrl() != null) {
                    doctor.setAvatarUrl(doctorDetails.getAvatarUrl());
                }

                Doctor updatedDoctor = doctorRepository.save(doctor);
                logger.info("Doctor updated successfully: {}", id);
                return updatedDoctor;
            } else {
                logger.warn("Doctor not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating doctor: {}", id, e);
            throw e;
        }
    }

    public void deleteDoctor(String id) {
        logger.info("Deleting doctor: {}", id);
        try {
            // Check if doctor exists
            Optional<Doctor> doctor = doctorRepository.findById(id);
            if (!doctor.isPresent()) {
                logger.warn("Doctor not found for deletion: {}", id);
                throw new RuntimeException("Doctor not found with id: " + id);
            }

            // Delete all hospital associations first
            logger.info("Removing hospital-doctor associations for doctor: {}", id);
            hospitalDoctorService.deleteByDoctorId(id);

            // Delete the doctor
            doctorRepository.deleteById(id);

            // Verify deletion was successful
            Optional<Doctor> deletedCheck = doctorRepository.findById(id);
            if (deletedCheck.isPresent()) {
                logger.error("Doctor deletion failed - record still exists: {}", id);
                throw new RuntimeException("Failed to delete doctor");
            }

            logger.info("Doctor deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting doctor: {}", id, e);
            throw new RuntimeException("Failed to delete doctor: " + e.getMessage(), e);
        }
    }

    public Doctor approveDoctor(String id) {
        logger.info("Approving doctor: {}", id);
        try {
            Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
            if (optionalDoctor.isPresent()) {
                Doctor doctor = optionalDoctor.get();
                doctor.setStatus("approved");
                Doctor approvedDoctor = doctorRepository.save(doctor);
                logger.info("Doctor approved successfully: {}", id);
                return approvedDoctor;
            } else {
                logger.warn("Doctor not found for approval: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error approving doctor: {}", id, e);
            throw e;
        }
    }

    public Doctor suspendDoctor(String id) {
        logger.info("Suspending doctor: {}", id);
        try {
            Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
            if (optionalDoctor.isPresent()) {
                Doctor doctor = optionalDoctor.get();
                doctor.setStatus("suspended");
                Doctor suspendedDoctor = doctorRepository.save(doctor);
                logger.info("Doctor suspended successfully: {}", id);
                return suspendedDoctor;
            } else {
                logger.warn("Doctor not found for suspension: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error suspending doctor: {}", id, e);
            throw e;
        }
    }
}
