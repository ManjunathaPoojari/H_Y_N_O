package com.hyno.repository;

import com.hyno.entity.MedicalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalEventRepository extends JpaRepository<MedicalEvent, String> {
    List<MedicalEvent> findByHospitalId(String hospitalId);
    List<MedicalEvent> findByType(MedicalEvent.EventType type);
}
