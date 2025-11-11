package com.hyno.service;

import com.hyno.entity.AIChatMessage;
import com.hyno.repository.AIChatMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AIChatService {

    private static final Logger logger = LoggerFactory.getLogger(AIChatService.class);

    @Autowired
    private AIChatMessageRepository aiChatMessageRepository;

    // Save user message
    public AIChatMessage saveUserMessage(String userId, String userName, AIChatMessage.ChatContext context, String content) {
        logger.info("Saving user message for user: {} in context: {}", userId, context);

        AIChatMessage message = new AIChatMessage();
        message.setUserId(userId);
        message.setUserName(userName);
        message.setContext(context);
        message.setSenderRole(AIChatMessage.SenderRole.USER);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());

        AIChatMessage savedMessage = aiChatMessageRepository.save(message);
        logger.info("User message saved with ID: {}", savedMessage.getId());

        return savedMessage;
    }

    // Save AI response
    public AIChatMessage saveAIResponse(String userId, String userName, AIChatMessage.ChatContext context,
                                       String userMessage, String aiResponse, String feelingDetected, String suggestions) {
        logger.info("Saving AI response for user: {} in context: {}", userId, context);

        AIChatMessage message = new AIChatMessage();
        message.setUserId(userId);
        message.setUserName(userName);
        message.setContext(context);
        message.setSenderRole(AIChatMessage.SenderRole.AI_ASSISTANT);
        message.setContent(userMessage);
        message.setAiResponse(aiResponse);
        message.setFeelingDetected(feelingDetected);
        message.setSuggestionsProvided(suggestions);
        message.setCreatedAt(LocalDateTime.now());

        AIChatMessage savedMessage = aiChatMessageRepository.save(message);
        logger.info("AI response saved with ID: {}", savedMessage.getId());

        return savedMessage;
    }

    // Get chat history
    public List<AIChatMessage> getChatHistory(String userId, AIChatMessage.ChatContext context) {
        logger.info("Fetching chat history for user: {} in context: {}", userId, context);
        List<AIChatMessage> messages = aiChatMessageRepository.findByUserIdAndContextOrderByCreatedAtAsc(userId, context);
        logger.info("Retrieved {} messages for user: {}", messages.size(), userId);
        return messages;
    }

    // Get recent chat history since timestamp
    public List<AIChatMessage> getChatHistorySince(String userId, AIChatMessage.ChatContext context, LocalDateTime since) {
        logger.info("Fetching chat history since {} for user: {} in context: {}", since, userId, context);
        List<AIChatMessage> messages = aiChatMessageRepository.findByUserIdAndContextSince(userId, context, since);
        logger.info("Retrieved {} recent messages for user: {}", messages.size(), userId);
        return messages;
    }

    // Get user's recent feelings
    public List<String> getRecentFeelings(String userId, AIChatMessage.ChatContext context) {
        logger.info("Fetching recent feelings for user: {} in context: {}", userId, context);
        List<String> feelings = aiChatMessageRepository.findRecentFeelingsByUserIdAndContext(userId, context);
        logger.info("Retrieved {} recent feelings for user: {}", feelings.size(), userId);
        return feelings;
    }

    // Get chat statistics
    public Long getChatCount(String userId, AIChatMessage.ChatContext context) {
        logger.info("Getting chat count for user: {} in context: {}", userId, context);
        Long count = aiChatMessageRepository.countByUserIdAndContext(userId, context);
        logger.info("User {} has {} messages in context {}", userId, count, context);
        return count;
    }
}
