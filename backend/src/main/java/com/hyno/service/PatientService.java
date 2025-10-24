package com.hyno.service;

import com.hyno.entity.Patient;
import com.hyno.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }

    public Optional<Patient> findByEmail(String email) {
        return patientRepository.findByEmail(email);
    }

    public Patient getPatientByEmail(String email) {
        Optional<Patient> patient = patientRepository.findByEmail(email);
        return patient.orElse(null);
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient save(Patient patient) {
        return patientRepository.save(patient);
    }

    public Patient updatePatient(String id, Patient patientDetails) {
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
            return patientRepository.save(patient);
        }
        return null;
    }

    public void deletePatient(String id) {
        patientRepository.deleteById(id);
    }
}
