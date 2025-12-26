package com.hyno.repository;

import com.hyno.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, String> {

    List<ChatMessage> findByChatRoom_IdOrderByCreatedAtAsc(String chatRoomId);

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.id = :chatRoomId AND cm.createdAt > :since ORDER BY cm.createdAt ASC")
    List<ChatMessage> findByChatRoomIdSince(@Param("chatRoomId") String chatRoomId, @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE cm.chatRoom.id = :chatRoomId AND cm.senderRole != :senderRole AND cm.status = 'SENT'")
    Long countUnreadMessages(@Param("chatRoomId") String chatRoomId, @Param("senderRole") ChatMessage.SenderRole senderRole);

    @Query("SELECT cm FROM ChatMessage cm WHERE cm.chatRoom.id = :chatRoomId AND cm.status = 'SENT' AND cm.senderRole != :senderRole")
    List<ChatMessage> findUnreadMessages(@Param("chatRoomId") String chatRoomId, @Param("senderRole") ChatMessage.SenderRole senderRole);

    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.status = :statusToSet, cm.deliveredAt = :deliveredAt WHERE cm.chatRoom.id = :chatRoomId AND cm.senderRole != :senderRole AND cm.status = :expectedStatus")
    void markMessagesAsDelivered(@Param("chatRoomId") String chatRoomId, @Param("senderRole") ChatMessage.SenderRole senderRole, @Param("deliveredAt") LocalDateTime deliveredAt, @Param("statusToSet") ChatMessage.MessageStatus statusToSet, @Param("expectedStatus") ChatMessage.MessageStatus expectedStatus);

    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.status = :statusToSet, cm.readAt = :readAt WHERE cm.chatRoom.id = :chatRoomId AND cm.senderRole != :senderRole AND (cm.status = :sentStatus OR cm.status = :deliveredStatus)")
    void markMessagesAsRead(@Param("chatRoomId") String chatRoomId, @Param("senderRole") ChatMessage.SenderRole senderRole, @Param("readAt") LocalDateTime readAt, @Param("statusToSet") ChatMessage.MessageStatus statusToSet, @Param("sentStatus") ChatMessage.MessageStatus sentStatus, @Param("deliveredStatus") ChatMessage.MessageStatus deliveredStatus);
}
