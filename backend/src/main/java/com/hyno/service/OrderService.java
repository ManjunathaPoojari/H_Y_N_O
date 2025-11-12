package com.hyno.service;

import com.hyno.entity.Order;
import com.hyno.entity.OrderItem;
import com.hyno.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    // Create a new order
    public Order createOrder(Order order) {
        // Generate ID if not provided
        if (order.getId() == null || order.getId().isEmpty()) {
            order.setId("ORD" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // Ensure patient_name is set (required field)
        if (order.getPatientName() == null || order.getPatientName().isEmpty()) {
            // If patient_name is not provided, we could fetch it from patient service
            // For now, set a default or throw an error
            throw new IllegalArgumentException("Patient name is required for order creation");
        }

        // Ensure total_amount is set (required field)
        if (order.getTotalAmount() == null) {
            throw new IllegalArgumentException("Total amount is required for order creation");
        }

        // Set timestamps
        order.setOrderDate(LocalDateTime.now());
        order.setCreatedAt(LocalDateTime.now());
        order.setUpdatedAt(LocalDateTime.now());

        // Save the order first to get the ID
        Order savedOrder = orderRepository.save(order);

        // Create and save order items if they exist
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            for (OrderItem item : order.getOrderItems()) {
                item.setOrderId(savedOrder.getId());
                item.setOrder(savedOrder); // Set the bidirectional relationship
                // Note: OrderItem is saved via cascade in Order entity
            }
        }

        return savedOrder;
    }

    // Get order by ID
    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    // Get orders by patient ID (optional)
    public List<Order> getOrdersByPatientId(String patientId) {
        return orderRepository.findByPatientIdOrderByOrderDateDesc(patientId);
    }

    // Get orders by patient ID and status (optional)
    public List<Order> getOrdersByPatientIdAndStatus(String patientId, Order.OrderStatus status) {
        return orderRepository.findByPatientIdAndStatus(patientId, status);
    }

    // Get orders by status
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    // Update order status
    public Order updateOrderStatus(String orderId, Order.OrderStatus status) {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();
            order.setStatus(status);
            order.setUpdatedAt(LocalDateTime.now());
            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found with ID: " + orderId);
    }

    // Cancel order
    public Order cancelOrder(String orderId) {
        return updateOrderStatus(orderId, Order.OrderStatus.cancelled);
    }

    // Get all orders
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // Get recent orders for a patient (last 30 days)
    public List<Order> getRecentOrdersByPatientId(String patientId) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return orderRepository.findRecentOrdersByPatientId(patientId, thirtyDaysAgo);
    }

    // Count orders by patient ID
    public long countOrdersByPatientId(String patientId) {
        return orderRepository.countByPatientId(patientId);
    }

    // Count orders by status
    public long countOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    // Delete order
    public void deleteOrder(String orderId) {
        orderRepository.deleteById(orderId);
    }
}
