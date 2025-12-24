package com.hyno.controller;

import com.hyno.entity.DoctorSchedule;
import com.hyno.service.DoctorScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/doctors/{doctorId}/schedule")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001", "http://localhost:5173" })
public class DoctorScheduleController {

    @Autowired
    private DoctorScheduleService doctorScheduleService;

    @Autowired
    private com.hyno.repository.DoctorRepository doctorRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDoctorSchedule(@PathVariable String doctorId) {
        try {
            Map<String, Object> scheduleData = new HashMap<>();
            scheduleData.put("doctorId", doctorId);

            // Get doctor info to include hospital association
            var doctor = doctorRepository.findById(doctorId).orElse(null);
            if (doctor != null) {
                scheduleData.put("doctorName", doctor.getName());
                scheduleData.put("hospitalId", doctor.getHospitalId());
            }

            // Get ALL slots from today onwards (not just available)
            LocalDate today = LocalDate.now();
            List<DoctorSchedule> allSlots = doctorScheduleService.getSchedulesByDoctorAndDateRange(doctorId, today,
                    today.plusDays(30));

            // Convert to the expected format
            List<Map<String, Object>> slotsData = allSlots.stream()
                    .map(slot -> {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", slot.getId().toString());
                        map.put("date", slot.getDate().toString());
                        map.put("startTime", slot.getStartTime().toString());
                        map.put("endTime", slot.getEndTime().toString());
                        map.put("isAvailable", slot.isAvailable());
                        map.put("status", slot.getStatus().toString());
                        map.put("notes", slot.getNotes());
                        map.put("appointmentId", slot.getAppointmentId());
                        return map;
                    })
                    .collect(Collectors.toList());

            scheduleData.put("availableSlots", slotsData);

            // Get weekly schedule pattern (mock for now, could be derived from schedules)
            scheduleData.put("weeklySchedule", Map.of(
                    "monday", List.of("09:00-12:00", "14:00-17:00"),
                    "tuesday", List.of("09:00-12:00", "14:00-17:00"),
                    "wednesday", List.of("09:00-12:00", "14:00-17:00"),
                    "thursday", List.of("09:00-12:00", "14:00-17:00"),
                    "friday", List.of("09:00-12:00", "14:00-17:00")));

            return ResponseEntity.ok(scheduleData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/slots")
    public ResponseEntity<Map<String, Object>> addScheduleSlot(
            @PathVariable String doctorId,
            @RequestBody Map<String, Object> slotData) {
        try {
            // Parse slot data
            LocalDate slotDate = LocalDate.parse((String) slotData.get("date"));
            LocalTime startTime = LocalTime.parse((String) slotData.get("startTime"));
            LocalTime endTime = LocalTime.parse((String) slotData.get("endTime"));
            String notes = (String) slotData.get("notes");

            // Create the DoctorSchedule slot
            DoctorSchedule slot = new DoctorSchedule();
            slot.setDoctorId(doctorId);
            slot.setDate(slotDate);
            slot.setStartTime(startTime);
            slot.setEndTime(endTime);
            slot.setStatus(DoctorSchedule.ScheduleStatus.AVAILABLE);
            slot.setNotes(notes);

            DoctorSchedule savedSlot = doctorScheduleService.createSchedule(slot);
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedSlot.getId());
            response.put("message", "Schedule slot added successfully");
            response.put("slot", slotData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/slots/{slotId}")
    public ResponseEntity<Map<String, Object>> updateScheduleSlot(
            @PathVariable String doctorId,
            @PathVariable Long slotId,
            @RequestBody Map<String, Object> slotData) {
        try {
            // Parse slot data
            LocalDate slotDate = slotData.get("date") != null ? LocalDate.parse((String) slotData.get("date")) : null;
            LocalTime startTime = slotData.get("startTime") != null
                    ? LocalTime.parse((String) slotData.get("startTime"))
                    : null;
            LocalTime endTime = slotData.get("endTime") != null ? LocalTime.parse((String) slotData.get("endTime"))
                    : null;
            String notes = (String) slotData.get("notes");

            DoctorSchedule slotDetails = new DoctorSchedule();
            if (slotDate != null)
                slotDetails.setDate(slotDate);
            if (startTime != null)
                slotDetails.setStartTime(startTime);
            if (endTime != null)
                slotDetails.setEndTime(endTime);
            slotDetails.setNotes(notes);

            DoctorSchedule updatedSlot = doctorScheduleService.updateSchedule(slotId, slotDetails);
            if (updatedSlot != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", slotId);
                response.put("message", "Schedule slot updated successfully");
                response.put("slot", slotData);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<Map<String, Object>> deleteScheduleSlot(
            @PathVariable String doctorId,
            @PathVariable Long slotId) {
        try {
            doctorScheduleService.deleteSchedule(slotId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Schedule slot deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/slots/{slotId}/book")
    public ResponseEntity<Map<String, Object>> bookScheduleSlot(
            @PathVariable String doctorId,
            @PathVariable Long slotId,
            @RequestBody Map<String, Object> bookingData) {
        try {
            String appointmentId = (String) bookingData.get("appointmentId");
            DoctorSchedule bookedSlot = doctorScheduleService.bookSlot(slotId, appointmentId);
            if (bookedSlot != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", slotId);
                response.put("message", "Schedule slot booked successfully");
                response.put("status", bookedSlot.getStatus().toString());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/slots/{slotId}/release")
    public ResponseEntity<Map<String, Object>> releaseScheduleSlot(
            @PathVariable String doctorId,
            @PathVariable Long slotId) {
        try {
            DoctorSchedule releasedSlot = doctorScheduleService.releaseSlot(slotId);
            if (releasedSlot != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("id", slotId);
                response.put("message", "Schedule slot released successfully");
                response.put("status", releasedSlot.getStatus().toString());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
