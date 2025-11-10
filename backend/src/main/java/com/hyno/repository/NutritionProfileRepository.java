package com.hyno.repository;

import com.hyno.entity.NutritionProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NutritionProfileRepository extends JpaRepository<NutritionProfile, Long> {
    Optional<NutritionProfile> findByPatientId(Long patientId);
}
