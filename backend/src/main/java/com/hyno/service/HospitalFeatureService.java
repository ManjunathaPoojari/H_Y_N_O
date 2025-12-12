package com.hyno.service;

import com.hyno.entity.HospitalBed;
import com.hyno.entity.InventoryItem;
import com.hyno.entity.HospitalBill;
import com.hyno.repository.HospitalBedRepository;
import com.hyno.repository.InventoryItemRepository;
import com.hyno.repository.HospitalBillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.NonNull;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HospitalFeatureService {

    @Autowired
    private HospitalBedRepository bedRepository;

    @Autowired
    private InventoryItemRepository inventoryRepository;

    @Autowired
    private HospitalBillRepository billRepository;

    // Bed Management
    public List<HospitalBed> getBeds(@NonNull String hospitalId) {
        return bedRepository.findByHospitalId(hospitalId);
    }

    public HospitalBed updateBed(@NonNull HospitalBed bed) {
        return bedRepository.save(bed);
    }

    public void deleteBed(@NonNull String id) {
        bedRepository.deleteById(id);
    }

    // Inventory Management
    public List<InventoryItem> getInventory(@NonNull String hospitalId) {
        return inventoryRepository.findByHospitalId(hospitalId);
    }

    public InventoryItem saveInventoryItem(@NonNull InventoryItem item) {
        return inventoryRepository.save(item);
    }

    public void deleteInventoryItem(@NonNull String id) {
        inventoryRepository.deleteById(id);
    }

    // Billing Management
    public List<HospitalBill> getBills(@NonNull String hospitalId) {
        return billRepository.findByHospitalId(hospitalId);
    }

    public HospitalBill createBill(@NonNull HospitalBill bill) {
        return billRepository.save(bill);
    }

    public Optional<HospitalBill> getBill(String id) {
        return billRepository.findById(id);
    }
}
