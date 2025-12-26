package com.hyno.service;

import com.hyno.entity.Symptom;
import com.hyno.repository.SymptomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SymptomService {
    private final SymptomRepository symptomRepository;

    public List<Symptom> getAllSymptoms() {
        return symptomRepository.findAll();
    }
}
