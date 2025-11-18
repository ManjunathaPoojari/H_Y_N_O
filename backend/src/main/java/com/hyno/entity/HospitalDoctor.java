package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospital_doctors")
@Getter
@Setter
public class HospitalDoctor {

    @EmbeddedId
    private HospitalDoctorId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("hospitalId")
    @JoinColumn(name = "hospital_id")
    @JsonIgnore
    private Hospital hospital;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("doctorId")
    @JoinColumn(name = "doctor_id")
    @JsonIgnore
    private Doctor doctor;

    @Column(nullable = false)
    private String status = "pending"; // pending, approved, rejected

    @Column(updatable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    private LocalDateTime approvedAt;
    private String approvedBy; // admin user id

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
