package com.hyno.repository;

import com.hyno.entity.NutritionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NutritionPlanRepository extends JpaRepository<NutritionPlan, String> {
    Optional<NutritionPlan> findByPatientId(String patientId);
}
