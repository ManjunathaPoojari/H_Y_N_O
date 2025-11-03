package com.hyno.repository;

import com.hyno.entity.DoctorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface DoctorScheduleRepository extends JpaRepository<DoctorSchedule, Long> {

    List<DoctorSchedule> findByDoctorId(String doctorId);

    List<DoctorSchedule> findByDoctorIdAndDate(String doctorId, LocalDate date);

    List<DoctorSchedule> findByDoctorIdAndDateBetween(String doctorId, LocalDate startDate, LocalDate endDate);

    List<DoctorSchedule> findByDoctorIdAndStatus(String doctorId, DoctorSchedule.ScheduleStatus status);

    List<DoctorSchedule> findByDateAndStatus(LocalDate date, DoctorSchedule.ScheduleStatus status);

    List<DoctorSchedule> findByAppointmentId(String appointmentId);

    @Query("SELECT ds FROM DoctorSchedule ds WHERE ds.doctorId = :doctorId AND ds.date = :date AND ds.startTime <= :time AND ds.endTime > :time")
    List<DoctorSchedule> findByDoctorIdAndDateAndTimeRange(@Param("doctorId") String doctorId,
                                                          @Param("date") LocalDate date,
                                                          @Param("time") LocalTime time);

    @Query("SELECT ds FROM DoctorSchedule ds WHERE ds.doctorId = :doctorId AND ds.date >= :startDate AND ds.date <= :endDate AND ds.status = :status")
    List<DoctorSchedule> findAvailableSlots(@Param("doctorId") String doctorId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate,
                                           @Param("status") DoctorSchedule.ScheduleStatus status);

    @Query("SELECT COUNT(ds) FROM DoctorSchedule ds WHERE ds.doctorId = :doctorId AND ds.date = :date AND ds.status = 'AVAILABLE'")
    long countAvailableSlotsByDoctorAndDate(@Param("doctorId") String doctorId, @Param("date") LocalDate date);

    boolean existsByDoctorIdAndDateAndStartTimeAndEndTime(String doctorId, LocalDate date, LocalTime startTime, LocalTime endTime);
}
