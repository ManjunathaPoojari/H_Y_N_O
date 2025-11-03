package com.hyno.controller;

import com.hyno.entity.ScheduleSlot;
import com.hyno.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hospitals/{hospitalId}/schedule")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class HospitalScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHospitalSchedule(@PathVariable String hospitalId) {
        try {
            Map<String, Object> scheduleData = new HashMap<>();
            scheduleData.put("hospitalId", hospitalId);

            // Get available slots from today onwards
            LocalDate today = LocalDate.now();
            List<ScheduleSlot> availableSlots = scheduleService.getAvailableSlotsByHospitalAndDate(hospitalId, today);

            // Convert to the expected format
            List<Map<String, Object>> slotsData = availableSlots.stream()
                .map(slot -> Map.<String, Object>of(
                    "id", slot.getId().toString(),
                    "date", slot.getSlotDate().toString(),
                    "startTime", slot.getStartTime().toString(),
                    "endTime", slot.getEndTime().toString(),
                    "isAvailable", slot.isAvailable(),
                    "maxAppointments", slot.getMaxAppointments(),
                    "appointmentType", slot.getSchedule().getAppointmentType().toString().toLowerCase(),
                    "notes", slot.getNotes(),
                    "availableSpots", slot.getAvailableSpots()
                ))
                .collect(Collectors.toList());

            scheduleData.put("availableSlots", slotsData);

            // Get weekly schedule pattern (mock for now, could be derived from schedules)
            scheduleData.put("weeklySchedule", Map.of(
                "monday", List.of("08:00-18:00"),
                "tuesday", List.of("08:00-18:00"),
                "wednesday", List.of("08:00-18:00"),
                "thursday", List.of("08:00-18:00"),
                "friday", List.of("08:00-18:00"),
                "saturday", List.of("09:00-14:00"),
                "sunday", List.of("10:00-16:00")
            ));

            return ResponseEntity.ok(scheduleData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/slots")
    public ResponseEntity<Map<String, Object>> addScheduleSlot(
            @PathVariable String hospitalId,
            @RequestBody Map<String, Object> slotData) {
        try {
            ScheduleSlot slot = new ScheduleSlot();
            // Parse the data and create slot
            // This would need proper parsing of date/time from the request

            ScheduleSlot savedSlot = scheduleService.createScheduleSlot(slot);
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
            @PathVariable String hospitalId,
            @PathVariable Long slotId,
            @RequestBody Map<String, Object> slotData) {
        try {
            ScheduleSlot slotDetails = new ScheduleSlot();
            // Parse slotData and update

            ScheduleSlot updatedSlot = scheduleService.updateScheduleSlot(slotId, slotDetails);
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
            @PathVariable String hospitalId,
            @PathVariable Long slotId) {
        try {
            scheduleService.deleteScheduleSlot(slotId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Schedule slot deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
