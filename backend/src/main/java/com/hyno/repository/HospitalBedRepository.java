package com.hyno.repository;

import com.hyno.entity.HospitalBed;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HospitalBedRepository extends JpaRepository<HospitalBed, String> {
    List<HospitalBed> findByHospitalId(String hospitalId);
}
