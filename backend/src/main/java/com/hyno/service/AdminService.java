package com.hyno.service;

import com.hyno.entity.Admin;
import com.hyno.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(String id) {
        return adminRepository.findById(id);
    }

    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public Admin getAdminByEmail(String email) {
        Optional<Admin> admin = adminRepository.findByEmail(email);
        return admin.orElse(null);
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin updateAdmin(String id, Admin adminDetails) {
        Optional<Admin> optionalAdmin = adminRepository.findById(id);
        if (optionalAdmin.isPresent()) {
            Admin admin = optionalAdmin.get();
            admin.setName(adminDetails.getName());
            admin.setEmail(adminDetails.getEmail());
            admin.setPhone(adminDetails.getPhone());
            admin.setRole(adminDetails.getRole());
            return adminRepository.save(admin);
        }
        return null;
    }

    public void deleteAdmin(String id) {
        adminRepository.deleteById(id);
    }
}
