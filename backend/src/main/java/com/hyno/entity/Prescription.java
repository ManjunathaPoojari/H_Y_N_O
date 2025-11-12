package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "prescriptions")
@Data
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String patientId;

    @Column(nullable = false)
    private String patientName;

    @Column(nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private String doctorName;

    @Column(nullable = false)
    private String appointmentId;

    @ElementCollection
    @CollectionTable(name = "prescription_medicines", joinColumns = @JoinColumn(name = "prescription_id"))
    private List<PrescriptionMedicine> medicines;

    @Column(length = 1000)
    private String diagnosis;

    @Column(length = 2000)
    private String instructions;

    @Column(length = 50, nullable = false)
    private String status = "ACTIVE"; // ACTIVE, PROCESSED, EXPIRED

    @Column(length = 500)
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @Embeddable
    @Data
    public static class PrescriptionMedicine {
        private String medicineId;
        private String medicineName;
        private String dosage; // e.g., "500mg", "10ml"
        private String frequency; // e.g., "twice daily", "once daily"
        private String duration; // e.g., "7 days", "14 days"
        private String instructions; // e.g., "after meals", "before sleep"
        private Integer quantity;
    }
}
