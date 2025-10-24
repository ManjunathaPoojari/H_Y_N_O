package com.hyno.service;

import com.hyno.entity.Hospital;
import com.hyno.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Optional<Hospital> getHospitalById(String id) {
        return hospitalRepository.findById(id);
    }

    public Hospital getHospitalByEmail(String email) {
        return hospitalRepository.findByEmail(email);
    }

    public Hospital getHospitalByRegistrationNumber(String registrationNumber) {
        return hospitalRepository.findByRegistrationNumber(registrationNumber);
    }

    public List<Hospital> getHospitalsByStatus(String status) {
        return hospitalRepository.findByStatus(status);
    }

    public List<Hospital> getHospitalsByCity(String city) {
        return hospitalRepository.findByCity(city);
    }

    public Hospital createHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(String id, Hospital hospitalDetails) {
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
            return hospitalRepository.save(hospital);
        }
        return null;
    }

    public void deleteHospital(String id) {
        hospitalRepository.deleteById(id);
    }

    public Hospital approveHospital(String id) {
        Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
        if (optionalHospital.isPresent()) {
            Hospital hospital = optionalHospital.get();
            hospital.setStatus("approved");
            return hospitalRepository.save(hospital);
        }
        return null;
    }

    public Hospital rejectHospital(String id) {
        Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
        if (optionalHospital.isPresent()) {
            Hospital hospital = optionalHospital.get();
            hospital.setStatus("rejected");
            return hospitalRepository.save(hospital);
        }
        return null;
    }
}
