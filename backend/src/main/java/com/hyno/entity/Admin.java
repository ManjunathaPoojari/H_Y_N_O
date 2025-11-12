package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
@Data
public class Admin {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String password;
    private boolean isVerified = true; // Admins are pre-verified

    @Enumerated(EnumType.STRING)
    private AdminRole role = AdminRole.ADMIN;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum AdminRole {
        SUPER_ADMIN,
        ADMIN,
        MODERATOR
    }
}
