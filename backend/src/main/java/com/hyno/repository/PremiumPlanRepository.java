package com.hyno.repository;

import com.hyno.entity.PremiumPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PremiumPlanRepository extends JpaRepository<PremiumPlan, Long> {
    List<PremiumPlan> findByIsActive(Boolean isActive);
}
