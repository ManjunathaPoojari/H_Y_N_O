package com.hyno.controller;

import com.hyno.entity.ChatMessage;
import com.hyno.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class WebSocketChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/chat.send")
    public WebSocketMessageResponse sendMessage(
            @Payload ChatMessageRequest messageRequest) {

        String chatRoomId = messageRequest.getChatRoomId();

        // Send message via service
        ChatMessage message = chatService.sendMessage(
            chatRoomId,
            messageRequest.getSenderId(),
            messageRequest.getSenderName(),
            ChatMessage.SenderRole.valueOf(messageRequest.getSenderRole().toUpperCase()),
            messageRequest.getContent()
        );

        // Create response for frontend
        WebSocketMessageResponse response = new WebSocketMessageResponse();
        response.setId(message.getId());
        response.setSenderId(message.getSenderId());
        response.setSenderName(message.getSenderName());
        response.setSenderRole(message.getSenderRole().name().toLowerCase());
        response.setContent(message.getContent());
        response.setTimestamp(message.getCreatedAt().toString());
        response.setRead(false);
        response.setMessageType("text");

        // Broadcast message to all subscribers of this chat room
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId, response);

        return response;
    }

    @MessageMapping("/chat/{chatRoomId}/markAsRead")
    public void markAsRead(
            @DestinationVariable String chatRoomId,
            @Payload MarkAsReadRequest request) {

        chatService.markMessagesAsRead(chatRoomId, request.getUserId(), request.getUserType());

        // Notify sender that messages were read
        messagingTemplate.convertAndSend(
            "/topic/chat/" + chatRoomId + "/read",
            new ReadNotification(request.getUserId(), LocalDateTime.now())
        );
    }

    @MessageMapping("/chat/{chatRoomId}/typing")
    public void handleTyping(
            @DestinationVariable String chatRoomId,
            @Payload TypingRequest request) {

        // Broadcast typing status to all participants in the chat room
        messagingTemplate.convertAndSend("/topic/chat/" + chatRoomId + "/typing", request);
    }

    private String getOtherUserDestination(String chatRoomId, String senderId) {
        // This would need to be implemented based on chat room participants
        // For now, we'll use a generic approach
        return "/user/" + chatRoomId + "/notifications";
    }

    // DTO classes for WebSocket messages
    public static class ChatMessageRequest {
        private String chatRoomId;
        private String senderId;
        private String senderName;
        private String senderRole;
        private String content;

        // Getters and setters
        public String getChatRoomId() { return chatRoomId; }
        public void setChatRoomId(String chatRoomId) { this.chatRoomId = chatRoomId; }

        public String getSenderId() { return senderId; }
        public void setSenderId(String senderId) { this.senderId = senderId; }

        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }

        public String getSenderRole() { return senderRole; }
        public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class MarkAsReadRequest {
        private String userId;
        private String userType;

        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getUserType() { return userType; }
        public void setUserType(String userType) { this.userType = userType; }
    }

    public static class TypingRequest {
        private String userId;
        private String userName;
        private boolean isTyping;

        // Getters and setters
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }

        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }

        public boolean isTyping() { return isTyping; }
        public void setTyping(boolean typing) { isTyping = typing; }
    }

    public static class ReadNotification {
        private String readerId;
        private LocalDateTime readAt;

        public ReadNotification(String readerId, LocalDateTime readAt) {
            this.readerId = readerId;
            this.readAt = readAt;
        }

        // Getters
        public String getReaderId() { return readerId; }
        public LocalDateTime getReadAt() { return readAt; }
    }

    public static class WebSocketMessageResponse {
        private String id;
        private String senderId;
        private String senderName;
        private String senderRole;
        private String content;
        private String timestamp;
        private boolean read;
        private String messageType;

        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getSenderId() { return senderId; }
        public void setSenderId(String senderId) { this.senderId = senderId; }

        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }

        public String getSenderRole() { return senderRole; }
        public void setSenderRole(String senderRole) { this.senderRole = senderRole; }

        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

        public boolean isRead() { return read; }
        public void setRead(boolean read) { this.read = read; }

        public String getMessageType() { return messageType; }
        public void setMessageType(String messageType) { this.messageType = messageType; }
    }
}
