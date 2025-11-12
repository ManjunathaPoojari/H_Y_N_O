package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
public class Hospital {

    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String registrationNumber;
    private Integer totalDoctors = 0;
    private String status = "pending";
    private String password;
    private boolean isVerified = false;

    @ElementCollection
    @CollectionTable(name = "hospital_facilities", joinColumns = @JoinColumn(name = "hospital_id"))
    @Column(name = "facility")
    private List<String> facilities = new ArrayList<>();

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public String getStatus() {
        return status;
    }
}
