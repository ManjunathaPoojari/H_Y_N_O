package com.hyno.service;

import com.hyno.entity.Doctor;
import com.hyno.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(String id) {
        return doctorRepository.findById(id);
    }

    public Doctor getDoctorByEmail(String email) {
        Optional<Doctor> doctor = doctorRepository.findByEmail(email);
        return doctor.orElse(null);
    }

    public List<Doctor> getDoctorsByStatus(String status) {
        return doctorRepository.findByStatus(status);
    }

    public List<Doctor> getDoctorsByHospital(String hospitalId) {
        return doctorRepository.findByHospitalId(hospitalId);
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecialization(specialization);
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(String id, Doctor doctorDetails) {
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
            return doctorRepository.save(doctor);
        }
        return null;
    }

    public void deleteDoctor(String id) {
        doctorRepository.deleteById(id);
    }

    public Doctor approveDoctor(String id) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            doctor.setStatus("approved");
            return doctorRepository.save(doctor);
        }
        return null;
    }

    public Doctor suspendDoctor(String id) {
        Optional<Doctor> optionalDoctor = doctorRepository.findById(id);
        if (optionalDoctor.isPresent()) {
            Doctor doctor = optionalDoctor.get();
            doctor.setStatus("suspended");
            return doctorRepository.save(doctor);
        }
        return null;
    }
}
