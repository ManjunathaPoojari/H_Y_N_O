package com.hyno.repository;

import com.hyno.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    List<Schedule> findByDoctor_Id(String doctorId);

    List<Schedule> findByHospital_Id(String hospitalId);

    List<Schedule> findByDoctor_IdAndScheduleDate(String doctorId, LocalDate scheduleDate);

    List<Schedule> findByHospital_IdAndScheduleDate(String hospitalId, LocalDate scheduleDate);

    List<Schedule> findByDoctor_IdAndScheduleDateBetween(String doctorId, LocalDate startDate, LocalDate endDate);

    List<Schedule> findByHospital_IdAndScheduleDateBetween(String hospitalId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT s FROM Schedule s WHERE s.doctor.id = :doctorId AND s.scheduleDate >= :startDate AND s.isActive = true ORDER BY s.scheduleDate, s.startTime")
    List<Schedule> findActiveSchedulesByDoctorFromDate(@Param("doctorId") String doctorId, @Param("startDate") LocalDate startDate);

    @Query("SELECT s FROM Schedule s WHERE s.hospital.id = :hospitalId AND s.scheduleDate >= :startDate AND s.isActive = true ORDER BY s.scheduleDate, s.startTime")
    List<Schedule> findActiveSchedulesByHospitalFromDate(@Param("hospitalId") String hospitalId, @Param("startDate") LocalDate startDate);

    @Query("SELECT s FROM Schedule s WHERE s.doctor.id = :doctorId AND s.scheduleDate = :date AND s.isActive = true")
    List<Schedule> findActiveSchedulesByDoctorAndDate(@Param("doctorId") String doctorId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Schedule s WHERE s.hospital.id = :hospitalId AND s.scheduleDate = :date AND s.isActive = true")
    List<Schedule> findActiveSchedulesByHospitalAndDate(@Param("hospitalId") String hospitalId, @Param("date") LocalDate date);
}
