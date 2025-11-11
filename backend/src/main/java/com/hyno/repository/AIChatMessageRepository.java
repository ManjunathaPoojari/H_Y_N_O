package com.hyno.repository;

import com.hyno.entity.AIChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AIChatMessageRepository extends JpaRepository<AIChatMessage, String> {

    List<AIChatMessage> findByUserIdAndContextOrderByCreatedAtAsc(String userId, AIChatMessage.ChatContext context);

    List<AIChatMessage> findByUserIdOrderByCreatedAtDesc(String userId);

    @Query("SELECT acm FROM AIChatMessage acm WHERE acm.userId = :userId AND acm.context = :context AND acm.createdAt >= :since ORDER BY acm.createdAt ASC")
    List<AIChatMessage> findByUserIdAndContextSince(@Param("userId") String userId,
                                                   @Param("context") AIChatMessage.ChatContext context,
                                                   @Param("since") LocalDateTime since);

    @Query("SELECT COUNT(acm) FROM AIChatMessage acm WHERE acm.userId = :userId AND acm.context = :context")
    Long countByUserIdAndContext(@Param("userId") String userId, @Param("context") AIChatMessage.ChatContext context);

    @Query("SELECT DISTINCT acm.feelingDetected FROM AIChatMessage acm WHERE acm.userId = :userId AND acm.context = :context AND acm.feelingDetected IS NOT NULL ORDER BY acm.createdAt DESC")
    List<String> findRecentFeelingsByUserIdAndContext(@Param("userId") String userId,
                                                     @Param("context") AIChatMessage.ChatContext context);
}
