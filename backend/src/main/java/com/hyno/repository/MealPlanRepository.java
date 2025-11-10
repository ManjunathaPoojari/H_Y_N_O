package com.hyno.repository;

import com.hyno.entity.MealPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MealPlanRepository extends JpaRepository<MealPlan, Long> {
    List<MealPlan> findByPatientId(Long patientId);

    List<MealPlan> findByPatientIdAndIsActive(Long patientId, Boolean isActive);
}
