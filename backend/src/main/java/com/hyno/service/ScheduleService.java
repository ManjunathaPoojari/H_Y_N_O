package com.hyno.service;

import com.hyno.entity.Schedule;
import com.hyno.entity.ScheduleSlot;
import com.hyno.repository.ScheduleRepository;
import com.hyno.repository.ScheduleSlotRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleService.class);

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private ScheduleSlotRepository scheduleSlotRepository;

    @Autowired
    private com.hyno.repository.DoctorRepository doctorRepository;

    @Autowired
    private com.hyno.repository.HospitalRepository hospitalRepository;

    // Schedule CRUD operations
    public List<Schedule> getSchedulesByDoctor(String doctorId) {
        logger.info("Fetching schedules for doctor: {}", doctorId);
        try {
            List<Schedule> schedules = scheduleRepository.findByDoctor_Id(doctorId);
            logger.info("Retrieved {} schedules for doctor: {}", schedules.size(), doctorId);
            return schedules;
        } catch (Exception e) {
            logger.error("Error fetching schedules for doctor: {}", doctorId, e);
            throw e;
        }
    }

    public List<Schedule> getSchedulesByHospital(String hospitalId) {
        logger.info("Fetching schedules for hospital: {}", hospitalId);
        try {
            List<Schedule> schedules = scheduleRepository.findByHospital_Id(hospitalId);
            logger.info("Retrieved {} schedules for hospital: {}", schedules.size(), hospitalId);
            return schedules;
        } catch (Exception e) {
            logger.error("Error fetching schedules for hospital: {}", hospitalId, e);
            throw e;
        }
    }

    public List<Schedule> getActiveSchedulesByDoctorFromDate(String doctorId, LocalDate startDate) {
        logger.info("Fetching active schedules for doctor: {} from date: {}", doctorId, startDate);
        try {
            List<Schedule> schedules = scheduleRepository.findActiveSchedulesByDoctorFromDate(doctorId, startDate);
            logger.info("Retrieved {} active schedules for doctor: {}", schedules.size(), doctorId);
            return schedules;
        } catch (Exception e) {
            logger.error("Error fetching active schedules for doctor: {}", doctorId, e);
            throw e;
        }
    }

    public List<Schedule> getActiveSchedulesByHospitalFromDate(String hospitalId, LocalDate startDate) {
        logger.info("Fetching active schedules for hospital: {} from date: {}", hospitalId, startDate);
        try {
            List<Schedule> schedules = scheduleRepository.findActiveSchedulesByHospitalFromDate(hospitalId, startDate);
            logger.info("Retrieved {} active schedules for hospital: {}", schedules.size(), hospitalId);
            return schedules;
        } catch (Exception e) {
            logger.error("Error fetching active schedules for hospital: {}", hospitalId, e);
            throw e;
        }
    }

    @Transactional
    public Schedule createSchedule(Schedule schedule) {
        logger.info("Creating new schedule");
        try {
            // Validate that doctor exists if provided
            if (schedule.getDoctor() != null && schedule.getDoctor().getId() != null) {
                Optional<com.hyno.entity.Doctor> doctor = doctorRepository.findById(schedule.getDoctor().getId());
                if (doctor.isEmpty()) {
                    throw new IllegalArgumentException("Doctor not found with ID: " + schedule.getDoctor().getId());
                }
                schedule.setDoctor(doctor.get());
            }

            // Validate that hospital exists if provided
            if (schedule.getHospital() != null && schedule.getHospital().getId() != null) {
                Optional<com.hyno.entity.Hospital> hospital = hospitalRepository.findById(schedule.getHospital().getId());
                if (hospital.isEmpty()) {
                    throw new IllegalArgumentException("Hospital not found with ID: " + schedule.getHospital().getId());
                }
                schedule.setHospital(hospital.get());
            }

            Schedule savedSchedule = scheduleRepository.save(schedule);
            logger.info("Schedule created successfully with ID: {}", savedSchedule.getId());
            return savedSchedule;
        } catch (Exception e) {
            logger.error("Error creating schedule", e);
            throw e;
        }
    }

    @Transactional
    public Schedule updateSchedule(Long id, Schedule scheduleDetails) {
        logger.info("Updating schedule: {}", id);
        try {
            Optional<Schedule> optionalSchedule = scheduleRepository.findById(id);
            if (optionalSchedule.isPresent()) {
                Schedule schedule = optionalSchedule.get();
                schedule.setScheduleDate(scheduleDetails.getScheduleDate());
                schedule.setStartTime(scheduleDetails.getStartTime());
                schedule.setEndTime(scheduleDetails.getEndTime());
                schedule.setMaxAppointments(scheduleDetails.getMaxAppointments());
                schedule.setAppointmentType(scheduleDetails.getAppointmentType());
                schedule.setNotes(scheduleDetails.getNotes());
                schedule.setIsActive(scheduleDetails.getIsActive());
                Schedule updatedSchedule = scheduleRepository.save(schedule);
                logger.info("Schedule updated successfully: {}", id);
                return updatedSchedule;
            } else {
                logger.warn("Schedule not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating schedule: {}", id, e);
            throw e;
        }
    }

    @Transactional
    public void deleteSchedule(Long id) {
        logger.info("Deleting schedule: {}", id);
        try {
            scheduleRepository.deleteById(id);
            logger.info("Schedule deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting schedule: {}", id, e);
            throw e;
        }
    }

    // ScheduleSlot CRUD operations
    public List<ScheduleSlot> getSlotsBySchedule(Long scheduleId) {
        logger.info("Fetching slots for schedule: {}", scheduleId);
        try {
            List<ScheduleSlot> slots = scheduleSlotRepository.findByScheduleId(scheduleId);
            logger.info("Retrieved {} slots for schedule: {}", slots.size(), scheduleId);
            return slots;
        } catch (Exception e) {
            logger.error("Error fetching slots for schedule: {}", scheduleId, e);
            throw e;
        }
    }

    public List<ScheduleSlot> getAvailableSlotsByDoctorAndDate(String doctorId, LocalDate date) {
        logger.info("Fetching available slots for doctor: {} on date: {}", doctorId, date);
        try {
            List<ScheduleSlot> slots = scheduleSlotRepository.findAvailableSlotsByDoctorAndDate(doctorId, date);
            logger.info("Retrieved {} available slots for doctor: {}", slots.size(), doctorId);
            return slots;
        } catch (Exception e) {
            logger.error("Error fetching available slots for doctor: {}", doctorId, e);
            throw e;
        }
    }

    public List<ScheduleSlot> getAvailableSlotsByHospitalAndDate(String hospitalId, LocalDate date) {
        logger.info("Fetching available slots for hospital: {} on date: {}", hospitalId, date);
        try {
            List<ScheduleSlot> slots = scheduleSlotRepository.findAvailableSlotsByHospitalAndDate(hospitalId, date);
            logger.info("Retrieved {} available slots for hospital: {}", slots.size(), hospitalId);
            return slots;
        } catch (Exception e) {
            logger.error("Error fetching available slots for hospital: {}", hospitalId, e);
            throw e;
        }
    }

    @Transactional
    public ScheduleSlot createScheduleSlot(ScheduleSlot slot) {
        logger.info("Creating new schedule slot");
        try {
            ScheduleSlot savedSlot = scheduleSlotRepository.save(slot);
            logger.info("Schedule slot created successfully with ID: {}", savedSlot.getId());
            return savedSlot;
        } catch (Exception e) {
            logger.error("Error creating schedule slot", e);
            throw e;
        }
    }

    @Transactional
    public ScheduleSlot updateScheduleSlot(Long id, ScheduleSlot slotDetails) {
        logger.info("Updating schedule slot: {}", id);
        try {
            Optional<ScheduleSlot> optionalSlot = scheduleSlotRepository.findById(id);
            if (optionalSlot.isPresent()) {
                ScheduleSlot slot = optionalSlot.get();
                slot.setSlotDate(slotDetails.getSlotDate());
                slot.setStartTime(slotDetails.getStartTime());
                slot.setEndTime(slotDetails.getEndTime());
                slot.setMaxAppointments(slotDetails.getMaxAppointments());
                slot.setStatus(slotDetails.getStatus());
                slot.setNotes(slotDetails.getNotes());
                ScheduleSlot updatedSlot = scheduleSlotRepository.save(slot);
                logger.info("Schedule slot updated successfully: {}", id);
                return updatedSlot;
            } else {
                logger.warn("Schedule slot not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating schedule slot: {}", id, e);
            throw e;
        }
    }

    @Transactional
    public void deleteScheduleSlot(Long id) {
        logger.info("Deleting schedule slot: {}", id);
        try {
            scheduleSlotRepository.deleteById(id);
            logger.info("Schedule slot deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting schedule slot: {}", id, e);
            throw e;
        }
    }

    // Reservation and booking methods
    @Transactional
    public boolean reserveSlot(Long slotId, String userId, int reservationMinutes) {
        logger.info("Reserving slot: {} for user: {}", slotId, userId);
        try {
            Optional<ScheduleSlot> optionalSlot = scheduleSlotRepository.findById(slotId);
            if (optionalSlot.isPresent()) {
                ScheduleSlot slot = optionalSlot.get();
                slot.reserveSlot(userId, reservationMinutes);
                scheduleSlotRepository.save(slot);
                logger.info("Slot reserved successfully: {} for user: {}", slotId, userId);
                return true;
            } else {
                logger.warn("Slot not found for reservation: {}", slotId);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error reserving slot: {}", slotId, e);
            throw e;
        }
    }

    @Transactional
    public boolean releaseSlotReservation(Long slotId, String userId) {
        logger.info("Releasing slot reservation: {} for user: {}", slotId, userId);
        try {
            Optional<ScheduleSlot> optionalSlot = scheduleSlotRepository.findById(slotId);
            if (optionalSlot.isPresent()) {
                ScheduleSlot slot = optionalSlot.get();
                if (slot.getReservedBy() != null && slot.getReservedBy().equals(userId)) {
                    slot.releaseReservation();
                    scheduleSlotRepository.save(slot);
                    logger.info("Slot reservation released successfully: {} for user: {}", slotId, userId);
                    return true;
                } else {
                    logger.warn("Slot not reserved by user: {} or not found: {}", userId, slotId);
                    return false;
                }
            } else {
                logger.warn("Slot not found for releasing reservation: {}", slotId);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error releasing slot reservation: {}", slotId, e);
            throw e;
        }
    }

    @Transactional
    public boolean bookSlot(Long slotId) {
        logger.info("Booking slot: {}", slotId);
        try {
            Optional<ScheduleSlot> optionalSlot = scheduleSlotRepository.findById(slotId);
            if (optionalSlot.isPresent()) {
                ScheduleSlot slot = optionalSlot.get();
                slot.bookAppointment();
                scheduleSlotRepository.save(slot);
                logger.info("Slot booked successfully: {}", slotId);
                return true;
            } else {
                logger.warn("Slot not found for booking: {}", slotId);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error booking slot: {}", slotId, e);
            throw e;
        }
    }

    @Transactional
    public boolean cancelSlotBooking(Long slotId) {
        logger.info("Cancelling slot booking: {}", slotId);
        try {
            Optional<ScheduleSlot> optionalSlot = scheduleSlotRepository.findById(slotId);
            if (optionalSlot.isPresent()) {
                ScheduleSlot slot = optionalSlot.get();
                slot.cancelAppointment();
                scheduleSlotRepository.save(slot);
                logger.info("Slot booking cancelled successfully: {}", slotId);
                return true;
            } else {
                logger.warn("Slot not found for cancelling booking: {}", slotId);
                return false;
            }
        } catch (Exception e) {
            logger.error("Error cancelling slot booking: {}", slotId, e);
            throw e;
        }
    }

    public boolean isSlotAvailable(Long slotId) {
        try {
            Optional<ScheduleSlot> optionalSlot = scheduleSlotRepository.findById(slotId);
            return optionalSlot.isPresent() && optionalSlot.get().canBook();
        } catch (Exception e) {
            logger.error("Error checking slot availability: {}", slotId, e);
            return false;
        }
    }

    public boolean isSlotReservedByUser(Long slotId, String userId) {
        try {
            Optional<ScheduleSlot> optionalSlot = scheduleSlotRepository.findById(slotId);
            if (optionalSlot.isPresent()) {
                ScheduleSlot slot = optionalSlot.get();
                return slot.isReserved() && slot.getReservedBy() != null && slot.getReservedBy().equals(userId) && !slot.isReservationExpired();
            }
            return false;
        } catch (Exception e) {
            logger.error("Error checking slot reservation: {}", slotId, e);
            return false;
        }
    }

    // Cleanup expired reservations
    @Transactional
    public void cleanupExpiredReservations() {
        logger.info("Cleaning up expired slot reservations");
        try {
            List<ScheduleSlot> expiredReservations = scheduleSlotRepository.findAll().stream()
                .filter(ScheduleSlot::isReservationExpired)
                .toList();

            for (ScheduleSlot slot : expiredReservations) {
                slot.releaseReservation();
                scheduleSlotRepository.save(slot);
                logger.info("Released expired reservation for slot: {}", slot.getId());
            }

            logger.info("Cleaned up {} expired reservations", expiredReservations.size());
        } catch (Exception e) {
            logger.error("Error cleaning up expired reservations", e);
            throw e;
        }
    }
}
