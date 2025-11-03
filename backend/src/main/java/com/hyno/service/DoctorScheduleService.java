package com.hyno.service;

import com.hyno.entity.DoctorSchedule;
import com.hyno.repository.DoctorScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class DoctorScheduleService {

    @Autowired
    private DoctorScheduleRepository doctorScheduleRepository;

    public List<DoctorSchedule> getAllSchedules() {
        return doctorScheduleRepository.findAll();
    }

    public Optional<DoctorSchedule> getScheduleById(Long id) {
        return doctorScheduleRepository.findById(id);
    }

    public List<DoctorSchedule> getSchedulesByDoctor(String doctorId) {
        return doctorScheduleRepository.findByDoctorId(doctorId);
    }

    public List<DoctorSchedule> getSchedulesByDoctorAndDate(String doctorId, LocalDate date) {
        return doctorScheduleRepository.findByDoctorIdAndDate(doctorId, date);
    }

    public List<DoctorSchedule> getSchedulesByDoctorAndDateRange(String doctorId, LocalDate startDate, LocalDate endDate) {
        return doctorScheduleRepository.findByDoctorIdAndDateBetween(doctorId, startDate, endDate);
    }

    public List<DoctorSchedule> getAvailableSchedulesByDoctor(String doctorId) {
        return doctorScheduleRepository.findByDoctorIdAndStatus(doctorId, DoctorSchedule.ScheduleStatus.AVAILABLE);
    }

    public List<DoctorSchedule> getAvailableSchedulesByDate(LocalDate date) {
        return doctorScheduleRepository.findByDateAndStatus(date, DoctorSchedule.ScheduleStatus.AVAILABLE);
    }

    public DoctorSchedule createSchedule(DoctorSchedule schedule) {
        // Check for conflicts
        if (doctorScheduleRepository.existsByDoctorIdAndDateAndStartTimeAndEndTime(
                schedule.getDoctorId(), schedule.getDate(), schedule.getStartTime(), schedule.getEndTime())) {
            throw new IllegalArgumentException("Schedule slot already exists for this time");
        }
        return doctorScheduleRepository.save(schedule);
    }

    public DoctorSchedule updateSchedule(Long id, DoctorSchedule scheduleDetails) {
        Optional<DoctorSchedule> optionalSchedule = doctorScheduleRepository.findById(id);
        if (optionalSchedule.isPresent()) {
            DoctorSchedule schedule = optionalSchedule.get();
            schedule.setDate(scheduleDetails.getDate());
            schedule.setStartTime(scheduleDetails.getStartTime());
            schedule.setEndTime(scheduleDetails.getEndTime());
            schedule.setStatus(scheduleDetails.getStatus());
            schedule.setAppointmentId(scheduleDetails.getAppointmentId());
            schedule.setNotes(scheduleDetails.getNotes());
            return doctorScheduleRepository.save(schedule);
        }
        return null;
    }

    public void deleteSchedule(Long id) {
        doctorScheduleRepository.deleteById(id);
    }

    public DoctorSchedule holdSlot(Long id, String appointmentId) {
        Optional<DoctorSchedule> optionalSchedule = doctorScheduleRepository.findById(id);
        if (optionalSchedule.isPresent()) {
            DoctorSchedule schedule = optionalSchedule.get();
            schedule.holdSlot(appointmentId);
            return doctorScheduleRepository.save(schedule);
        }
        return null;
    }

    public DoctorSchedule bookSlot(Long id, String appointmentId) {
        Optional<DoctorSchedule> optionalSchedule = doctorScheduleRepository.findById(id);
        if (optionalSchedule.isPresent()) {
            DoctorSchedule schedule = optionalSchedule.get();
            schedule.bookSlot(appointmentId);
            return doctorScheduleRepository.save(schedule);
        }
        return null;
    }

    public DoctorSchedule cancelSlot(Long id) {
        Optional<DoctorSchedule> optionalSchedule = doctorScheduleRepository.findById(id);
        if (optionalSchedule.isPresent()) {
            DoctorSchedule schedule = optionalSchedule.get();
            schedule.cancelSlot();
            return doctorScheduleRepository.save(schedule);
        }
        return null;
    }

    public DoctorSchedule releaseSlot(Long id) {
        Optional<DoctorSchedule> optionalSchedule = doctorScheduleRepository.findById(id);
        if (optionalSchedule.isPresent()) {
            DoctorSchedule schedule = optionalSchedule.get();
            schedule.releaseSlot();
            return doctorScheduleRepository.save(schedule);
        }
        return null;
    }

    public List<DoctorSchedule> getAvailableSlots(String doctorId, LocalDate startDate, LocalDate endDate) {
        return doctorScheduleRepository.findAvailableSlots(doctorId, startDate, endDate, DoctorSchedule.ScheduleStatus.AVAILABLE);
    }

    public long countAvailableSlots(String doctorId, LocalDate date) {
        return doctorScheduleRepository.countAvailableSlotsByDoctorAndDate(doctorId, date);
    }

    public boolean isSlotAvailable(String doctorId, LocalDate date, LocalTime time) {
        List<DoctorSchedule> slots = doctorScheduleRepository.findByDoctorIdAndDateAndTimeRange(doctorId, date, time);
        return slots.stream().anyMatch(DoctorSchedule::isAvailable);
    }
}
