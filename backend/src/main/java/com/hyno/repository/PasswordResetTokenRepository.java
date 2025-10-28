package com.hyno.repository;

import com.hyno.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, String> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByEmailAndUserType(String email, String userType);

    List<PasswordResetToken> findByExpiryDateBefore(LocalDateTime expiryDate);

    @Modifying
    @Query("DELETE FROM PasswordResetToken t WHERE t.expiryDate < :expiryDate")
    void deleteExpiredTokens(@Param("expiryDate") LocalDateTime expiryDate);
}
