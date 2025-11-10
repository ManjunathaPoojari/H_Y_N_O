package com.hyno.service;

import com.hyno.entity.PremiumPlan;
import com.hyno.repository.PremiumPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PremiumPlanService {
    private final PremiumPlanRepository premiumPlanRepository;

    public List<PremiumPlan> getAllPremiumPlans() {
        return premiumPlanRepository.findAll();
    }

    public List<PremiumPlan> getActivePremiumPlans() {
        return premiumPlanRepository.findByIsActive(true);
    }

    public Optional<PremiumPlan> getPremiumPlanById(Long id) {
        return premiumPlanRepository.findById(id);
    }

    public PremiumPlan createPremiumPlan(PremiumPlan premiumPlan) {
        return premiumPlanRepository.save(premiumPlan);
    }

    public PremiumPlan updatePremiumPlan(Long id, PremiumPlan planDetails) {
        return premiumPlanRepository.findById(id)
                .map(plan -> {
                    plan.setPlanName(planDetails.getPlanName());
                    plan.setDescription(planDetails.getDescription());
                    plan.setPriceMonthly(planDetails.getPriceMonthly());
                    plan.setPriceYearly(planDetails.getPriceYearly());
                    plan.setCurrency(planDetails.getCurrency());
                    plan.setFeatures(planDetails.getFeatures());
                    plan.setMaxProfiles(planDetails.getMaxProfiles());
                    plan.setMaxMealPlans(planDetails.getMaxMealPlans());
                    plan.setHasPersonalCoach(planDetails.getHasPersonalCoach());
                    plan.setHasAdvancedAnalytics(planDetails.getHasAdvancedAnalytics());
                    plan.setHasCustomRecipes(planDetails.getHasCustomRecipes());
                    plan.setIsActive(planDetails.getIsActive());
                    return premiumPlanRepository.save(plan);
                })
                .orElseThrow(() -> new RuntimeException("Premium plan not found"));
    }

    public void deletePremiumPlan(Long id) {
        premiumPlanRepository.deleteById(id);
    }

    public PremiumPlan activatePremiumPlan(Long id) {
        return premiumPlanRepository.findById(id)
                .map(plan -> {
                    plan.setIsActive(true);
                    return premiumPlanRepository.save(plan);
                })
                .orElseThrow(() -> new RuntimeException("Premium plan not found"));
    }

    public PremiumPlan deactivatePremiumPlan(Long id) {
        return premiumPlanRepository.findById(id)
                .map(plan -> {
                    plan.setIsActive(false);
                    return premiumPlanRepository.save(plan);
                })
                .orElseThrow(() -> new RuntimeException("Premium plan not found"));
    }
}
