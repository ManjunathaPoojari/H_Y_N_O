package com.hyno.repository;

import com.hyno.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrescriptionRepository extends JpaRepository<Prescription, String> {

    List<Prescription> findByPatientId(String patientId);

    List<Prescription> findByDoctorId(String doctorId);

    List<Prescription> findByAppointmentId(String appointmentId);

    List<Prescription> findByStatus(String status);

    List<Prescription> findByPatientIdAndStatus(String patientId, String status);

    @Query("SELECT p FROM Prescription p WHERE LOWER(p.patientName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.doctorName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Prescription> searchByPatientNameOrDoctorName(@Param("query") String query);

    @Query("SELECT COUNT(p) FROM Prescription p WHERE p.status = :status")
    long countByStatus(@Param("status") String status);
}
