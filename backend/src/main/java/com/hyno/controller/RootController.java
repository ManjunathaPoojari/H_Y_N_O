package com.hyno.controller;

import com.hyno.entity.Admin;
import com.hyno.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class RootController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/admins")
    public ResponseEntity<List<Admin>> getAdmins() {
        List<Admin> admins = adminService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }
}
