package com.hyno.repository;

import com.hyno.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, String> {
    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.hospital")
    List<Appointment> findAllWithHospital();

    List<Appointment> findByPatient_Id(String patientId);
    List<Appointment> findByDoctor_Id(String doctorId);
    List<Appointment> findByHospital_Id(String hospitalId);
    List<Appointment> findByStatus(Appointment.AppointmentStatus status);
    List<Appointment> findByAppointmentDate(LocalDate date);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.hospital WHERE a.patient.id = :patientId AND a.appointmentDate >= :date ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findUpcomingByPatientId(@Param("patientId") String patientId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.hospital WHERE a.doctor.id = :doctorId AND a.appointmentDate >= :date ORDER BY a.appointmentDate, a.appointmentTime")
    List<Appointment> findUpcomingByDoctorId(@Param("doctorId") String doctorId, @Param("date") LocalDate date);

    @Query("SELECT a FROM Appointment a LEFT JOIN FETCH a.hospital WHERE a.doctor.id = :doctorId AND a.patient.id = :patientId")
    List<Appointment> findByDoctorIdAndPatientId(@Param("doctorId") String doctorId, @Param("patientId") String patientId);
}
