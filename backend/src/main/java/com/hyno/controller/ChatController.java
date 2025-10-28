package com.hyno.controller;

import com.hyno.entity.ChatMessage;
import com.hyno.entity.ChatRoom;
import com.hyno.service.ChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ChatController {

    private static final Logger logger = LoggerFactory.getLogger(ChatController.class);

    @Autowired
    private ChatService chatService;

    // Get chat rooms for user
    @GetMapping("/rooms")
    public List<ChatRoom> getChatRooms(@RequestParam String userId, @RequestParam String userType) {
        logger.info("Fetching chat rooms for user: {} (type: {})", userId, userType);
        try {
            List<ChatRoom> chatRooms = chatService.getChatRoomsByUser(userId, userType);
            logger.info("Retrieved {} chat rooms for user: {}", chatRooms.size(), userId);
            return chatRooms;
        } catch (Exception e) {
            logger.error("Error fetching chat rooms for user: {} (type: {})", userId, userType, e);
            throw e;
        }
    }

    // Get specific chat room
    @GetMapping("/rooms/{chatRoomId}")
    public ResponseEntity<ChatRoom> getChatRoom(@PathVariable String chatRoomId) {
        logger.info("Fetching chat room: {}", chatRoomId);
        try {
            Optional<ChatRoom> chatRoom = chatService.getChatRoomById(chatRoomId);
            if (chatRoom.isPresent()) {
                logger.info("Chat room found: {}", chatRoomId);
                return ResponseEntity.ok(chatRoom.get());
            } else {
                logger.warn("Chat room not found: {}", chatRoomId);
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            logger.error("Error fetching chat room: {}", chatRoomId, e);
            throw e;
        }
    }

    // Create chat room for appointment
    @PostMapping("/rooms/create")
    public ChatRoom createChatRoom(@RequestParam String appointmentId) {
        logger.info("Creating chat room for appointment: {}", appointmentId);
        try {
            ChatRoom chatRoom = chatService.createChatRoomForAppointment(appointmentId);
            logger.info("Chat room created successfully with ID: {} for appointment: {}", chatRoom.getId(), appointmentId);
            return chatRoom;
        } catch (Exception e) {
            logger.error("Error creating chat room for appointment: {}", appointmentId, e);
            throw e;
        }
    }

    // Get messages for chat room
    @GetMapping("/rooms/{chatRoomId}/messages")
    public List<ChatMessage> getMessages(@PathVariable String chatRoomId) {
        logger.info("Fetching messages for chat room: {}", chatRoomId);
        try {
            List<ChatMessage> messages = chatService.getMessagesByChatRoom(chatRoomId);
            logger.info("Retrieved {} messages for chat room: {}", messages.size(), chatRoomId);
            return messages;
        } catch (Exception e) {
            logger.error("Error fetching messages for chat room: {}", chatRoomId, e);
            throw e;
        }
    }

    // Send message
    @PostMapping("/rooms/{chatRoomId}/messages")
    public ChatMessage sendMessage(
            @PathVariable String chatRoomId,
            @RequestBody Map<String, String> messageData) {
        String senderId = messageData.get("senderId");
        String senderName = messageData.get("senderName");
        String senderRole = messageData.get("senderRole");
        String content = messageData.get("content");

        logger.info("Sending message to chat room: {} from user: {} ({})", chatRoomId, senderId, senderRole);

        try {
            ChatMessage.SenderRole role = "patient".equals(senderRole) ?
                ChatMessage.SenderRole.PATIENT : ChatMessage.SenderRole.DOCTOR;

            ChatMessage message = chatService.sendMessage(chatRoomId, senderId, senderName, role, content);
            logger.info("Message sent successfully with ID: {} in chat room: {}", message.getId(), chatRoomId);
            return message;
        } catch (Exception e) {
            logger.error("Error sending message to chat room: {} from user: {}", chatRoomId, senderId, e);
            throw e;
        }
    }

    // Mark messages as read
    @PutMapping("/rooms/{chatRoomId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String chatRoomId,
            @RequestParam String userId,
            @RequestParam String userType) {
        logger.info("Marking messages as read in chat room: {} for user: {} ({})", chatRoomId, userId, userType);
        try {
            chatService.markMessagesAsRead(chatRoomId, userId, userType);
            logger.info("Messages marked as read successfully in chat room: {} for user: {}", chatRoomId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error marking messages as read in chat room: {} for user: {}", chatRoomId, userId, e);
            throw e;
        }
    }

    // Mark messages as delivered
    @PutMapping("/rooms/{chatRoomId}/delivered")
    public ResponseEntity<Void> markAsDelivered(
            @PathVariable String chatRoomId,
            @RequestParam String userId,
            @RequestParam String userType) {
        logger.info("Marking messages as delivered in chat room: {} for user: {} ({})", chatRoomId, userId, userType);
        try {
            chatService.markMessagesAsDelivered(chatRoomId, userId, userType);
            logger.info("Messages marked as delivered successfully in chat room: {} for user: {}", chatRoomId, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error marking messages as delivered in chat room: {} for user: {}", chatRoomId, userId, e);
            throw e;
        }
    }

    // Get unread count
    @GetMapping("/unread")
    public Map<String, Integer> getUnreadCount(@RequestParam String userId, @RequestParam String userType) {
        logger.info("Fetching unread message count for user: {} ({})", userId, userType);
        try {
            Long count = chatService.getUnreadCount(userId, userType);
            logger.info("Unread message count for user: {} is {}", userId, count);
            return Map.of("unreadCount", count.intValue());
        } catch (Exception e) {
            logger.error("Error fetching unread message count for user: {} ({})", userId, userType, e);
            throw e;
        }
    }

    // Archive chat room
    @PutMapping("/rooms/{chatRoomId}/archive")
    public ResponseEntity<Void> archiveChatRoom(@PathVariable String chatRoomId) {
        logger.info("Archiving chat room: {}", chatRoomId);
        try {
            chatService.archiveChatRoom(chatRoomId);
            logger.info("Chat room archived successfully: {}", chatRoomId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error archiving chat room: {}", chatRoomId, e);
            throw e;
        }
    }
}
