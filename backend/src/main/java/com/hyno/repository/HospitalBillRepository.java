package com.hyno.repository;

import com.hyno.entity.HospitalBill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HospitalBillRepository extends JpaRepository<HospitalBill, String> {
    List<HospitalBill> findByHospitalId(String hospitalId);

    List<HospitalBill> findByHospitalIdAndStatus(String hospitalId, String status);
}
