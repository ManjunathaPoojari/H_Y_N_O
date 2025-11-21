package com.hyno;

import com.hyno.entity.Admin;
import com.hyno.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Value("${app.bootstrap.admin.id:admin-1}")
    private String defaultAdminId;

    @Value("${app.bootstrap.admin.name:Admin User}")
    private String defaultAdminName;

    @Value("${app.bootstrap.admin.email:admin@example.com}")
    private String defaultAdminEmail;

    @Value("${app.bootstrap.admin.phone:5555555555}")
    private String defaultAdminPhone;

    @Value("${app.bootstrap.admin.password:ChangeMe123!}")
    private String defaultAdminPassword;

    public DataInitializer(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    @Override
    public void run(String... args) {
        try {
            String normalizedEmail = defaultAdminEmail.toLowerCase();
            Optional<Admin> existingAdmin = adminRepository.findByEmail(normalizedEmail);
            
            if (existingAdmin.isPresent()) {
                Admin admin = existingAdmin.get();
                // Ensure super admin is always verified
                if (admin.getRole() == Admin.AdminRole.SUPER_ADMIN && !admin.isVerified()) {
                    admin.setVerified(true);
                    adminRepository.save(admin);
                    System.out.println("Super admin verification status updated");
                }
                // Update password if it's not hashed (legacy support)
                String storedPassword = admin.getPassword();
                if (storedPassword != null && !storedPassword.startsWith("$2a$") && !storedPassword.startsWith("$2b$")) {
                    // Password is not hashed, update it
                    admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
                    adminRepository.save(admin);
                    System.out.println("Admin password has been updated to hashed format");
                }
                System.out.println("Admin account found: " + normalizedEmail);
            } else {
                Admin admin = new Admin();
                admin.setId(defaultAdminId);
                admin.setName(defaultAdminName);
                admin.setEmail(normalizedEmail);
                admin.setPhone(defaultAdminPhone);
                admin.setRole(Admin.AdminRole.SUPER_ADMIN);
                admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
                admin.setVerified(true); // Super admin does not require verification
                adminRepository.save(admin);
                System.out.println("Default admin account created: " + normalizedEmail + " / " + defaultAdminPassword);
            }
        } catch (Exception e) {
            System.err.println("Error initializing admin account: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
