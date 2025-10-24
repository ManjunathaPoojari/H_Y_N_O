package com.hyno.service;

import com.hyno.entity.Appointment;
import com.hyno.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(String id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatient(String patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByHospital(String hospitalId) {
        return appointmentRepository.findByHospitalId(hospitalId);
    }

    public List<Appointment> getAppointmentsByStatus(Appointment.AppointmentStatus status) {
        return appointmentRepository.findByStatus(status);
    }

    public List<Appointment> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date);
    }

    public List<Appointment> getUpcomingAppointmentsByPatient(String patientId) {
        return appointmentRepository.findUpcomingByPatientId(patientId, LocalDate.now());
    }

    public List<Appointment> getUpcomingAppointmentsByDoctor(String doctorId) {
        return appointmentRepository.findUpcomingByDoctorId(doctorId, LocalDate.now());
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(String id, Appointment appointmentDetails) {
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
            return appointmentRepository.save(appointment);
        }
        return null;
    }

    public void deleteAppointment(String id) {
        appointmentRepository.deleteById(id);
    }

    public Appointment cancelAppointment(String id) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
            return appointmentRepository.save(appointment);
        }
        return null;
    }

    public Appointment completeAppointment(String id) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStatus(Appointment.AppointmentStatus.COMPLETED);
            return appointmentRepository.save(appointment);
        }
        return null;
    }

    public Appointment confirmAppointment(String id) {
        Optional<Appointment> optionalAppointment = appointmentRepository.findById(id);
        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();
            appointment.setStatus(Appointment.AppointmentStatus.UPCOMING);
            return appointmentRepository.save(appointment);
        }
        return null;
    }
}
