package com.hyno.service;

import com.hyno.entity.Hospital;
import com.hyno.entity.Patient;
import com.hyno.repository.HospitalRepository;
import com.hyno.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    @Autowired
    private PatientRepository patientRepository;

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    public Optional<Hospital> getHospitalById(String id) {
        return hospitalRepository.findById(id);
    }

    public Hospital getHospitalByEmail(String email) {
        return hospitalRepository.findByEmail(email);
    }

    public Hospital getHospitalByRegistrationNumber(String registrationNumber) {
        return hospitalRepository.findByRegistrationNumber(registrationNumber);
    }

    public List<Hospital> getHospitalsByStatus(String status) {
        return hospitalRepository.findByStatus(status);
    }

    public List<Hospital> getHospitalsByCity(String city) {
        return hospitalRepository.findByCity(city);
    }

    public Hospital createHospital(Hospital hospital) {
        return hospitalRepository.save(hospital);
    }

    public Hospital updateHospital(String id, Hospital hospitalDetails) {
        Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
        if (optionalHospital.isPresent()) {
            Hospital hospital = optionalHospital.get();
            hospital.setName(hospitalDetails.getName());
            hospital.setEmail(hospitalDetails.getEmail());
            hospital.setPhone(hospitalDetails.getPhone());
            hospital.setAddress(hospitalDetails.getAddress());
            hospital.setCity(hospitalDetails.getCity());
            hospital.setState(hospitalDetails.getState());
            hospital.setPincode(hospitalDetails.getPincode());
            hospital.setRegistrationNumber(hospitalDetails.getRegistrationNumber());
            hospital.setTotalDoctors(hospitalDetails.getTotalDoctors());
            hospital.setStatus(hospitalDetails.getStatus());
            return hospitalRepository.save(hospital);
        }
        return null;
    }

    public void deleteHospital(String id) {
        hospitalRepository.deleteById(id);
    }

    public Hospital approveHospital(String id) {
        Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
        if (optionalHospital.isPresent()) {
            Hospital hospital = optionalHospital.get();
            hospital.setStatus("approved");
            return hospitalRepository.save(hospital);
        }
        return null;
    }

    public Hospital rejectHospital(String id) {
        Optional<Hospital> optionalHospital = hospitalRepository.findById(id);
        if (optionalHospital.isPresent()) {
            Hospital hospital = optionalHospital.get();
            hospital.setStatus("rejected");
            return hospitalRepository.save(hospital);
        }
        return null;
    }

    public List<Patient> getHospitalPatients(String hospitalId) {
        return patientRepository.findByHospitalId(hospitalId);
    }

    // Report generation methods
    public Map<String, Object> generateAppointmentReport(String hospitalId, String startDate, String endDate) {
        Map<String, Object> report = new HashMap<>();
        try {
            List<Patient> patients = getHospitalPatients(hospitalId);
            int totalPatients = patients.size();
            int activePatients = patients.size(); // Simplified - in real implementation, check recent appointments

            report.put("hospitalId", hospitalId);
            report.put("totalPatients", totalPatients);
            report.put("activePatients", activePatients);
            report.put("reportPeriod", startDate + " to " + endDate);
            report.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        } catch (Exception e) {
            report.put("error", "Failed to generate appointment report: " + e.getMessage());
        }
        return report;
    }

    public Map<String, Object> generatePatientReport(String hospitalId) {
        Map<String, Object> report = new HashMap<>();
        try {
            List<Patient> patients = getHospitalPatients(hospitalId);
            int totalPatients = patients.size();

            // Age distribution
            Map<String, Integer> ageGroups = new HashMap<>();
            ageGroups.put("0-18", 0);
            ageGroups.put("19-35", 0);
            ageGroups.put("36-50", 0);
            ageGroups.put("51-65", 0);
            ageGroups.put("65+", 0);

            for (Patient patient : patients) {
                int age = patient.getAge() != null ? patient.getAge() : 0;
                if (age <= 18) ageGroups.put("0-18", ageGroups.get("0-18") + 1);
                else if (age <= 35) ageGroups.put("19-35", ageGroups.get("19-35") + 1);
                else if (age <= 50) ageGroups.put("36-50", ageGroups.get("36-50") + 1);
                else if (age <= 65) ageGroups.put("51-65", ageGroups.get("51-65") + 1);
                else ageGroups.put("65+", ageGroups.get("65+") + 1);
            }

            report.put("hospitalId", hospitalId);
            report.put("totalPatients", totalPatients);
            report.put("ageDistribution", ageGroups);
            report.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        } catch (Exception e) {
            report.put("error", "Failed to generate patient report: " + e.getMessage());
        }
        return report;
    }

    public Map<String, Object> generateDoctorPerformanceReport(String hospitalId, String startDate, String endDate) {
        Map<String, Object> report = new HashMap<>();
        try {
            List<Patient> patients = getHospitalPatients(hospitalId);
            int totalPatients = patients.size();

            report.put("hospitalId", hospitalId);
            report.put("totalPatients", totalPatients);
            report.put("reportPeriod", startDate + " to " + endDate);
            report.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            // In a real implementation, this would include doctor-specific metrics
            report.put("doctorMetrics", "Doctor performance metrics would be calculated here");
        } catch (Exception e) {
            report.put("error", "Failed to generate doctor performance report: " + e.getMessage());
        }
        return report;
    }

    public Map<String, Object> generateHospitalOverviewReport(String hospitalId, String startDate, String endDate) {
        Map<String, Object> report = new HashMap<>();
        try {
            List<Patient> patients = getHospitalPatients(hospitalId);
            int totalPatients = patients.size();

            Map<String, Object> summary = new HashMap<>();
            summary.put("totalPatients", totalPatients);
            summary.put("activePatients", totalPatients); // Simplified
            summary.put("totalAppointments", totalPatients * 2); // Simplified estimate
            summary.put("completedAppointments", totalPatients); // Simplified

            report.put("hospitalId", hospitalId);
            report.put("reportPeriod", startDate + " to " + endDate);
            report.put("summary", summary);
            report.put("generatedAt", LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
        } catch (Exception e) {
            report.put("error", "Failed to generate hospital overview report: " + e.getMessage());
        }
        return report;
    }
}
