package com.hyno.repository;

import com.hyno.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, String> {

    List<Feedback> findByPatientId(String patientId);

    List<Feedback> findByDoctorId(String doctorId);

    List<Feedback> findByAppointmentId(String appointmentId);

    @Query("SELECT f FROM Feedback f WHERE f.doctor.id = :doctorId ORDER BY f.createdAt DESC")
    List<Feedback> findByDoctorIdOrderByCreatedAtDesc(@Param("doctorId") String doctorId);

    @Query("SELECT f FROM Feedback f WHERE f.patient.id = :patientId ORDER BY f.createdAt DESC")
    List<Feedback> findByPatientIdOrderByCreatedAtDesc(@Param("patientId") String patientId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.doctor.id = :doctorId")
    Double getAverageRatingByDoctor(@Param("doctorId") String doctorId);

    @Query("SELECT COUNT(f) FROM Feedback f WHERE f.doctor.id = :doctorId")
    long countFeedbackByDoctor(@Param("doctorId") String doctorId);

    @Query("SELECT f FROM Feedback f WHERE f.appointment.id = :appointmentId AND f.patient.id = :patientId")
    List<Feedback> findByAppointmentIdAndPatientId(@Param("appointmentId") String appointmentId, @Param("patientId") String patientId);

    @Query("SELECT f FROM Feedback f WHERE f.type = :type ORDER BY f.createdAt DESC")
    List<Feedback> findByTypeOrderByCreatedAtDesc(@Param("type") Feedback.FeedbackType type);
}
