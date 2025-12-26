package com.hyno.service;

import com.hyno.entity.NutritionPlan;
import com.hyno.repository.NutritionPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NutritionPlanService {

    private final NutritionPlanRepository nutritionPlanRepository;

    public java.util.List<NutritionPlan> getAllPlans() {
        return nutritionPlanRepository.findAll();
    }

    public Optional<NutritionPlan> getPlanByPatientId(String patientId) {
        return nutritionPlanRepository.findByPatientId(patientId);
    }

    public NutritionPlan savePlan(NutritionPlan plan) {
        return nutritionPlanRepository.save(plan);
    }

    @Transactional
    public void deletePlan(String id) {
        nutritionPlanRepository.deleteById(id);
    }
}
