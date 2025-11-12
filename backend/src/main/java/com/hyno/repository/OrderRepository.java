package com.hyno.repository;

import com.hyno.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    List<Order> findByPatientId(String patientId);

    List<Order> findByStatus(String status);

    List<Order> findByPatientIdAndStatus(String patientId, String status);

    @Query("SELECT o FROM Order o WHERE LOWER(o.patientName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(o.patientEmail) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Order> searchByPatientNameOrEmail(@Param("query") String query);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = :status")
    long countByStatus(@Param("status") String status);

    List<Order> findByPaymentStatus(String paymentStatus);
}
