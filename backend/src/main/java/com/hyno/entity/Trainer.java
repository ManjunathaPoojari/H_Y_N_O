package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "trainers")
@Data
public class Trainer {

    @Id
    @Column(name = "id", columnDefinition = "VARCHAR(50)")
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TrainerType trainerType; // FITNESS or YOGA

    @ElementCollection
    @CollectionTable(name = "trainer_specialties", joinColumns = @JoinColumn(name = "trainer_id", columnDefinition = "VARCHAR(50)"))
    @Column(name = "specialty")
    private List<String> specialties = new ArrayList<>();

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(nullable = false)
    private Double rating = 0.0;

    private Integer reviewCount = 0;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus availability = AvailabilityStatus.AVAILABLE;

    @ElementCollection
    @CollectionTable(name = "trainer_modes", joinColumns = @JoinColumn(name = "trainer_id", columnDefinition = "VARCHAR(50)"))
    @Column(name = "mode")
    private List<String> modes = new ArrayList<>(); // "virtual", "in-person"

    @ElementCollection
    @CollectionTable(name = "trainer_qualifications", joinColumns = @JoinColumn(name = "trainer_id", columnDefinition = "VARCHAR(50)"))
    @Column(name = "qualification")
    private List<String> qualifications = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "trainer_languages", joinColumns = @JoinColumn(name = "trainer_id", columnDefinition = "VARCHAR(50)"))
    @Column(name = "language")
    private List<String> languages = new ArrayList<>();

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerSession;

    @Column(length = 1000)
    private String bio;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false)
    private String status = "pending"; // pending, approved, rejected

    private boolean isVerified = false;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum TrainerType {
        FITNESS, YOGA
    }

    public enum AvailabilityStatus {
        AVAILABLE, BUSY, OFFLINE
    }
}
