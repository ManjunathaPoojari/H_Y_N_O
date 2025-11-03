package com.hyno.service;

import com.hyno.entity.Appointment;
import com.hyno.entity.Payment;
import com.hyno.repository.AppointmentRepository;
import com.hyno.repository.PaymentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    private static final Logger logger = LoggerFactory.getLogger(PaymentService.class);

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AppointmentService appointmentService;

    public List<Payment> getAllPayments() {
        logger.info("Fetching all payments");
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(String id) {
        logger.info("Fetching payment by ID: {}", id);
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsByPatient(String patientId) {
        logger.info("Fetching payments for patient: {}", patientId);
        return paymentRepository.findByPatientId(patientId);
    }

    public List<Payment> getPaymentsByAppointment(String appointmentId) {
        logger.info("Fetching payments for appointment: {}", appointmentId);
        return paymentRepository.findByAppointmentId(appointmentId);
    }

    @Transactional
    public Payment createPayment(String appointmentId, String patientId, BigDecimal amount, Payment.PaymentMethod method) {
        logger.info("Creating payment for appointment: {}, patient: {}, amount: {}", appointmentId, patientId, amount);

        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            throw new IllegalArgumentException("Appointment not found");
        }

        Appointment appointment = appointmentOpt.get();

        // Check if patient matches appointment
        if (!appointment.getPatient().getId().equals(patientId)) {
            throw new IllegalArgumentException("Patient does not match appointment");
        }

        // Check if payment already exists for this appointment
        Optional<Payment> existingPayment = paymentRepository.findByAppointmentIdAndStatus(appointmentId, Payment.PaymentStatus.COMPLETED);
        if (existingPayment.isPresent()) {
            throw new IllegalArgumentException("Payment already exists for this appointment");
        }

        Payment payment = new Payment(appointment, appointment.getPatient(), amount, method);
        payment.setTransactionId(generateTransactionId());

        Payment savedPayment = paymentRepository.save(payment);
        logger.info("Payment created with ID: {}", savedPayment.getId());

        return savedPayment;
    }

    @Transactional
    public Payment processPayment(String paymentId) {
        logger.info("Processing payment: {}", paymentId);

        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isEmpty()) {
            throw new IllegalArgumentException("Payment not found");
        }

        Payment payment = paymentOpt.get();

        if (payment.getStatus() != Payment.PaymentStatus.PENDING) {
            throw new IllegalArgumentException("Payment is not in pending status");
        }

        // Simulate payment processing (in real implementation, integrate with payment gateway)
        boolean paymentSuccess = simulatePaymentProcessing(payment);

        if (paymentSuccess) {
            payment.setStatus(Payment.PaymentStatus.COMPLETED);

            // Update appointment status to confirmed
            appointmentService.confirmAppointment(payment.getAppointment().getId());

            logger.info("Payment processed successfully: {}", paymentId);
        } else {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            logger.warn("Payment processing failed: {}", paymentId);
        }

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment refundPayment(String paymentId, String reason) {
        logger.info("Processing refund for payment: {}", paymentId);

        Optional<Payment> paymentOpt = paymentRepository.findById(paymentId);
        if (paymentOpt.isEmpty()) {
            throw new IllegalArgumentException("Payment not found");
        }

        Payment payment = paymentOpt.get();

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new IllegalArgumentException("Only completed payments can be refunded");
        }

        payment.setStatus(Payment.PaymentStatus.REFUNDED);

        // Cancel the appointment
        appointmentService.cancelAppointment(payment.getAppointment().getId());

        logger.info("Payment refunded: {}", paymentId);
        return paymentRepository.save(payment);
    }

    public List<Payment> getCompletedPaymentsByPatient(String patientId) {
        return paymentRepository.findByPatientIdAndStatus(patientId, Payment.PaymentStatus.COMPLETED);
    }

    public BigDecimal getTotalPaidByPatient(String patientId) {
        BigDecimal total = paymentRepository.getTotalPaidByPatient(patientId);
        return total != null ? total : BigDecimal.ZERO;
    }

    public long getCompletedPaymentsCountByPatient(String patientId) {
        return paymentRepository.countCompletedPaymentsByPatient(patientId);
    }

    private String generateTransactionId() {
        return "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private boolean simulatePaymentProcessing(Payment payment) {
        // Simulate payment gateway processing
        // In real implementation, integrate with actual payment gateway
        try {
            Thread.sleep(1000); // Simulate processing time
            return Math.random() > 0.1; // 90% success rate for simulation
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            return false;
        }
    }
}
