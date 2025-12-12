package com.hyno.controller;

import com.hyno.entity.HospitalBed;
import com.hyno.entity.InventoryItem;
import com.hyno.entity.HospitalBill;
import com.hyno.service.HospitalFeatureService;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospital")
@CrossOrigin(origins = "*")
public class HospitalFeatureController {

    @Autowired
    private HospitalFeatureService featureService;

    // Bed Endpoints
    @GetMapping("/beds")
    public ResponseEntity<List<HospitalBed>> getBeds(@NonNull @RequestParam String hospitalId) {
        return ResponseEntity.ok(featureService.getBeds(hospitalId));
    }

    @PostMapping("/beds")
    public ResponseEntity<HospitalBed> saveBed(@NonNull @RequestBody HospitalBed bed) {
        return ResponseEntity.ok(featureService.updateBed(bed));
    }

    @DeleteMapping("/beds/{id}")
    public ResponseEntity<Void> deleteBed(@NonNull @PathVariable String id) {
        featureService.deleteBed(id);
        return ResponseEntity.ok().build();
    }

    // Inventory Endpoints
    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryItem>> getInventory(@NonNull @RequestParam String hospitalId) {
        return ResponseEntity.ok(featureService.getInventory(hospitalId));
    }

    @PostMapping("/inventory")
    public ResponseEntity<InventoryItem> saveInventoryItem(@NonNull @RequestBody InventoryItem item) {
        return ResponseEntity.ok(featureService.saveInventoryItem(item));
    }

    @DeleteMapping("/inventory/{id}")
    public ResponseEntity<Void> deleteInventoryItem(@NonNull @PathVariable String id) {
        featureService.deleteInventoryItem(id);
        return ResponseEntity.ok().build();
    }

    // Billing Endpoints
    @GetMapping("/bills")
    public ResponseEntity<List<HospitalBill>> getBills(@NonNull @RequestParam String hospitalId) {
        return ResponseEntity.ok(featureService.getBills(hospitalId));
    }

    @PostMapping("/bills")
    public ResponseEntity<HospitalBill> createBill(@NonNull @RequestBody HospitalBill bill) {
        return ResponseEntity.ok(featureService.createBill(bill));
    }
}
