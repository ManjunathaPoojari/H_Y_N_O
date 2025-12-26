package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
@Data
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_id", nullable = false)
    private Appointment appointment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "doctor_id", nullable = true)
    private Doctor doctor;

    @Column(name = "patient_name", nullable = false)
    @JsonProperty("patientName")
    private String patientName;

    @Column(name = "doctor_name", nullable = false)
    @JsonProperty("doctorName")
    private String doctorName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @JsonProperty("status")
    private ChatRoomStatus status = ChatRoomStatus.ACTIVE;

    @Column(name = "last_message")
    @JsonProperty("lastMessage")
    private String lastMessage;

    @Column(name = "last_message_time")
    @JsonProperty("lastMessageTime")
    private LocalDateTime lastMessageTime;

    @Column(name = "unread_count_patient", nullable = false)
    @JsonProperty("unreadCountPatient")
    private Integer unreadCountPatient = 0;

    @Column(name = "unread_count_doctor", nullable = false)
    @JsonProperty("unreadCountDoctor")
    private Integer unreadCountDoctor = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<ChatMessage> messages = new ArrayList<>();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @JsonProperty("appointmentId")
    public String getAppointmentId() {
        return appointment != null ? appointment.getId() : null;
    }

    @JsonProperty("patientId")
    public String getPatientId() {
        return patient != null ? patient.getId() : null;
    }

    @JsonProperty("doctorId")
    public String getDoctorId() {
        return doctor != null ? doctor.getId() : null;
    }

    public enum ChatRoomStatus {
        ACTIVE, ARCHIVED, CLOSED
    }
}
