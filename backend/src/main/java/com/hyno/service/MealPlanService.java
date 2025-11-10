package com.hyno.service;

import com.hyno.entity.MealPlan;
import com.hyno.repository.MealPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MealPlanService {
    private final MealPlanRepository mealPlanRepository;

    public List<MealPlan> getAllMealPlans() {
        return mealPlanRepository.findAll();
    }

    public Optional<MealPlan> getMealPlanById(Long id) {
        return mealPlanRepository.findById(id);
    }

    public List<MealPlan> getMealPlansByPatientId(Long patientId) {
        return mealPlanRepository.findByPatientId(patientId);
    }

    public List<MealPlan> getActiveMealPlansByPatientId(Long patientId) {
        return mealPlanRepository.findByPatientIdAndIsActive(patientId, true);
    }

    public MealPlan createMealPlan(MealPlan mealPlan) {
        if (mealPlan.getStartDate() != null && mealPlan.getDurationDays() != null) {
            mealPlan.setEndDate(mealPlan.getStartDate().plusDays(mealPlan.getDurationDays()));
        }
        return mealPlanRepository.save(mealPlan);
    }

    public MealPlan updateMealPlan(Long id, MealPlan mealPlanDetails) {
        return mealPlanRepository.findById(id)
                .map(mealPlan -> {
                    mealPlan.setPlanName(mealPlanDetails.getPlanName());
                    mealPlan.setDescription(mealPlanDetails.getDescription());
                    mealPlan.setDurationDays(mealPlanDetails.getDurationDays());
                    mealPlan.setStartDate(mealPlanDetails.getStartDate());
                    mealPlan.setEndDate(mealPlanDetails.getEndDate());
                    mealPlan.setTotalCalories(mealPlanDetails.getTotalCalories());
                    mealPlan.setTotalProteinG(mealPlanDetails.getTotalProteinG());
                    mealPlan.setTotalCarbsG(mealPlanDetails.getTotalCarbsG());
                    mealPlan.setTotalFatG(mealPlanDetails.getTotalFatG());
                    mealPlan.setIsActive(mealPlanDetails.getIsActive());
                    mealPlan.setMeals(mealPlanDetails.getMeals());
                    return mealPlanRepository.save(mealPlan);
                })
                .orElseThrow(() -> new RuntimeException("Meal plan not found"));
    }

    public void deleteMealPlan(Long id) {
        mealPlanRepository.deleteById(id);
    }

    public MealPlan activateMealPlan(Long id) {
        return mealPlanRepository.findById(id)
                .map(mealPlan -> {
                    mealPlan.setIsActive(true);
                    return mealPlanRepository.save(mealPlan);
                })
                .orElseThrow(() -> new RuntimeException("Meal plan not found"));
    }

    public MealPlan deactivateMealPlan(Long id) {
        return mealPlanRepository.findById(id)
                .map(mealPlan -> {
                    mealPlan.setIsActive(false);
                    return mealPlanRepository.save(mealPlan);
                })
                .orElseThrow(() -> new RuntimeException("Meal plan not found"));
    }
}
