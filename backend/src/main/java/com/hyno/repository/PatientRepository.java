package com.hyno.repository;

import com.hyno.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String>, JpaSpecificationExecutor<Patient> {
    Optional<Patient> findByEmail(String email);
    List<Patient> findByHospitalId(String hospitalId);
    Optional<Patient> findTopByOrderByIdDesc();
}
