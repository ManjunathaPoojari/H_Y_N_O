package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "schedule_slots")
@Data
public class ScheduleSlot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "schedule_id", nullable = false)
    @JsonIgnore
    private Schedule schedule;

    @Column(nullable = false)
    private LocalDate slotDate;

    @Column(nullable = false)
    private LocalTime startTime;

    @Column(nullable = false)
    private LocalTime endTime;

    @Column(nullable = false)
    private Integer maxAppointments = 1;

    @Column(nullable = false)
    private Integer bookedAppointments = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status = SlotStatus.AVAILABLE;

    @Column(length = 500)
    private String notes;

    // Reservation fields for temporary holds
    private String reservedBy; // User ID who reserved the slot

    private LocalDateTime reservedAt; // When reservation was made

    private LocalDateTime reservationExpiresAt; // When reservation expires

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum SlotStatus {
        AVAILABLE, RESERVED, BOOKED, CANCELLED, COMPLETED
    }

    // Helper methods
    public boolean isAvailable() {
        return status == SlotStatus.AVAILABLE && bookedAppointments < maxAppointments;
    }

    public boolean isReserved() {
        return status == SlotStatus.RESERVED;
    }

    public boolean isReservationExpired() {
        return isReserved() && reservationExpiresAt != null && LocalDateTime.now().isAfter(reservationExpiresAt);
    }

    public boolean canBook() {
        return isAvailable() || (isReserved() && isReservationExpired());
    }

    public boolean canReserve(String userId) {
        return isAvailable() && (reservedBy == null || isReservationExpired());
    }

    public void reserveSlot(String userId, int reservationMinutes) {
        if (!canReserve(userId)) {
            throw new IllegalStateException("Slot cannot be reserved");
        }
        this.status = SlotStatus.RESERVED;
        this.reservedBy = userId;
        this.reservedAt = LocalDateTime.now();
        this.reservationExpiresAt = LocalDateTime.now().plusMinutes(reservationMinutes);
    }

    public void releaseReservation() {
        if (isReserved()) {
            this.status = SlotStatus.AVAILABLE;
            this.reservedBy = null;
            this.reservedAt = null;
            this.reservationExpiresAt = null;
        }
    }

    public void bookAppointment() {
        if (!canBook()) {
            throw new IllegalStateException("Slot is not available for booking");
        }
        // Release any existing reservation
        releaseReservation();
        this.bookedAppointments++;
        if (bookedAppointments >= maxAppointments) {
            this.status = SlotStatus.BOOKED;
        }
    }

    public void cancelAppointment() {
        if (bookedAppointments > 0) {
            this.bookedAppointments--;
            if (bookedAppointments < maxAppointments) {
                this.status = SlotStatus.AVAILABLE;
            }
        }
    }

    public void completeSlot() {
        this.status = SlotStatus.COMPLETED;
    }

    public int getAvailableSpots() {
        return Math.max(0, maxAppointments - bookedAppointments);
    }
}
