package com.hyno.repository;

import com.hyno.entity.HospitalDoctor;
import com.hyno.entity.HospitalDoctorId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HospitalDoctorRepository extends JpaRepository<HospitalDoctor, HospitalDoctorId> {

    List<HospitalDoctor> findByHospitalId(String hospitalId);

    List<HospitalDoctor> findByDoctorId(String doctorId);

    List<HospitalDoctor> findByHospitalIdAndStatus(String hospitalId, String status);

    @Query("SELECT hd FROM HospitalDoctor hd WHERE hd.hospital.id = :hospitalId AND hd.status = 'pending'")
    List<HospitalDoctor> findPendingDoctorsByHospitalId(@Param("hospitalId") String hospitalId);

    @Query("SELECT COUNT(hd) FROM HospitalDoctor hd WHERE hd.hospital.id = :hospitalId AND hd.status = 'approved'")
    Long countApprovedDoctorsByHospitalId(@Param("hospitalId") String hospitalId);

    @Query("SELECT COUNT(hd) FROM HospitalDoctor hd WHERE hd.hospital.id = :hospitalId AND hd.status = 'pending'")
    Long countPendingDoctorsByHospitalId(@Param("hospitalId") String hospitalId);
}
