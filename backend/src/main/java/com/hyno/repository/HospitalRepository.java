package com.hyno.repository;

import com.hyno.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, String> {
    List<Hospital> findByStatus(String status);
    List<Hospital> findByCity(String city);
    Hospital findByEmail(String email);
    Hospital findByRegistrationNumber(String registrationNumber);
}
