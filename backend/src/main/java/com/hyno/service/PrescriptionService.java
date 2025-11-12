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

    public List<Prescription> getPrescriptionsByPatient(String patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    public List<Prescription> getPrescriptionsByDoctor(String doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    public List<Prescription> getPrescriptionsByAppointment(String appointmentId) {
        return prescriptionRepository.findByAppointmentId(appointmentId);
    }

    public List<Prescription> getPrescriptionsByStatus(String status) {
        return prescriptionRepository.findByStatus(status);
    }

    public List<Prescription> searchPrescriptions(String query) {
        return prescriptionRepository.searchByPatientNameOrDoctorName(query);
    }

    public Prescription createPrescription(Prescription prescription) {
        return prescriptionRepository.save(prescription);
    }

    public Prescription updatePrescription(String id, Prescription prescriptionDetails) {
        Optional<Prescription> optionalPrescription = prescriptionRepository.findById(id);
        if (optionalPrescription.isPresent()) {
            Prescription prescription = optionalPrescription.get();
            prescription.setStatus(prescriptionDetails.getStatus());
            prescription.setDiagnosis(prescriptionDetails.getDiagnosis());
            prescription.setInstructions(prescriptionDetails.getInstructions());
            prescription.setMedicines(prescriptionDetails.getMedicines());
            prescription.setNotes(prescriptionDetails.getNotes());
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

    public long getPrescriptionCountByStatus(String status) {
        return prescriptionRepository.countByStatus(status);
    }
}
