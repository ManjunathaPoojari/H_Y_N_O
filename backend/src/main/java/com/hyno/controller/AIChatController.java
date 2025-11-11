package com.hyno.controller;

import com.hyno.entity.AIChatMessage;
import com.hyno.service.AIChatService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-chat")
public class AIChatController {

    private static final Logger logger = LoggerFactory.getLogger(AIChatController.class);

    @Autowired
    private AIChatService aiChatService;

    // Get chat history
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<AIChatMessage>> getChatHistory(
            @PathVariable String userId,
            @RequestParam AIChatMessage.ChatContext context) {
        logger.info("Fetching chat history for user: {} in context: {}", userId, context);
        try {
            List<AIChatMessage> messages = aiChatService.getChatHistory(userId, context);
            logger.info("Retrieved {} messages for user: {}", messages.size(), userId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            logger.error("Error fetching chat history for user: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Save user message
    @PostMapping("/message")
    public ResponseEntity<AIChatMessage> saveMessage(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            String userName = (String) request.get("userName");
            String contextStr = (String) request.get("context");
            String content = (String) request.get("content");

            AIChatMessage.ChatContext context = AIChatMessage.ChatContext.valueOf(contextStr.toUpperCase());

            logger.info("Saving message for user: {} in context: {}", userId, context);
            AIChatMessage message = aiChatService.saveUserMessage(userId, userName, context, content);

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            logger.error("Error saving message", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Save AI response
    @PostMapping("/response")
    public ResponseEntity<AIChatMessage> saveResponse(@RequestBody Map<String, Object> request) {
        try {
            String userId = (String) request.get("userId");
            String userName = (String) request.get("userName");
            String contextStr = (String) request.get("context");
            String userMessage = (String) request.get("userMessage");
            String aiResponse = (String) request.get("aiResponse");
            String feelingDetected = (String) request.get("feelingDetected");
            String suggestions = (String) request.get("suggestions");

            AIChatMessage.ChatContext context = AIChatMessage.ChatContext.valueOf(contextStr.toUpperCase());

            logger.info("Saving AI response for user: {} in context: {}", userId, context);
            AIChatMessage message = aiChatService.saveAIResponse(userId, userName, context,
                    userMessage, aiResponse, feelingDetected, suggestions);

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            logger.error("Error saving AI response", e);
            return ResponseEntity.badRequest().build();
        }
    }

    // Get recent feelings
    @GetMapping("/feelings/{userId}")
    public ResponseEntity<List<String>> getRecentFeelings(
            @PathVariable String userId,
            @RequestParam AIChatMessage.ChatContext context) {
        logger.info("Fetching recent feelings for user: {} in context: {}", userId, context);
        try {
            List<String> feelings = aiChatService.getRecentFeelings(userId, context);
            return ResponseEntity.ok(feelings);
        } catch (Exception e) {
            logger.error("Error fetching recent feelings for user: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Get chat statistics
    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Object>> getChatStats(
            @PathVariable String userId,
            @RequestParam AIChatMessage.ChatContext context) {
        logger.info("Fetching chat stats for user: {} in context: {}", userId, context);
        try {
            Long count = aiChatService.getChatCount(userId, context);
            Map<String, Object> stats = Map.of(
                "totalMessages", count,
                "context", context.toString()
            );
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            logger.error("Error fetching chat stats for user: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
