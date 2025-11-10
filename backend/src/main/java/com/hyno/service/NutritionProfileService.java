package com.hyno.service;

import com.hyno.entity.NutritionProfile;
import com.hyno.repository.NutritionProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NutritionProfileService {
    private final NutritionProfileRepository nutritionProfileRepository;

    public List<NutritionProfile> getAllProfiles() {
        return nutritionProfileRepository.findAll();
    }

    public Optional<NutritionProfile> getProfileById(Long id) {
        return nutritionProfileRepository.findById(id);
    }

    public Optional<NutritionProfile> getProfileByPatientId(Long patientId) {
        return nutritionProfileRepository.findByPatientId(patientId);
    }

    public NutritionProfile createProfile(NutritionProfile profile) {
        return nutritionProfileRepository.save(profile);
    }

    public NutritionProfile updateProfile(Long id, NutritionProfile profileDetails) {
        return nutritionProfileRepository.findById(id)
                .map(profile -> {
                    profile.setWeightKg(profileDetails.getWeightKg());
                    profile.setHeightCm(profileDetails.getHeightCm());
                    profile.setAge(profileDetails.getAge());
                    profile.setGender(profileDetails.getGender());
                    profile.setActivityLevel(profileDetails.getActivityLevel());
                    profile.setDietaryRestrictions(profileDetails.getDietaryRestrictions());
                    profile.setHealthGoals(profileDetails.getHealthGoals());
                    profile.setCalorieGoal(profileDetails.getCalorieGoal());
                    profile.setProteinGoalG(profileDetails.getProteinGoalG());
                    profile.setCarbGoalG(profileDetails.getCarbGoalG());
                    profile.setFatGoalG(profileDetails.getFatGoalG());
                    return nutritionProfileRepository.save(profile);
                })
                .orElseThrow(() -> new RuntimeException("Nutrition profile not found"));
    }

    public void deleteProfile(Long id) {
        nutritionProfileRepository.deleteById(id);
    }
}
