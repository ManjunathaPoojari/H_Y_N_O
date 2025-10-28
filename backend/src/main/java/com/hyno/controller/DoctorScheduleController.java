package com.hyno.controller;

import com.hyno.entity.Doctor;
import com.hyno.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doctors/{doctorId}/schedule")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class DoctorScheduleController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getDoctorSchedule(@PathVariable String doctorId) {
        try {
            // For now, return mock schedule data
            // In a real implementation, you'd have a Schedule entity and repository
            Map<String, Object> scheduleData = new HashMap<>();
            scheduleData.put("doctorId", doctorId);

            // Get current date and add some future dates
            java.time.LocalDate today = java.time.LocalDate.now();
            java.time.LocalDate tomorrow = today.plusDays(1);
            java.time.LocalDate dayAfter = today.plusDays(2);

            scheduleData.put("availableSlots", List.of(
                Map.of(
                    "id", "slot-1",
                    "date", tomorrow.toString(),
                    "startTime", "09:00",
                    "endTime", "10:00",
                    "isAvailable", true,
                    "maxAppointments", 2,
                    "appointmentType", "general",
                    "notes", "Regular consultation slot"
                ),
                Map.of(
                    "id", "slot-2",
                    "date", tomorrow.toString(),
                    "startTime", "10:00",
                    "endTime", "11:00",
                    "isAvailable", true,
                    "maxAppointments", 1,
                    "appointmentType", "followup",
                    "notes", "Follow-up appointments only"
                ),
                Map.of(
                    "id", "slot-3",
                    "date", dayAfter.toString(),
                    "startTime", "14:00",
                    "endTime", "15:00",
                    "isAvailable", true,
                    "maxAppointments", 1,
                    "appointmentType", "general",
                    "notes", "Afternoon slot"
                )
            ));
            scheduleData.put("weeklySchedule", Map.of(
                "monday", List.of("09:00-12:00", "14:00-17:00"),
                "tuesday", List.of("09:00-12:00", "14:00-17:00"),
                "wednesday", List.of("09:00-12:00", "14:00-17:00"),
                "thursday", List.of("09:00-12:00", "14:00-17:00"),
                "friday", List.of("09:00-12:00", "14:00-17:00")
            ));

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
            // Mock implementation - in real app, save to database
            Map<String, Object> response = new HashMap<>();
            response.put("id", "slot-" + System.currentTimeMillis());
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
            @PathVariable String slotId,
            @RequestBody Map<String, Object> slotData) {
        try {
            // Mock implementation - in real app, update in database
            Map<String, Object> response = new HashMap<>();
            response.put("id", slotId);
            response.put("message", "Schedule slot updated successfully");
            response.put("slot", slotData);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/slots/{slotId}")
    public ResponseEntity<Map<String, Object>> deleteScheduleSlot(
            @PathVariable String doctorId,
            @PathVariable String slotId) {
        try {
            // Mock implementation - in real app, delete from database
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Schedule slot deleted successfully");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
