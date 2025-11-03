package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_schedules")
@Data
public class DoctorSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "doctor_id", nullable = false)
    private String doctorId;

    @Column(nullable = false)
    private LocalDate date;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ScheduleStatus status = ScheduleStatus.AVAILABLE;

    @Column(name = "appointment_id")
    private String appointmentId;

    @Column(length = 500)
    private String notes;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum ScheduleStatus {
        AVAILABLE, HELD, BOOKED, CANCELLED
    }

    // Helper methods
    public boolean isAvailable() {
        return status == ScheduleStatus.AVAILABLE;
    }

    public boolean isHeld() {
        return status == ScheduleStatus.HELD;
    }

    public boolean isBooked() {
        return status == ScheduleStatus.BOOKED;
    }

    public boolean isCancelled() {
        return status == ScheduleStatus.CANCELLED;
    }

    public void holdSlot(String appointmentId) {
        if (!isAvailable()) {
            throw new IllegalStateException("Slot is not available to hold");
        }
        this.status = ScheduleStatus.HELD;
        this.appointmentId = appointmentId;
    }

    public void bookSlot(String appointmentId) {
        if (!isAvailable() && !isHeld()) {
            throw new IllegalStateException("Slot is not available to book");
        }
        this.status = ScheduleStatus.BOOKED;
        this.appointmentId = appointmentId;
    }

    public void cancelSlot() {
        this.status = ScheduleStatus.CANCELLED;
        this.appointmentId = null;
    }

    public void releaseSlot() {
        this.status = ScheduleStatus.AVAILABLE;
        this.appointmentId = null;
    }
}
