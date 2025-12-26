package com.hyno.service;

import com.hyno.entity.*;
import com.hyno.repository.ChatMessageRepository;
import com.hyno.repository.ChatRoomRepository;
import com.hyno.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChatService {

    private static final Logger logger = LoggerFactory.getLogger(ChatService.class);

    @Autowired
    private ChatRoomRepository chatRoomRepository;

    @Autowired
    private ChatMessageRepository chatMessageRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Chat Room Management
    public List<ChatRoom> getChatRoomsByUser(String userId, String userType) {
        logger.info("Fetching chat rooms for user: {} (type: {})", userId, userType);
        try {
            List<ChatRoom> chatRooms;
            if ("patient".equals(userType)) {
                chatRooms = chatRoomRepository.findByPatient_Id(userId);
            } else if ("doctor".equals(userType)) {
                chatRooms = chatRoomRepository.findByDoctor_Id(userId);
            } else {
                chatRooms = List.of();
            }
            logger.info("Retrieved {} chat rooms for user: {}", chatRooms.size(), userId);
            return chatRooms;
        } catch (Exception e) {
            logger.error("Error fetching chat rooms for user: {}", userId, e);
            throw e;
        }
    }

    public Optional<ChatRoom> getChatRoomById(String id) {
        logger.info("Fetching chat room by ID: {}", id);
        try {
            Optional<ChatRoom> chatRoom = chatRoomRepository.findById(id);
            if (chatRoom.isPresent()) {
                logger.info("Chat room found: {}", id);
            } else {
                logger.warn("Chat room not found: {}", id);
            }
            return chatRoom;
        } catch (Exception e) {
            logger.error("Error fetching chat room by ID: {}", id, e);
            throw e;
        }
    }

    public ChatRoom createChatRoom(ChatRoom chatRoom) {
        logger.info("Creating new chat room for appointment: {}", chatRoom.getAppointment().getId());
        try {
            ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
            logger.info("Chat room created successfully with ID: {}", savedChatRoom.getId());
            return savedChatRoom;
        } catch (Exception e) {
            logger.error("Error creating chat room for appointment: {}", chatRoom.getAppointment().getId(), e);
            throw e;
        }
    }

    public ChatRoom createChatRoomForAppointment(String appointmentId) {
        logger.info("Creating chat room for appointment: {}", appointmentId);
        try {
            Optional<Appointment> appointment = appointmentRepository.findById(appointmentId);
            if (appointment.isPresent()) {
                ChatRoom chatRoom = new ChatRoom();
                chatRoom.setAppointment(appointment.get());
                chatRoom.setPatient(appointment.get().getPatient());
                chatRoom.setDoctor(appointment.get().getDoctor());
                chatRoom.setPatientName(appointment.get().getPatientName());
                chatRoom.setDoctorName(appointment.get().getDoctorName());
                chatRoom.setCreatedAt(LocalDateTime.now());
                ChatRoom savedChatRoom = chatRoomRepository.save(chatRoom);
                logger.info("Chat room created for appointment: {}", appointmentId);
                return savedChatRoom;
            } else {
                logger.warn("Appointment not found for chat room creation: {}", appointmentId);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error creating chat room for appointment: {}", appointmentId, e);
            throw e;
        }
    }

    public void deleteChatRoom(String id) {
        logger.info("Deleting chat room: {}", id);
        try {
            chatRoomRepository.deleteById(id);
            logger.info("Chat room deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting chat room: {}", id, e);
            throw e;
        }
    }

    // Chat Message Management
    public List<ChatMessage> getMessagesByChatRoom(String chatRoomId) {
        logger.info("Fetching messages for chat room: {}", chatRoomId);
        try {
            List<ChatMessage> messages = chatMessageRepository.findByChatRoomIdOrderByCreatedAtAsc(chatRoomId);
            logger.info("Retrieved {} messages for chat room: {}", messages.size(), chatRoomId);
            return messages;
        } catch (Exception e) {
            logger.error("Error fetching messages for chat room: {}", chatRoomId, e);
            throw e;
        }
    }

    public ChatMessage sendMessage(ChatMessage message) {
        logger.info("Sending message to chat room: {}", message.getChatRoom().getId());
        try {
            message.setCreatedAt(LocalDateTime.now());
            ChatMessage savedMessage = chatMessageRepository.save(message);
            logger.info("Message sent successfully with ID: {}", savedMessage.getId());
            return savedMessage;
        } catch (Exception e) {
            logger.error("Error sending message to chat room: {}", message.getChatRoom().getId(), e);
            throw e;
        }
    }

    public ChatMessage sendMessage(String chatRoomId, String senderId, String senderName, ChatMessage.SenderRole senderRole, String content) {
        logger.info("Sending message to chat room: {}", chatRoomId);
        try {
            Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);
            if (chatRoom.isPresent()) {
                ChatMessage message = new ChatMessage();
                message.setChatRoom(chatRoom.get());
                message.setSenderId(senderId);
                message.setSenderName(senderName);
                message.setSenderRole(senderRole);
                message.setSenderType(senderRole == ChatMessage.SenderRole.PATIENT ? ChatMessage.SenderType.PATIENT : ChatMessage.SenderType.DOCTOR);
                message.setContent(content);
                message.setCreatedAt(LocalDateTime.now());
                ChatMessage savedMessage = chatMessageRepository.save(message);
                logger.info("Message sent successfully with ID: {}", savedMessage.getId());
                return savedMessage;
            } else {
                logger.warn("Chat room not found: {}", chatRoomId);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error sending message to chat room: {}", chatRoomId, e);
            throw e;
        }
    }

    public void markMessagesAsRead(String chatRoomId, String userId, String userType) {
        logger.info("Marking messages as read for chat room: {} by user: {}", chatRoomId, userId);
        try {
            ChatMessage.SenderRole senderRole = "patient".equals(userType) ? ChatMessage.SenderRole.DOCTOR : ChatMessage.SenderRole.PATIENT;
            chatMessageRepository.markMessagesAsRead(chatRoomId, senderRole, LocalDateTime.now());
            logger.info("Messages marked as read for chat room: {}", chatRoomId);
        } catch (Exception e) {
            logger.error("Error marking messages as read for chat room: {}", chatRoomId, e);
            throw e;
        }
    }

    public void markMessagesAsDelivered(String chatRoomId, String userId, String userType) {
        logger.info("Marking messages as delivered for chat room: {} by user: {}", chatRoomId, userId);
        try {
            ChatMessage.SenderRole senderRole = "patient".equals(userType) ? ChatMessage.SenderRole.DOCTOR : ChatMessage.SenderRole.PATIENT;
            chatMessageRepository.markMessagesAsDelivered(chatRoomId, senderRole, LocalDateTime.now());
            logger.info("Messages marked as delivered for chat room: {}", chatRoomId);
        } catch (Exception e) {
            logger.error("Error marking messages as delivered for chat room: {}", chatRoomId, e);
            throw e;
        }
    }

    public Long getUnreadCount(String userId, String userType) {
        logger.info("Getting unread count for user: {} ({})", userId, userType);
        try {
            List<ChatRoom> chatRooms = chatRoomRepository.findActiveByUserId(userId);
            long totalUnread = 0;
            for (ChatRoom chatRoom : chatRooms) {
                ChatMessage.SenderRole senderRole = "patient".equals(userType) ? ChatMessage.SenderRole.DOCTOR : ChatMessage.SenderRole.PATIENT;
                Long count = chatMessageRepository.countUnreadMessages(chatRoom.getId(), senderRole);
                totalUnread += count;
            }
            logger.info("Total unread count for user: {} is {}", userId, totalUnread);
            return totalUnread;
        } catch (Exception e) {
            logger.error("Error getting unread count for user: {}", userId, e);
            throw e;
        }
    }

    public void archiveChatRoom(String chatRoomId) {
        logger.info("Archiving chat room: {}", chatRoomId);
        try {
            Optional<ChatRoom> chatRoom = chatRoomRepository.findById(chatRoomId);
            if (chatRoom.isPresent()) {
                chatRoom.get().setStatus(ChatRoom.ChatRoomStatus.ARCHIVED);
                chatRoomRepository.save(chatRoom.get());
                logger.info("Chat room archived: {}", chatRoomId);
            } else {
                logger.warn("Chat room not found: {}", chatRoomId);
            }
        } catch (Exception e) {
            logger.error("Error archiving chat room: {}", chatRoomId, e);
            throw e;
        }
    }

    public void deleteMessage(String id) {
        logger.info("Deleting message: {}", id);
        try {
            chatMessageRepository.deleteById(id);
            logger.info("Message deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting message: {}", id, e);
            throw e;
        }
    }
}
