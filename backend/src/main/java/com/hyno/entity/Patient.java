 package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
@Getter
@Setter
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
    @CollectionTable(name = "patient_diseases", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "disease_name")
    private List<String> diseases = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "patient_current_medications", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "medication")
    private List<String> currentMedications = new ArrayList<>();

    private String address;
    private String emergencyContact;
    private String password;
    private boolean isVerified = false;
    private String notes;

    // Specialized Care - Baby Care
    private Double birthWeight;
    private Double birthHeight;
    private String vaccinationSchedule; // JSON or comma-separated milestones

    // Specialized Care - Elderly Care
    private String mobilityStatus; // e.g., independent, assisted, wheelchair
    private String primaryCaregiverName;
    private String primaryCaregiverPhone;
    @ElementCollection
    @CollectionTable(name = "patient_chronic_conditions", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "condition_name")
    private List<String> chronicConditions = new ArrayList<>();

    // Compliance & Identity
    private String governmentIdType;
    private String governmentIdNumber;
    private boolean identityVerified = false;
    private LocalDateTime identityVerifiedAt;

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
