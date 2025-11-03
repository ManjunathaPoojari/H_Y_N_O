package com.hyno.controller;

import com.hyno.entity.VideoCall;
import com.hyno.service.VideoCallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/video-calls")
@RequiredArgsConstructor
public class VideoCallController {

    private final VideoCallService videoCallService;

    @PostMapping("/initiate")
    public ResponseEntity<VideoCall> initiateVideoCall(@RequestBody Map<String, String> request) {
        String appointmentId = request.get("appointmentId");
        String doctorId = request.get("doctorId");
        String patientId = request.get("patientId");

        VideoCall videoCall = videoCallService.initiateVideoCall(appointmentId, doctorId, patientId);
        return ResponseEntity.ok(videoCall);
    }

    @PutMapping("/{videoCallId}/complete")
    public ResponseEntity<VideoCall> completeVideoCall(
            @PathVariable String videoCallId,
            @RequestBody Map<String, Object> request) {
        Integer duration = (Integer) request.get("duration");
        String notes = (String) request.get("notes");

        VideoCall videoCall = videoCallService.completeVideoCall(videoCallId, duration, notes);
        return ResponseEntity.ok(videoCall);
    }

    @PutMapping("/{videoCallId}/status")
    public ResponseEntity<VideoCall> updateVideoCallStatus(
            @PathVariable String videoCallId,
            @RequestBody Map<String, String> request) {
        VideoCall.VideoCallStatus status = VideoCall.VideoCallStatus.valueOf(request.get("status"));

        VideoCall videoCall = videoCallService.updateVideoCallStatus(videoCallId, status);
        return ResponseEntity.ok(videoCall);
    }

    @GetMapping("/appointment/{appointmentId}")
    public ResponseEntity<List<VideoCall>> getVideoCallsByAppointment(@PathVariable String appointmentId) {
        List<VideoCall> videoCalls = videoCallService.getVideoCallsByAppointment(appointmentId);
        return ResponseEntity.ok(videoCalls);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<VideoCall>> getVideoCallsByDoctor(@PathVariable String doctorId) {
        List<VideoCall> videoCalls = videoCallService.getVideoCallsByDoctor(doctorId);
        return ResponseEntity.ok(videoCalls);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VideoCall>> getVideoCallsByPatient(@PathVariable String patientId) {
        List<VideoCall> videoCalls = videoCallService.getVideoCallsByPatient(patientId);
        return ResponseEntity.ok(videoCalls);
    }

    @GetMapping("/{videoCallId}")
    public ResponseEntity<VideoCall> getVideoCallById(@PathVariable String videoCallId) {
        VideoCall videoCall = videoCallService.getVideoCallById(videoCallId);
        return ResponseEntity.ok(videoCall);
    }
}
