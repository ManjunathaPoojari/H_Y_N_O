package com.hyno.service;

import com.hyno.entity.HospitalDoctor;
import com.hyno.entity.HospitalDoctorId;
import com.hyno.repository.HospitalDoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HospitalDoctorService {

    private final HospitalDoctorRepository hospitalDoctorRepository;

    public List<HospitalDoctor> getDoctorsByHospitalId(String hospitalId) {
        return hospitalDoctorRepository.findByHospitalId(hospitalId);
    }

    public List<HospitalDoctor> getHospitalsByDoctorId(String doctorId) {
        return hospitalDoctorRepository.findByDoctorId(doctorId);
    }

    public List<HospitalDoctor> getPendingDoctorsByHospitalId(String hospitalId) {
        return hospitalDoctorRepository.findPendingDoctorsByHospitalId(hospitalId);
    }

    public Long countApprovedDoctorsByHospitalId(String hospitalId) {
        return hospitalDoctorRepository.countApprovedDoctorsByHospitalId(hospitalId);
    }

    public Long countPendingDoctorsByHospitalId(String hospitalId) {
        return hospitalDoctorRepository.countPendingDoctorsByHospitalId(hospitalId);
    }

    @Transactional
    public HospitalDoctor save(HospitalDoctor hospitalDoctor) {
        return hospitalDoctorRepository.save(hospitalDoctor);
    }

    @Transactional
    public void approveDoctor(String hospitalId, String doctorId, String approvedBy) {
        HospitalDoctorId id = new HospitalDoctorId(hospitalId, doctorId);
        HospitalDoctor hospitalDoctor = hospitalDoctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital-Doctor association not found"));

        hospitalDoctor.setStatus("approved");
        hospitalDoctor.setApprovedBy(approvedBy);
        hospitalDoctor.setApprovedAt(java.time.LocalDateTime.now());

        hospitalDoctorRepository.save(hospitalDoctor);
    }

    @Transactional
    public void rejectDoctor(String hospitalId, String doctorId) {
        HospitalDoctorId id = new HospitalDoctorId(hospitalId, doctorId);
        HospitalDoctor hospitalDoctor = hospitalDoctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hospital-Doctor association not found"));

        hospitalDoctor.setStatus("rejected");
        hospitalDoctorRepository.save(hospitalDoctor);
    }
}
