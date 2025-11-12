package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@Getter
@Setter
public class Doctor {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Transient
    private String hospitalId;

    private String phone;
    private String specialization;
    private String qualification;
    private Integer experience;
    private BigDecimal rating = BigDecimal.ZERO;
    private Boolean available = true;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    @JsonIgnore
    private Hospital hospital;

    private BigDecimal consultationFee;
    private String status = "pending";
    private String avatarUrl;
    private String password;
    private boolean isVerified = false;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @JsonIgnore
    public Hospital getHospital() {
        return hospital;
    }

    @JsonProperty("hospitalId")
    public String getHospitalId() {
        return hospital != null ? hospital.getId() : null;
    }

    public String getStatus() {
        return status;
    }
}
