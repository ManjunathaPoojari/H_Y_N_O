package com.hyno.repository;

import com.hyno.entity.VideoCall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoCallRepository extends JpaRepository<VideoCall, String> {

    List<VideoCall> findByAppointmentId(String appointmentId);

    List<VideoCall> findByDoctorId(String doctorId);

    List<VideoCall> findByPatientId(String patientId);

    @Query("SELECT vc FROM VideoCall vc WHERE vc.appointment.id = :appointmentId ORDER BY vc.startTime DESC")
    List<VideoCall> findByAppointmentIdOrderByStartTimeDesc(@Param("appointmentId") String appointmentId);

    @Query("SELECT vc FROM VideoCall vc WHERE vc.doctor.id = :doctorId ORDER BY vc.startTime DESC")
    List<VideoCall> findByDoctorIdOrderByStartTimeDesc(@Param("doctorId") String doctorId);

    @Query("SELECT vc FROM VideoCall vc WHERE vc.patient.id = :patientId ORDER BY vc.startTime DESC")
    List<VideoCall> findByPatientIdOrderByStartTimeDesc(@Param("patientId") String patientId);
}
