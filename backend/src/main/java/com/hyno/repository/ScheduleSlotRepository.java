package com.hyno.repository;

import com.hyno.entity.ScheduleSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ScheduleSlotRepository extends JpaRepository<ScheduleSlot, Long> {

    List<ScheduleSlot> findByScheduleId(Long scheduleId);

    List<ScheduleSlot> findBySlotDate(LocalDate slotDate);

    List<ScheduleSlot> findBySlotDateAndStartTime(LocalDate slotDate, LocalTime startTime);

    @Query("SELECT ss FROM ScheduleSlot ss WHERE ss.schedule.doctor.id = :doctorId AND ss.slotDate >= :startDate ORDER BY ss.slotDate, ss.startTime")
    List<ScheduleSlot> findSlotsByDoctorFromDate(@Param("doctorId") String doctorId, @Param("startDate") LocalDate startDate);

    @Query("SELECT ss FROM ScheduleSlot ss WHERE ss.schedule.hospital.id = :hospitalId AND ss.slotDate >= :startDate ORDER BY ss.slotDate, ss.startTime")
    List<ScheduleSlot> findSlotsByHospitalFromDate(@Param("hospitalId") String hospitalId, @Param("startDate") LocalDate startDate);

    @Query("SELECT ss FROM ScheduleSlot ss WHERE ss.schedule.doctor.id = :doctorId AND ss.slotDate = :date AND ss.status = 'AVAILABLE' ORDER BY ss.startTime")
    List<ScheduleSlot> findAvailableSlotsByDoctorAndDate(@Param("doctorId") String doctorId, @Param("date") LocalDate date);

    @Query("SELECT ss FROM ScheduleSlot ss WHERE ss.schedule.hospital.id = :hospitalId AND ss.slotDate = :date AND ss.status = 'AVAILABLE' ORDER BY ss.startTime")
    List<ScheduleSlot> findAvailableSlotsByHospitalAndDate(@Param("hospitalId") String hospitalId, @Param("date") LocalDate date);

    @Query("SELECT COUNT(ss) FROM ScheduleSlot ss WHERE ss.schedule.doctor.id = :doctorId AND ss.slotDate = :date AND ss.startTime = :startTime AND ss.status = 'AVAILABLE'")
    long countAvailableSlots(@Param("doctorId") String doctorId, @Param("date") LocalDate date, @Param("startTime") LocalTime startTime);

    @Query("SELECT ss FROM ScheduleSlot ss WHERE ss.schedule.doctor.id = :doctorId AND ss.slotDate BETWEEN :startDate AND :endDate ORDER BY ss.slotDate, ss.startTime")
    List<ScheduleSlot> findSlotsByDoctorInDateRange(@Param("doctorId") String doctorId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ss FROM ScheduleSlot ss WHERE ss.schedule.hospital.id = :hospitalId AND ss.slotDate BETWEEN :startDate AND :endDate ORDER BY ss.slotDate, ss.startTime")
    List<ScheduleSlot> findSlotsByHospitalInDateRange(@Param("hospitalId") String hospitalId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
