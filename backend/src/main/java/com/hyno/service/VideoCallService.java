package com.hyno.service;

import com.hyno.entity.VideoCall;
import com.hyno.entity.Appointment;
import com.hyno.entity.Doctor;
import com.hyno.entity.Patient;
import com.hyno.repository.VideoCallRepository;
import com.hyno.repository.AppointmentRepository;
import com.hyno.repository.DoctorRepository;
import com.hyno.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VideoCallService {

    private final VideoCallRepository videoCallRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    @Transactional
    public VideoCall initiateVideoCall(String appointmentId, String doctorId, String patientId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        VideoCall videoCall = new VideoCall();
        videoCall.setAppointment(appointment);
        videoCall.setDoctor(doctor);
        videoCall.setPatient(patient);
        videoCall.setStartTime(LocalDateTime.now());
        videoCall.setStatus(VideoCall.VideoCallStatus.INITIATED);

        return videoCallRepository.save(videoCall);
    }

    @Transactional
    public VideoCall completeVideoCall(String videoCallId, Integer duration, String notes) {
        VideoCall videoCall = videoCallRepository.findById(videoCallId)
                .orElseThrow(() -> new RuntimeException("Video call not found"));

        videoCall.setEndTime(LocalDateTime.now());
        videoCall.setDuration(duration);
        videoCall.setStatus(VideoCall.VideoCallStatus.COMPLETED);
        if (notes != null && !notes.trim().isEmpty()) {
            videoCall.setNotes(notes);
        }

        return videoCallRepository.save(videoCall);
    }

    @Transactional
    public VideoCall updateVideoCallStatus(String videoCallId, VideoCall.VideoCallStatus status) {
        VideoCall videoCall = videoCallRepository.findById(videoCallId)
                .orElseThrow(() -> new RuntimeException("Video call not found"));

        videoCall.setStatus(status);
        if (status == VideoCall.VideoCallStatus.CONNECTED && videoCall.getStartTime() == null) {
            videoCall.setStartTime(LocalDateTime.now());
        }

        return videoCallRepository.save(videoCall);
    }

    public List<VideoCall> getVideoCallsByAppointment(String appointmentId) {
        return videoCallRepository.findByAppointmentIdOrderByStartTimeDesc(appointmentId);
    }

    public List<VideoCall> getVideoCallsByDoctor(String doctorId) {
        return videoCallRepository.findByDoctorIdOrderByStartTimeDesc(doctorId);
    }

    public List<VideoCall> getVideoCallsByPatient(String patientId) {
        return videoCallRepository.findByPatientIdOrderByStartTimeDesc(patientId);
    }

    public VideoCall getVideoCallById(String videoCallId) {
        return videoCallRepository.findById(videoCallId)
                .orElseThrow(() -> new RuntimeException("Video call not found"));
    }
}
