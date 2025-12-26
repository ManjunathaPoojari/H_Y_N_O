package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Getter
@Setter
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    private String userRole;

    @Column(nullable = false)
    private String action; // e.g., READ, UPDATE, DELETE, LOGIN

    @Column(nullable = false)
    private String resourceType; // e.g., PATIENT, APPOINTMENT, EVENT

    private String resourceId;

    @Column(length = 2000)
    private String details;

    private String ipAddress;

    private String deviceInfo;

    @Column(updatable = false)
    private LocalDateTime timestamp = LocalDateTime.now();
}
