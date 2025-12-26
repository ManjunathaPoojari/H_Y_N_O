package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
@Data
public class Appointment {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    @JsonIgnore
    private Patient patient;

    @Column(name = "patient_name", nullable = false)
    private String patientName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = true)
    @JsonIgnore
    private Doctor doctor;

    @Column(name = "doctor_name", nullable = false)
    private String doctorName;

    @Column(name = "hospital_name")
    private String hospitalName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hospital_id")
    @JsonIgnore
    private Hospital hospital;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentType type;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false)
    private LocalTime appointmentTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_slot_id")
    @JsonIgnore
    private ScheduleSlot scheduleSlot;

    @JsonProperty("patientId")
    public String getPatientId() {
        return patient != null ? patient.getId() : null;
    }

    @JsonProperty("doctorId")
    public String getDoctorId() {
        return doctor != null ? doctor.getId() : null;
    }

    public LocalTime getTime() {
        return appointmentTime;
    }

    @Column(length = 1000)
    private String reason;

    @Column(length = 2000)
    private String notes;

    @Column(length = 2000)
    private String prescription;

    @Lob
    @Column(name = "prescription_url", length = 1048576) // Large enough for PDF Data URLs
    private String prescriptionUrl;

    // Video Call Status Tracking
    @Enumerated(EnumType.STRING)
    private VideoCallStatus videoCallStatus = VideoCallStatus.NOT_STARTED;

    private LocalDateTime videoCallStartTime;

    private LocalDateTime videoCallEndTime;

    private Integer videoCallDuration; // in seconds

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum AppointmentType {
        VIDEO, CHAT, INPERSON, HOSPITAL, YOGA
    }

    public enum AppointmentStatus {
        PENDING, UPCOMING, COMPLETED, CANCELLED
    }

    public enum VideoCallStatus {
        NOT_STARTED, CONNECTING, IN_PROGRESS, COMPLETED, FAILED, CANCELLED
    }
}
