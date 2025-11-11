package com.hyno.service;

import com.hyno.entity.Doctor;
import com.hyno.entity.Hospital;
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
            List<Doctor> doctors = doctorRepository.findByHospital_Id(hospitalId);
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

            // Set hospital relationship if hospitalId is provided
            if (doctor.getHospital() == null && doctor.getHospitalId() != null) {
                Optional<Hospital> hospital = hospitalRepository.findById(doctor.getHospitalId());
                if (hospital.isPresent()) {
                    doctor.setHospital(hospital.get());
                } else {
                    logger.warn("Hospital not found with ID: {}", doctor.getHospitalId());
                }
            }

            Doctor savedDoctor = doctorRepository.save(doctor);
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
                doctor.setName(doctorDetails.getName());
                doctor.setEmail(doctorDetails.getEmail());
                doctor.setPhone(doctorDetails.getPhone());
                doctor.setSpecialization(doctorDetails.getSpecialization());
                doctor.setQualification(doctorDetails.getQualification());
                doctor.setExperience(doctorDetails.getExperience());
                doctor.setRating(doctorDetails.getRating());
                doctor.setAvailable(doctorDetails.getAvailable());
                doctor.setHospital(doctorDetails.getHospital());
                doctor.setConsultationFee(doctorDetails.getConsultationFee());
                doctor.setStatus(doctorDetails.getStatus());
                doctor.setAvatarUrl(doctorDetails.getAvatarUrl());
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
            doctorRepository.deleteById(id);
            logger.info("Doctor deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting doctor: {}", id, e);
            throw e;
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
