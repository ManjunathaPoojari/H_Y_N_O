package com.hyno;

import com.hyno.entity.Admin;
import com.hyno.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.Optional;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final com.hyno.repository.YogaPoseRepository yogaPoseRepository;
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

    public DataInitializer(AdminRepository adminRepository, com.hyno.repository.YogaPoseRepository yogaPoseRepository) {
        this.adminRepository = adminRepository;
        this.yogaPoseRepository = yogaPoseRepository;
    }

    @Override
    public void run(String... args) {
        initializeAdmin();
        initializeYogaPoses();
    }

    private void initializeAdmin() {
        try {
            String normalizedEmail = defaultAdminEmail.toLowerCase();
            Optional<Admin> existingAdmin = adminRepository.findByEmail(normalizedEmail);
            
            if (existingAdmin.isPresent()) {
                Admin admin = existingAdmin.get();
                if (admin.getRole() == Admin.AdminRole.SUPER_ADMIN && !admin.isVerified()) {
                    admin.setVerified(true);
                    adminRepository.save(admin);
                }
                String storedPassword = admin.getPassword();
                if (storedPassword != null && !storedPassword.startsWith("$2a$") && !storedPassword.startsWith("$2b$")) {
                    admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
                    adminRepository.save(admin);
                }
            } else {
                Admin admin = new Admin();
                admin.setId(defaultAdminId);
                admin.setName(defaultAdminName);
                admin.setEmail(normalizedEmail);
                admin.setPhone(defaultAdminPhone);
                admin.setRole(Admin.AdminRole.SUPER_ADMIN);
                admin.setPassword(passwordEncoder.encode(defaultAdminPassword));
                admin.setVerified(true);
                adminRepository.save(admin);
            }
        } catch (Exception e) {
            System.err.println("Error initializing admin account: " + e.getMessage());
        }
    }

    private void initializeYogaPoses() {
        if (yogaPoseRepository.count() > 0) return;

        try {
            // 👶 CHILD POSES
            savePose("Tadasana (Mountain Pose)", "Foundation for all standing poses. Improves posture and focus.", "🧘", 
                List.of(com.hyno.entity.YogaAudience.CHILD, com.hyno.entity.YogaAudience.MEN, com.hyno.entity.YogaAudience.WOMEN, com.hyno.entity.YogaAudience.SENIOR), 
                List.of(), "LOW", true, true);

            savePose("Vrikshasana (Tree Pose)", "Improves balance and concentration.", "🌴", 
                List.of(com.hyno.entity.YogaAudience.CHILD, com.hyno.entity.YogaAudience.MEN, com.hyno.entity.YogaAudience.WOMEN, com.hyno.entity.YogaAudience.SENIOR), 
                List.of("KNEE_PAIN"), "LOW", true, true);

            savePose("Balasana (Child's Pose)", "Gentle resting pose. Calms the mind and stretches the back.", "👶", 
                List.of(com.hyno.entity.YogaAudience.CHILD, com.hyno.entity.YogaAudience.MEN, com.hyno.entity.YogaAudience.WOMEN, com.hyno.entity.YogaAudience.SENIOR), 
                List.of(), "LOW", true, true);

            // 🧑 MEN POSES
            savePose("Surya Namaskar (Sun Salutation)", "Complete body workout. Builds strength and flexibility.", "☀️", 
                List.of(com.hyno.entity.YogaAudience.MEN, com.hyno.entity.YogaAudience.WOMEN), 
                List.of("HEART", "BACK_PAIN"), "MEDIUM", false, false);

            savePose("Virabhadrasana (Warrior Pose)", "Builds stamina and core strength.", "⚔️", 
                List.of(com.hyno.entity.YogaAudience.MEN, com.hyno.entity.YogaAudience.WOMEN), 
                List.of("HEART", "KNEE_PAIN"), "MEDIUM", false, false);

            // 👩 WOMEN POSES
            savePose("Baddha Konasana (Butterfly Pose)", "Great for hip opening and hormonal balance.", "🦋", 
                List.of(com.hyno.entity.YogaAudience.WOMEN, com.hyno.entity.YogaAudience.CHILD), 
                List.of("KNEE_PAIN"), "LOW", true, false);

            savePose("Marjaryasana (Cat-Cow Pose)", "Improves spinal health and flexibility.", "🐱", 
                List.of(com.hyno.entity.YogaAudience.WOMEN, com.hyno.entity.YogaAudience.SENIOR, com.hyno.entity.YogaAudience.MEN), 
                List.of(), "LOW", true, true);

            // 👴 SENIOR POSES
            savePose("Chair Tadasana", "Seated mountain pose for stability and posture.", "🪑", 
                List.of(com.hyno.entity.YogaAudience.SENIOR), 
                List.of(), "LOW", true, true);

            savePose("Ankle Rotations", "Simple joint mobility exercise for seniors.", "🦶", 
                List.of(com.hyno.entity.YogaAudience.SENIOR, com.hyno.entity.YogaAudience.CHILD), 
                List.of(), "LOW", true, true);

            // AVOIDED POSES FOR SAFETY (Headstands etc)
            savePose("Shirshasana (Headstand)", "Advanced inversion. Do not attempt if you have heart conditions or neck pain.", "🤸", 
                List.of(com.hyno.entity.YogaAudience.MEN, com.hyno.entity.YogaAudience.WOMEN), 
                List.of("HEART", "ASTHMA", "BACK_PAIN", "CHILD", "SENIOR"), "HIGH", false, false);

            System.out.println("Yoga poses seeded successfully!");
        } catch (Exception e) {
            System.err.println("Error seeding yoga poses: " + e.getMessage());
        }
    }

    private void savePose(String name, String desc, String thumb, List<com.hyno.entity.YogaAudience> audience, List<String> contra, String risk, boolean preg, boolean senior) {
        com.hyno.entity.YogaPose pose = new com.hyno.entity.YogaPose();
        pose.setName(name);
        pose.setDescription(desc);
        pose.setThumbnail(thumb);
        pose.setAllowedAudience(audience);
        pose.setContraindicatedDiseases(contra);
        pose.setRiskLevel(risk);
        pose.setPregnancySafe(preg);
        pose.setSeniorSafe(senior);
        yogaPoseRepository.save(pose);
    }
}
