package com.hyno.repository;

import com.hyno.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRoomRepository extends JpaRepository<ChatRoom, String> {

    List<ChatRoom> findByPatient_Id(String patientId);

    List<ChatRoom> findByDoctor_Id(String doctorId);

    List<ChatRoom> findByAppointmentId(String appointmentId);

    Optional<ChatRoom> findByAppointmentIdAndPatientIdAndDoctorId(String appointmentId, String patientId, String doctorId);

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.patient.id = :patientId AND cr.status = 'ACTIVE' ORDER BY cr.lastMessageTime DESC")
    List<ChatRoom> findActiveByPatientId(@Param("patientId") String patientId);

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.doctor.id = :doctorId AND cr.status = 'ACTIVE' ORDER BY cr.lastMessageTime DESC")
    List<ChatRoom> findActiveByDoctorId(@Param("doctorId") String doctorId);

    @Query("SELECT cr FROM ChatRoom cr WHERE (cr.patient.id = :userId OR cr.doctor.id = :userId) AND cr.status = 'ACTIVE' ORDER BY cr.lastMessageTime DESC")
    List<ChatRoom> findActiveByUserId(@Param("userId") String userId);
}
