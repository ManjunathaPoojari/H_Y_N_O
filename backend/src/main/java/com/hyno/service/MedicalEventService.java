package com.hyno.service;

import com.hyno.entity.MedicalEvent;
import com.hyno.entity.Patient;
import com.hyno.repository.MedicalEventRepository;
import com.hyno.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MedicalEventService {

    private final MedicalEventRepository medicalEventRepository;
    private final PatientRepository patientRepository;

    public List<MedicalEvent> getAllEvents() {
        return medicalEventRepository.findAll();
    }

    public List<MedicalEvent> getEventsByHospital(String hospitalId) {
        return medicalEventRepository.findByHospitalId(hospitalId);
    }

    public Optional<MedicalEvent> getEventById(String id) {
        return medicalEventRepository.findById(id);
    }

    @Transactional
    public MedicalEvent createEvent(MedicalEvent event) {
        return medicalEventRepository.save(event);
    }

    @Transactional
    public void deleteEvent(String id) {
        medicalEventRepository.deleteById(id);
    }

    @Transactional
    public MedicalEvent registerPatientForEvent(String eventId, String patientId) {
        MedicalEvent event = medicalEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (event.getCapacity() != null && event.getRegisteredPatients().size() >= event.getCapacity()) {
            throw new RuntimeException("Event is full");
        }

        if (event.getRegisteredPatients().contains(patient)) {
            throw new RuntimeException("Patient already registered for this event");
        }

        event.getRegisteredPatients().add(patient);
        return medicalEventRepository.save(event);
    }

    @Transactional
    public MedicalEvent unregisterPatientFromEvent(String eventId, String patientId) {
        MedicalEvent event = medicalEventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        event.getRegisteredPatients().remove(patient);
        return medicalEventRepository.save(event);
    }
}
