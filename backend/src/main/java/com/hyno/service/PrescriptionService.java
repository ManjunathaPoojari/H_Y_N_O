package com.hyno.service;

import com.hyno.entity.Prescription;
import com.hyno.repository.PrescriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    public Optional<Prescription> getPrescriptionById(String id) {
        return prescriptionRepository.findById(id);
    }

    public List<Prescription> getPrescriptionsByPatientId(String patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctorId(String doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<Prescription> getPrescriptionsByStatus(String status) {
        return prescriptionRepository.findByStatus(status);
    }

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescriptionStatus(String id, String status) {
        Optional<Prescription> optionalPrescription = prescriptionRepository.findById(id);
        if (optionalPrescription.isPresent()) {
            Prescription prescription = optionalPrescription.get();
            prescription.setStatus(status);
            return prescriptionRepository.save(prescription);
        }
        return null;
    }

    public boolean deletePrescription(String id) {
        if (prescriptionRepository.existsById(id)) {
            prescriptionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
