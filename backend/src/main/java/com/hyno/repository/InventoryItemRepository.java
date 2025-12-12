package com.hyno.repository;

import com.hyno.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InventoryItemRepository extends JpaRepository<InventoryItem, String> {
    List<InventoryItem> findByHospitalId(String hospitalId);
}
