package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "yoga_trainers")
@Data
public class YogaTrainer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ElementCollection
    @CollectionTable(name = "trainer_specialties", joinColumns = @JoinColumn(name = "trainer_id"))
    @Column(name = "specialty")
    private List<String> specialties;

    @Column(nullable = false)
    private Integer experienceYears;

    @Column(nullable = false)
    private Double rating;

    @Column(nullable = false)
    private Integer reviewCount;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AvailabilityStatus availability;

    @ElementCollection
    @CollectionTable(name = "trainer_modes", joinColumns = @JoinColumn(name = "trainer_id"))
    @Column(name = "mode")
    private List<String> modes; // "virtual", "in-person"

    @ElementCollection
    @CollectionTable(name = "trainer_qualifications", joinColumns = @JoinColumn(name = "trainer_id"))
    @Column(name = "qualification")
    private List<String> qualifications;

    @ElementCollection
    @CollectionTable(name = "trainer_languages", joinColumns = @JoinColumn(name = "trainer_id"))
    @Column(name = "language")
    private List<String> languages;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerSession;

    @Column(length = 1000)
    private String bio;

    @Column(nullable = false)
    private String image;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum AvailabilityStatus {
        AVAILABLE, BUSY, OFFLINE
    }
}
