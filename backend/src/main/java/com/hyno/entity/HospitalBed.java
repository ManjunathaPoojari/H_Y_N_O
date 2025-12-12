package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "hospital_beds")
@Getter
@Setter
public class HospitalBed {

    @Id
    private String id;

    private String ward;
    private String number;
    private String status; // available, occupied, cleaning, maintenance

    private String patientName;
    private String admissionDate;

    @Column(nullable = false)
    private String hospitalId;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
