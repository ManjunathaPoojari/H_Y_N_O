package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "hospital_bills")
@Getter
@Setter
public class HospitalBill {

    @Id
    private String id;

    private String patientName;

    private LocalDate date;

    private BigDecimal amount;

    private String status; // paid, pending, overdue

    @ElementCollection
    @CollectionTable(name = "bill_items", joinColumns = @JoinColumn(name = "bill_id"))
    @Column(name = "item")
    private List<String> items;

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
