package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
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

    @ElementCollection
    @CollectionTable(name = "patient_allergies", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "allergy")
    private List<String> allergies;

    @ElementCollection
    @CollectionTable(name = "patient_medical_history", joinColumns = @JoinColumn(name = "patient_id"))
    @Column(name = "condition_name")
    private List<String> medicalHistory;

    private String address;
    private String emergencyContact;
    private String password;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
