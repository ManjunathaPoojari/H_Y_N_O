package com.hyno.service;

import com.hyno.entity.Patient;
import com.hyno.entity.YogaAudience;
import com.hyno.entity.YogaPose;
import com.hyno.repository.YogaPoseRepository;
import com.hyno.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class YogaPoseService {

    private final YogaPoseRepository yogaPoseRepository;
    private final PatientRepository patientRepository;

    public List<YogaPose> getSafePosesForPatient(String patientId) {
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        YogaAudience audience = determineAudience(patient);
        List<String> patientDiseases = patient.getDiseases();

        return yogaPoseRepository.findAll().stream()
                .filter(pose -> pose.getAllowedAudience().contains(audience))
                .filter(pose -> isSafeForConditions(pose, patientDiseases))
                .filter(pose -> isSafeForGeneralProfile(pose, audience, patient))
                .collect(Collectors.toList());
    }

    private YogaAudience determineAudience(Patient patient) {
        int age = patient.getAge() != null ? patient.getAge() : 30;
        String gender = patient.getGender() != null ? patient.getGender().toUpperCase() : "OTHER";

        if (age < 15) return YogaAudience.CHILD;
        if (age >= 60) return YogaAudience.SENIOR;
        if ("MALE".equals(gender)) return YogaAudience.MEN;
        if ("FEMALE".equals(gender)) return YogaAudience.WOMEN;
        
        return YogaAudience.MEN; // Default
    }

    private boolean isSafeForConditions(YogaPose pose, List<String> diseases) {
        if (diseases == null || diseases.isEmpty()) return true;
        
        for (String disease : diseases) {
            String normalized = disease.toUpperCase().replace(" ", "_");
            if (pose.getContraindicatedDiseases().contains(normalized)) {
                return false;
            }
            
            // Special Mapping based on user spec
            if (normalized.contains("HEART") || normalized.contains("HIGH_BP")) {
                 if (pose.getContraindicatedDiseases().contains("HEART")) return false;
            }
            if (normalized.contains("BACK") || normalized.contains("SLIP_DISC")) {
                 if (pose.getContraindicatedDiseases().contains("BACK_PAIN")) return false;
            }
        }
        return true;
    }
    
    private boolean isSafeForGeneralProfile(YogaPose pose, YogaAudience audience, Patient patient) {
        if (audience == YogaAudience.SENIOR && !pose.isSeniorSafe()) return false;
        // Women specific pregnancy check if mentioned in health profile or diseases
        if (audience == YogaAudience.WOMEN) {
            boolean isPregnant = patient.getDiseases().stream()
                    .anyMatch(d -> d.toUpperCase().contains("PREGNANCY"));
            if (isPregnant && !pose.isPregnancySafe()) return false;
        }
        return true;
    }

    public List<YogaPose> getAllPoses() {
        return yogaPoseRepository.findAll();
    }

    public YogaPose savePose(YogaPose pose) {
        return yogaPoseRepository.save(pose);
    }
}
