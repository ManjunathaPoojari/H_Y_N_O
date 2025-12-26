package com.hyno.controller;

import com.hyno.entity.MedicalEvent;
import com.hyno.service.MedicalEventService;
import com.hyno.service.HospitalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/medical-events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalEventController {

    private final MedicalEventService medicalEventService;
    private final HospitalService hospitalService;

    @GetMapping
    public ResponseEntity<List<MedicalEvent>> getAllEvents() {
        return ResponseEntity.ok(medicalEventService.getAllEvents());
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<MedicalEvent>> getEventsByHospital(@PathVariable String hospitalId) {
        return ResponseEntity.ok(medicalEventService.getEventsByHospital(hospitalId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalEvent> getEventById(@PathVariable String id) {
        return medicalEventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MedicalEvent> createEvent(@RequestBody Map<String, Object> request) {
        MedicalEvent event = new MedicalEvent();
        event.setTitle((String) request.get("title"));
        event.setDescription((String) request.get("description"));
        event.setType(MedicalEvent.EventType.valueOf(((String) request.get("type")).toUpperCase()));
        event.setStartDateTime(java.time.LocalDateTime.parse((String) request.get("startDateTime")));
        event.setEndDateTime(java.time.LocalDateTime.parse((String) request.get("endDateTime")));
        event.setLocation((String) request.get("location"));
        event.setCapacity((Integer) request.get("capacity"));
        
        String hospitalId = (String) request.get("hospitalId");
        event.setHospital(hospitalService.getHospitalById(hospitalId).orElse(null));

        return ResponseEntity.ok(medicalEventService.createEvent(event));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        medicalEventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{eventId}/register/{patientId}")
    public ResponseEntity<MedicalEvent> registerPatient(@PathVariable String eventId, @PathVariable String patientId) {
        try {
            return ResponseEntity.ok(medicalEventService.registerPatientForEvent(eventId, patientId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/{eventId}/unregister/{patientId}")
    public ResponseEntity<MedicalEvent> unregisterPatient(@PathVariable String eventId, @PathVariable String patientId) {
        try {
            return ResponseEntity.ok(medicalEventService.unregisterPatientFromEvent(eventId, patientId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
