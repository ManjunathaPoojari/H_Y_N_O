package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicines")
@Data
public class Medicine {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(length = 500)
    private String genericName;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String manufacturer;

    @Column(length = 100)
    private String dosageForm; // tablet, capsule, syrup, injection, etc.

    @Column(length = 200)
    private String strength; // e.g., "500mg", "10mg/ml"

    @Column(length = 1000)
    private String indications; // what it's used for

    @Column(length = 1000)
    private String contraindications;

    @Column(length = 1000)
    private String sideEffects;

    @Column(length = 1000)
    private String precautions;

    @Column(length = 1000)
    private String interactions;

    @Column(length = 500)
    private String category; // antibiotic, analgesic, etc.

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stockQuantity = 0;

    @Column(length = 50)
    private String prescriptionRequired; // "YES", "NO"

    @Column(length = 20)
    private String status = "ACTIVE"; // ACTIVE, INACTIVE, DISCONTINUED

    @Column(length = 1000)
    private String imageUrl;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
