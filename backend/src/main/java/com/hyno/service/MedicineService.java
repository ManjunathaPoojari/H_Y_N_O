package com.hyno.service;

import com.hyno.entity.Medicine;
import com.hyno.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicineService {

    @Autowired
    private MedicineRepository medicineRepository;

    public List<Medicine> getAllMedicines() {
        return medicineRepository.findAll();
    }

    public Optional<Medicine> getMedicineById(String id) {
        return medicineRepository.findById(id);
    }

    public List<Medicine> getMedicinesByStatus(String status) {
        return medicineRepository.findByStatus(status);
    }

    public List<Medicine> getMedicinesByCategory(String category) {
        return medicineRepository.findByCategory(category);
    }

    public List<Medicine> searchMedicines(String query) {
        return medicineRepository.searchByNameOrGenericName(query);
    }

    public List<Medicine> getAvailableMedicines() {
        return medicineRepository.findAvailableMedicines();
    }

    public Medicine createMedicine(Medicine medicine) {
        return medicineRepository.save(medicine);
    }

    public Medicine updateMedicine(String id, Medicine medicineDetails) {
        Optional<Medicine> optionalMedicine = medicineRepository.findById(id);
        if (optionalMedicine.isPresent()) {
            Medicine medicine = optionalMedicine.get();
            medicine.setName(medicineDetails.getName());
            medicine.setGenericName(medicineDetails.getGenericName());
            medicine.setDescription(medicineDetails.getDescription());
            medicine.setManufacturer(medicineDetails.getManufacturer());
            medicine.setDosageForm(medicineDetails.getDosageForm());
            medicine.setStrength(medicineDetails.getStrength());
            medicine.setIndications(medicineDetails.getIndications());
            medicine.setContraindications(medicineDetails.getContraindications());
            medicine.setSideEffects(medicineDetails.getSideEffects());
            medicine.setPrecautions(medicineDetails.getPrecautions());
            medicine.setInteractions(medicineDetails.getInteractions());
            medicine.setCategory(medicineDetails.getCategory());
            medicine.setPrice(medicineDetails.getPrice());
            medicine.setStockQuantity(medicineDetails.getStockQuantity());
            medicine.setPrescriptionRequired(medicineDetails.getPrescriptionRequired());
            medicine.setStatus(medicineDetails.getStatus());
            medicine.setImageUrl(medicineDetails.getImageUrl());
            return medicineRepository.save(medicine);
        }
        return null;
    }

    public boolean deleteMedicine(String id) {
        if (medicineRepository.existsById(id)) {
            medicineRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Medicine updateStock(String id, Integer newStock) {
        Optional<Medicine> optionalMedicine = medicineRepository.findById(id);
        if (optionalMedicine.isPresent()) {
            Medicine medicine = optionalMedicine.get();
            medicine.setStockQuantity(newStock);
            return medicineRepository.save(medicine);
        }
        return null;
    }
}
