package com.hyno.service;

import com.hyno.entity.Admin;
import com.hyno.repository.AdminRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> getAllAdmins() {
        logger.info("Fetching all admins");
        try {
            List<Admin> admins = adminRepository.findAll();
            logger.info("Retrieved {} admins", admins.size());
            return admins;
        } catch (Exception e) {
            logger.error("Error fetching all admins", e);
            throw e;
        }
    }

    public Optional<Admin> getAdminById(String id) {
        logger.info("Fetching admin by ID: {}", id);
        try {
            Optional<Admin> admin = adminRepository.findById(id);
            if (admin.isPresent()) {
                logger.info("Admin found: {}", id);
            } else {
                logger.warn("Admin not found: {}", id);
            }
            return admin;
        } catch (Exception e) {
            logger.error("Error fetching admin by ID: {}", id, e);
            throw e;
        }
    }

    public Optional<Admin> findByEmail(String email) {
        logger.info("Finding admin by email: {}", email);
        try {
            Optional<Admin> admin = adminRepository.findByEmail(email);
            if (admin.isPresent()) {
                logger.info("Admin found by email: {}", email);
            } else {
                logger.warn("Admin not found by email: {}", email);
            }
            return admin;
        } catch (Exception e) {
            logger.error("Error finding admin by email: {}", email, e);
            throw e;
        }
    }

    public Admin getAdminByEmail(String email) {
        logger.info("Getting admin by email: {}", email);
        try {
            Optional<Admin> admin = adminRepository.findByEmail(email);
            if (admin.isPresent()) {
                logger.info("Admin retrieved by email: {}", email);
                return admin.get();
            } else {
                logger.warn("Admin not found by email: {}", email);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error getting admin by email: {}", email, e);
            throw e;
        }
    }

    public Admin createAdmin(Admin admin) {
        logger.info("Creating new admin: {}", admin.getEmail());
        try {
            Admin savedAdmin = adminRepository.save(admin);
            logger.info("Admin created successfully with ID: {}", savedAdmin.getId());
            return savedAdmin;
        } catch (Exception e) {
            logger.error("Error creating admin: {}", admin.getEmail(), e);
            throw e;
        }
    }

    public Admin save(Admin admin) {
        logger.info("Saving admin: {}", admin.getEmail());
        try {
            Admin savedAdmin = adminRepository.save(admin);
            logger.info("Admin saved successfully with ID: {}", savedAdmin.getId());
            return savedAdmin;
        } catch (Exception e) {
            logger.error("Error saving admin: {}", admin.getEmail(), e);
            throw e;
        }
    }

    public Admin updateAdmin(String id, Admin adminDetails) {
        logger.info("Updating admin: {}", id);
        try {
            Optional<Admin> optionalAdmin = adminRepository.findById(id);
            if (optionalAdmin.isPresent()) {
                Admin admin = optionalAdmin.get();
                admin.setName(adminDetails.getName());
                admin.setEmail(adminDetails.getEmail());
                admin.setPhone(adminDetails.getPhone());
                admin.setRole(adminDetails.getRole());
                Admin updatedAdmin = adminRepository.save(admin);
                logger.info("Admin updated successfully: {}", id);
                return updatedAdmin;
            } else {
                logger.warn("Admin not found for update: {}", id);
                return null;
            }
        } catch (Exception e) {
            logger.error("Error updating admin: {}", id, e);
            throw e;
        }
    }

    public void deleteAdmin(String id) {
        logger.info("Deleting admin: {}", id);
        try {
            adminRepository.deleteById(id);
            logger.info("Admin deleted successfully: {}", id);
        } catch (Exception e) {
            logger.error("Error deleting admin: {}", id, e);
            throw e;
        }
    }
}
