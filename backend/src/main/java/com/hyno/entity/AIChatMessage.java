package com.hyno.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ai_chat_messages")
@Data
public class AIChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Enumerated(EnumType.STRING)
    @Column(name = "context", nullable = false)
    private ChatContext context;

    @Enumerated(EnumType.STRING)
    @Column(name = "sender_role", nullable = false)
    private SenderRole senderRole;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(name = "ai_response")
    private String aiResponse;

    @Column(name = "feeling_detected")
    private String feelingDetected;

    @Column(name = "suggestions_provided")
    private String suggestionsProvided;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum ChatContext {
        NUTRITION, YOGA
    }

    public enum SenderRole {
        USER, AI_ASSISTANT
    }
}
