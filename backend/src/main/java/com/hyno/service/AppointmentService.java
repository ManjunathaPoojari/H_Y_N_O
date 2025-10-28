package com.hyno.service;

import com.hyno.entity.Appointment;
import com.hyno.repository.AppointmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private com.hyno.repository.PatientRepository patientRepository;

    @Autowired
    private com.hyno.repository.DoctorRepository doctorRepository;

    @Autowired
    private com.hyno.repository.HospitalRepository hospitalRepository;

    public List<Appointment> getAllAppointments() {
        logger.info("Fetching all appointments");
        try {
            List<Appointment> appointments = appointmentRepository.findAll();
            logger.info("Retrieved {} appointments", appointments.size());
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching all appointments", e);
            throw e;
        }
    }

    public Optional<Appointment> getAppointmentById(String id) {
        logger.info("Fetching appointment by ID: {}", id);
        try {
            Optional<Appointment> appointment = appointmentRepository.findById(id);
            if (appointment.isPresent()) {
                logger.info("Appointment found: {}", id);
            } else {
                logger.warn("Appointment not found: {}", id);
            }
            return appointment;
        } catch (Exception e) {
            logger.error("Error fetching appointment by ID: {}", id, e);
            throw e;
        }
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        logger.info("Fetching appointments for patient: {}", patientId);
        try {
            List<Appointment> appointments = appointmentRepository.findByPatient_Id(patientId);
            logger.info("Retrieved {} appointments for patient: {}", appointments.size(), patientId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments for patient: {}", patientId, e);
            throw e;
        }
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        logger.info("Fetching appointments for doctor: {}", doctorId);
        try {
            List<Appointment> appointments = appointmentRepository.findByDoctor_Id(doctorId);
            logger.info("Retrieved {} appointments for doctor: {}", appointments.size(), doctorId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments for doctor: {}", doctorId, e);
            throw e;
        }
    }

    public List<Appointment> getAppointmentsByHospital(String hospitalId) {
        logger.info("Fetching appointments for hospital: {}", hospitalId);
        try {
            List<Appointment> appointments = appointmentRepository.findByHospital_Id(hospitalId);
            logger.info("Retrieved {} appointments for hospital: {}", appointments.size(), hospitalId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments for hospital: {}", hospitalId, e);
            throw e;
        }
    }

    public List<Appointment> getAppointmentsByStatus(Appointment.AppointmentStatus status) {
        logger.info("Fetching appointments by status: {}", status);
        try {
            List<Appointment> appointments = appointmentRepository.findByStatus(status);
            logger.info("Retrieved {} appointments with status: {}", appointments.size(), status);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments by status: {}", status, e);
            throw e;
        }
    }

    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        logger.info("Fetching appointments by date: {}", date);
        try {
            List<Appointment> appointments = appointmentRepository.findByAppointmentDate(date);
            logger.info("Retrieved {} appointments for date: {}", appointments.size(), date);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching appointments by date: {}", date, e);
            throw e;
        }
    }

    public List<Appointment> getUpcomingAppointmentsByPatient(String patientId) {
        logger.info("Fetching upcoming appointments for patient: {}", patientId);
        try {
            List<Appointment> appointments = appointmentRepository.findUpcomingByPatientId(patientId, LocalDate.now());
            logger.info("Retrieved {} upcoming appointments for patient: {}", appointments.size(), patientId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching upcoming appointments for patient: {}", patientId, e);
            throw e;
        }
    }

    public List<Appointment> getUpcomingAppointmentsByDoctor(String doctorId) {
        logger.info("Fetching upcoming appointments for doctor: {}", doctorId);
        try {
            List<Appointment> appointments = appointmentRepository.findUpcomingByDoctorId(doctorId, LocalDate.now());
            logger.info("Retrieved {} upcoming appointments for doctor: {}", appointments.size(), doctorId);
            return appointments;
        } catch (Exception e) {
            logger.error("Error fetching upcoming appointments for doctor: {}", doctorId, e);
            throw e;
        }
    }

    public Appointment createAppointment(Appointment appointment) {
        logger.info("Creating new appointment for patient: {}", appointment.getPatientName());
        try {
            // Validate that patient exists
            if (appointment.getPatient() == null || appointment.getPatient().getId() == null) {
                throw new IllegalArgumentException("Patient ID is required");
            }
            Optional<com.hyno.entity.Patient> patient = patientRepository.findById(appointment.getPatient().getId());
            if (patient.isEmpty()) {
                throw new IllegalArgumentException("Patient not found with ID: " + appointment.getPatient().getId());
            }
            appointment.setPatient(patient.get());

            // Validate that doctor exists
            if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
                throw new IllegalArgumentException("Doctor ID is required");
            }
            Optional<com.hyno.entity.Doctor> doctor = doctorRepository.findById(appointment.getDoctor().getId());
            if (doctor.isEmpty()) {
                throw new IllegalArgumentException("Doctor not found with ID: " + appointment.getDoctor().getId());
            }
            appointment.setDoctor(doctor.get());

            // Validate that hospital exists (if provided)
            if (appointment.getHospital() != null && appointment.getHospital().getId() != null) {
                Optional<com.hyno.entity.Hospital> hospital = hospitalRepository.findById(appointment.getHospital().getId());
                if (hospital.isEmpty()) {
                    throw new IllegalArgumentException("Hospital not found with ID: " + appointment.getHospital().getId());
                }
                appointment.setHospital(hospital.get());
            }

            // Generate ID if not provided
            if (appointment.getId() == null || appointment.getId().isEmpty()) {
                appointment.setId(java.util.UUID.randomUUID().toString());
            }

            Appointment savedAppointment = appointmentRepository.save(appointment);
            logger.info("Appointment created successfully with ID: {}", savedAppointment.getId());
            return savedAppointment;
        } catch (Exception e) {
            logger.error("Error creating appointment for patient: {}", appointment.getPatientName(), e);
            throw e;
        }
    }

    public Appointment updateAppointment(String id, Appointment appointmentDetails) {
        logger.info("Updating appointment: {}", id);
        try {
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                appointment.setPatient(appointmentDetails.getPatient());
                appointment.setPatientName(appointmentDetails.getPatientName());
                appointment.setDoctor(appointmentDetails.getDoctor());
                appointment.setDoctorName(appointmentDetails.getDoctorName());
                appointment.setHospital(appointmentDetails.getHospital());
                appointment.setType(appointmentDetails.getType());
                appointment.setAppointmentDate(appointmentDetails.getAppointmentDate());
                appointment.setAppointmentTime(appointmentDetails.getAppointmentTime());
                appointment.setStatus(appointmentDetails.getStatus());
                appointment.setReason(appointmentDetails.getReason());
                appointment.setNotes(appointmentDetails.getNotes());
                appointment.setPrescription(appointmentDetails.getPrescription());
                Appointment updatedAppointment = appointmentRepository.save(appointment);
                logger.info("Appointment updated successfully: {}", id);
                return updatedAppointment;
            } else {
                logger.warn("Appointment not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating appointment: {}", id, e);
            throw e;
        }
    }

    public void deleteAppointment(String id) {
        logger.info("Deleting appointment: {}", id);
        try {
            appointmentRepository.deleteById(id);
            logger.info("Appointment deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting appointment: {}", id, e);
            throw e;
        }
    }

    public Appointment cancelAppointment(String id) {
        logger.info("Cancelling appointment: {}", id);
        try {
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
                Appointment cancelledAppointment = appointmentRepository.save(appointment);
                logger.info("Appointment cancelled successfully: {}", id);
                return cancelledAppointment;
            } else {
                logger.warn("Appointment not found for cancellation: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error cancelling appointment: {}", id, e);
            throw e;
        }
    }

    public Appointment completeAppointment(String id) {
        logger.info("Completing appointment: {}", id);
        try {
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
                Appointment completedAppointment = appointmentRepository.save(appointment);
                logger.info("Appointment completed successfully: {}", id);
                return completedAppointment;
            } else {
                logger.warn("Appointment not found for completion: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error completing appointment: {}", id, e);
            throw e;
        }
    }

    public Appointment confirmAppointment(String id) {
        logger.info("Confirming appointment: {}", id);
        try {
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                appointment.setStatus(Appointment.AppointmentStatus.UPCOMING);
                Appointment confirmedAppointment = appointmentRepository.save(appointment);
                logger.info("Appointment confirmed successfully: {}", id);
                return confirmedAppointment;
            } else {
                logger.warn("Appointment not found for confirmation: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error confirming appointment: {}", id, e);
            throw e;
        }
    }

    public Appointment rescheduleAppointment(String id, LocalDate newDate, java.time.LocalTime newTime) {
        logger.info("Rescheduling appointment: {} to date: {} time: {}", id, newDate, newTime);
        try {
            Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                appointment.setAppointmentDate(newDate);
                appointment.setAppointmentTime(newTime);
                Appointment rescheduledAppointment = appointmentRepository.save(appointment);
                logger.info("Appointment rescheduled successfully: {}", id);
                return rescheduledAppointment;
            } else {
                logger.warn("Appointment not found for rescheduling: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error rescheduling appointment: {}", id, e);
            throw e;
        }
    }
}
