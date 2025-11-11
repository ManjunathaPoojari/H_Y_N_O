package com.hyno.repository;

import com.hyno.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {

    // Find orders by patient ID (optional)
    List<Order> findByPatientId(String patientId);

    // Find orders by patient ID and status (optional)
    List<Order> findByPatientIdAndStatus(String patientId, Order.OrderStatus status);

    // Find orders by status
    List<Order> findByStatus(Order.OrderStatus status);

    // Find orders by patient ID ordered by order date descending (optional)
    @Query("SELECT o FROM Order o WHERE (:patientId IS NULL OR o.patientId = :patientId) ORDER BY o.orderDate DESC")
    List<Order> findByPatientIdOrderByOrderDateDesc(@Param("patientId") String patientId);

    // Count orders by patient ID (optional)
    long countByPatientId(String patientId);

    // Count orders by status
    long countByStatus(Order.OrderStatus status);

    // Find recent orders (last 30 days) - optional patient ID
    @Query("SELECT o FROM Order o WHERE (:patientId IS NULL OR o.patientId = :patientId) AND o.orderDate >= :thirtyDaysAgo ORDER BY o.orderDate DESC")
    List<Order> findRecentOrdersByPatientId(@Param("patientId") String patientId, @Param("thirtyDaysAgo") java.time.LocalDateTime thirtyDaysAgo);

    // Find all orders (for non-patient users)
    @Query("SELECT o FROM Order o ORDER BY o.orderDate DESC")
    List<Order> findAllOrders();
}
