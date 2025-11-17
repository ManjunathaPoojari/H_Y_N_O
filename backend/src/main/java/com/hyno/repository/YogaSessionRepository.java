package com.hyno.repository;

import com.hyno.entity.YogaSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface YogaSessionRepository extends JpaRepository<YogaSession, Long> {

    List<YogaSession> findByPatient_Id(String patientId);

    List<YogaSession> findByTrainer_Id(String trainerId);

    List<YogaSession> findByStatus(YogaSession.SessionStatus status);

    List<YogaSession> findBySessionDate(LocalDate date);

    @Query("SELECT s FROM YogaSession s WHERE s.patient.id = :patientId AND s.sessionDate >= :date ORDER BY s.sessionDate, s.sessionTime")
    List<YogaSession> findUpcomingByPatientId(@Param("patientId") String patientId, @Param("date") LocalDate date);

    @Query("SELECT s FROM YogaSession s WHERE s.trainer.id = :trainerId AND s.sessionDate >= :date ORDER BY s.sessionDate, s.sessionTime")
    List<YogaSession> findUpcomingByTrainerId(@Param("trainerId") String trainerId, @Param("date") LocalDate date);

    @Query("SELECT s FROM YogaSession s WHERE s.patient.id = :patientId AND s.trainer.id = :trainerId")
    List<YogaSession> findByPatientIdAndTrainerId(@Param("patientId") String patientId, @Param("trainerId") String trainerId);

    @Query("SELECT s FROM YogaSession s WHERE s.sessionDate BETWEEN :startDate AND :endDate")
    List<YogaSession> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT s FROM YogaSession s WHERE s.patient.id = :patientId AND s.status = :status")
    List<YogaSession> findByPatientIdAndStatus(@Param("patientId") String patientId, @Param("status") YogaSession.SessionStatus status);

    @Query("SELECT s FROM YogaSession s WHERE s.trainer.id = :trainerId AND s.status = :status")
    List<YogaSession> findByTrainerIdAndStatus(@Param("trainerId") String trainerId, @Param("status") YogaSession.SessionStatus status);
}
