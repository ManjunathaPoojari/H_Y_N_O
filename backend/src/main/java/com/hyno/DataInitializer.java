package com.hyno;

import com.hyno.entity.Admin;
import com.hyno.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

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
        adminRepository.findByEmail(defaultAdminEmail.toLowerCase())
            .orElseGet(() -> {
                Admin admin = new Admin();
                admin.setId(defaultAdminId);
                admin.setName(defaultAdminName);
                admin.setEmail(defaultAdminEmail.toLowerCase());
                admin.setPhone(defaultAdminPhone);
                admin.setRole(Admin.AdminRole.SUPER_ADMIN);
                admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
                return adminRepository.save(admin);
            });
    }
}
