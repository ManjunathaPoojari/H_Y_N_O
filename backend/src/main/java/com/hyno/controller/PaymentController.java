package com.hyno.controller;

import com.hyno.entity.Payment;
import com.hyno.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<Payment> getAllPayments() {
        logger.info("Fetching all payments");
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable String id) {
        logger.info("Fetching payment by ID: {}", id);
        Optional<Payment> payment = paymentService.getPaymentById(id);
        return payment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Payment> getPaymentsByPatient(@PathVariable String patientId) {
        logger.info("Fetching payments for patient: {}", patientId);
        return paymentService.getPaymentsByPatient(patientId);
    }

    @GetMapping("/appointment/{appointmentId}")
    public List<Payment> getPaymentsByAppointment(@PathVariable String appointmentId) {
        logger.info("Fetching payments for appointment: {}", appointmentId);
        return paymentService.getPaymentsByAppointment(appointmentId);
    }

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Map<String, Object> request) {
        logger.info("Creating new payment");

        try {
            String appointmentId = (String) request.get("appointmentId");
            String patientId = (String) request.get("patientId");
            BigDecimal amount = new BigDecimal(request.get("amount").toString());
            String methodStr = (String) request.get("method");

            Payment.PaymentMethod method = Payment.PaymentMethod.valueOf(methodStr.toUpperCase());

            Payment payment = paymentService.createPayment(appointmentId, patientId, amount, method);
            logger.info("Payment created successfully with ID: {}", payment.getId());

            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error creating payment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error creating payment", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/process")
    public ResponseEntity<Payment> processPayment(@PathVariable String id) {
        logger.info("Processing payment: {}", id);

        try {
            Payment payment = paymentService.processPayment(id);
            logger.info("Payment processed successfully: {}", id);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error processing payment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error processing payment: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/{id}/refund")
    public ResponseEntity<Payment> refundPayment(@PathVariable String id, @RequestBody Map<String, String> request) {
        logger.info("Refunding payment: {}", id);

        try {
            String reason = request.get("reason");
            Payment payment = paymentService.refundPayment(id, reason);
            logger.info("Payment refunded successfully: {}", id);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException e) {
            logger.error("Validation error refunding payment: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error refunding payment: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/patient/{patientId}/completed")
    public List<Payment> getCompletedPaymentsByPatient(@PathVariable String patientId) {
        logger.info("Fetching completed payments for patient: {}", patientId);
        return paymentService.getCompletedPaymentsByPatient(patientId);
    }

    @GetMapping("/patient/{patientId}/stats")
    public ResponseEntity<Map<String, Object>> getPaymentStatsByPatient(@PathVariable String patientId) {
        logger.info("Fetching payment stats for patient: {}", patientId);

        try {
            BigDecimal totalPaid = paymentService.getTotalPaidByPatient(patientId);
            long completedCount = paymentService.getCompletedPaymentsCountByPatient(patientId);

            Map<String, Object> stats = Map.of(
                "totalPaid", totalPaid,
                "completedPaymentsCount", completedCount
            );

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching payment stats for patient: {}", patientId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
