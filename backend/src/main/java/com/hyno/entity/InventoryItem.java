package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "inventory_items")
@Getter
@Setter
public class InventoryItem {

    @Id
    private String id;

    private String name;
    private String category; // Medicine, Equipment, Consumable
    private Integer quantity;
    private String unit;
    private Integer minLevel;

    private LocalDate expiryDate;

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
