package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
public class Patient {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private Integer age;
    private String gender;
    private String bloodGroup;
    private LocalDate dateOfBirth;

    @ElementCollection
    @CollectionTable(name = "patient_allergies", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "allergy")
    private List<String> allergies = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "patient_medical_history", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "condition_name")
    private List<String> medicalHistory = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "patient_current_medications", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "medication")
    private List<String> currentMedications = new ArrayList<>();

    private String address;
    private String emergencyContact;
    private String password;
    private boolean isVerified = false;
    private String notes;

    @Column(name = "hospital_id")
    private String hospitalId;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
