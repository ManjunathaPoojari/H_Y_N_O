package com.hyno.repository;

import com.hyno.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, String> {

    List<Payment> findByPatientId(String patientId);

    List<Payment> findByAppointmentId(String appointmentId);

    Optional<Payment> findByTransactionId(String transactionId);

    @Query("SELECT p FROM Payment p WHERE p.patient.id = :patientId AND p.status = :status")
    List<Payment> findByPatientIdAndStatus(@Param("patientId") String patientId, @Param("status") Payment.PaymentStatus status);

    @Query("SELECT p FROM Payment p WHERE p.appointment.id = :appointmentId AND p.status = :status")
    Optional<Payment> findByAppointmentIdAndStatus(@Param("appointmentId") String appointmentId, @Param("status") Payment.PaymentStatus status);

    @Query("SELECT COUNT(p) FROM Payment p WHERE p.patient.id = :patientId AND p.status = 'COMPLETED'")
    long countCompletedPaymentsByPatient(@Param("patientId") String patientId);

    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.patient.id = :patientId AND p.status = 'COMPLETED'")
    java.math.BigDecimal getTotalPaidByPatient(@Param("patientId") String patientId);
}
