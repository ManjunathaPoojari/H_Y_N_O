package com.hyno.repository;

import com.hyno.entity.YogaPose;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YogaPoseRepository extends JpaRepository<YogaPose, String> {
}
