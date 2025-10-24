-- ============================================
-- HYNO Health Management System Database Schema
-- MySQL Database
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS hyno_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE hyno_db;

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

-- Users Table (for authentication)
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('patient', 'doctor', 'hospital', 'admin') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================
-- PATIENTS
-- ============================================

CREATE TABLE patients (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    age INT,
    gender ENUM('Male', 'Female', 'Other'),
    blood_group VARCHAR(5),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    emergency_contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB;

-- Patient Allergies
CREATE TABLE patient_allergies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    allergy VARCHAR(100) NOT NULL,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_patient (patient_id)
) ENGINE=InnoDB;

-- Patient Medical History
CREATE TABLE patient_medical_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    condition_name VARCHAR(200) NOT NULL,
    diagnosed_date DATE,
    notes TEXT,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_patient (patient_id)
) ENGINE=InnoDB;

-- ============================================
-- HOSPITALS
-- ============================================

CREATE TABLE hospitals (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    pincode VARCHAR(10),
    registration_number VARCHAR(100) UNIQUE NOT NULL,
    total_doctors INT DEFAULT 0,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_city (city)
) ENGINE=InnoDB;

-- Hospital Facilities
CREATE TABLE hospital_facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id VARCHAR(50) NOT NULL,
    facility_name VARCHAR(100) NOT NULL,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
    INDEX idx_hospital (hospital_id)
) ENGINE=InnoDB;

-- ============================================
-- DOCTORS
-- ============================================

CREATE TABLE doctors (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    hospital_id VARCHAR(50),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100) NOT NULL,
    qualification VARCHAR(200) NOT NULL,
    experience INT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    consultation_fee DECIMAL(10,2) NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'approved', 'suspended') DEFAULT 'pending',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_specialization (specialization),
    INDEX idx_hospital (hospital_id)
) ENGINE=InnoDB;

-- ============================================
-- APPOINTMENTS
-- ============================================

CREATE TABLE appointments (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    doctor_name VARCHAR(100) NOT NULL,
    hospital_id VARCHAR(50),
    type ENUM('video', 'chat', 'inperson', 'hospital') NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status ENUM('pending', 'upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
    reason TEXT,
    notes TEXT,
    prescription TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
    INDEX idx_patient (patient_id),
    INDEX idx_doctor (doctor_id),
    INDEX idx_status (status),
    INDEX idx_date (appointment_date)
) ENGINE=InnoDB;

-- ============================================
-- MEDICINES & PHARMACY
-- ============================================

CREATE TABLE medicines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    stock INT DEFAULT 0,
    category VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(100),
    requires_prescription BOOLEAN DEFAULT FALSE,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_name (name)
) ENGINE=InnoDB;

-- Prescriptions
CREATE TABLE prescriptions (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50) NOT NULL,
    appointment_id VARCHAR(50),
    diagnosis TEXT,
    prescription_date DATE NOT NULL,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE SET NULL,
    INDEX idx_patient (patient_id),
    INDEX idx_date (prescription_date)
) ENGINE=InnoDB;

-- Prescription Medicines
CREATE TABLE prescription_medicines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id VARCHAR(50) NOT NULL,
    medicine_id VARCHAR(50) NOT NULL,
    medicine_name VARCHAR(200) NOT NULL,
    dosage VARCHAR(100) NOT NULL,
    duration VARCHAR(100) NOT NULL,
    instructions TEXT,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Orders (Pharmacy)
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    prescription_id VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id) ON DELETE SET NULL,
    INDEX idx_patient (patient_id),
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- Order Items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    medicine_id VARCHAR(50) NOT NULL,
    medicine_name VARCHAR(200) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- NUTRITION & WELLNESS
-- ============================================

CREATE TABLE nutrition_plans (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    height DECIMAL(5,2),
    weight DECIMAL(5,2),
    bmi DECIMAL(4,1),
    daily_calories INT,
    water_intake_goal INT DEFAULT 8,
    water_intake_current INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    INDEX idx_patient (patient_id)
) ENGINE=InnoDB;

-- Dietary Restrictions
CREATE TABLE dietary_restrictions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nutrition_plan_id VARCHAR(50) NOT NULL,
    restriction VARCHAR(100) NOT NULL,
    FOREIGN KEY (nutrition_plan_id) REFERENCES nutrition_plans(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Meals
CREATE TABLE meals (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    type ENUM('breakfast', 'lunch', 'dinner', 'snack') NOT NULL,
    calories INT NOT NULL,
    recipe TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Meal Ingredients
CREATE TABLE meal_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meal_id VARCHAR(50) NOT NULL,
    ingredient VARCHAR(100) NOT NULL,
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Disease Categories for Meals
CREATE TABLE meal_disease_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    meal_id VARCHAR(50) NOT NULL,
    disease_category VARCHAR(100) NOT NULL,
    FOREIGN KEY (meal_id) REFERENCES meals(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- YOGA & FITNESS
-- ============================================

CREATE TABLE yoga_trainers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    experience INT NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0,
    session_fee DECIMAL(10,2) NOT NULL,
    bio TEXT,
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Trainer Specializations
CREATE TABLE trainer_specializations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainer_id VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES yoga_trainers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Trainer Availability
CREATE TABLE trainer_availability (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainer_id VARCHAR(50) NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES yoga_trainers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Trainer Modes
CREATE TABLE trainer_modes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainer_id VARCHAR(50) NOT NULL,
    mode ENUM('virtual', 'inperson') NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES yoga_trainers(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Yoga Sessions
CREATE TABLE yoga_sessions (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    trainer_id VARCHAR(50) NOT NULL,
    session_type ENUM('virtual', 'inperson') NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    status ENUM('upcoming', 'completed', 'cancelled') DEFAULT 'upcoming',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (trainer_id) REFERENCES yoga_trainers(id) ON DELETE CASCADE,
    INDEX idx_patient (patient_id),
    INDEX idx_trainer (trainer_id),
    INDEX idx_date (session_date)
) ENGINE=InnoDB;

-- Yoga Videos
CREATE TABLE yoga_videos (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    trainer_id VARCHAR(50),
    duration VARCHAR(20) NOT NULL,
    level ENUM('Beginner', 'Intermediate', 'Advanced', 'All Levels') NOT NULL,
    video_url VARCHAR(255),
    thumbnail_url VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES yoga_trainers(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- REPORTS & DOCUMENTS
-- ============================================

CREATE TABLE medical_reports (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(50),
    report_type VARCHAR(100) NOT NULL,
    report_name VARCHAR(200) NOT NULL,
    report_date DATE NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
    INDEX idx_patient (patient_id),
    INDEX idx_type (report_type)
) ENGINE=InnoDB;

-- ============================================
-- CHAT & MESSAGING
-- ============================================

CREATE TABLE chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id VARCHAR(50) NOT NULL,
    receiver_id VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sender (sender_id),
    INDEX idx_receiver (receiver_id),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_read (is_read)
) ENGINE=InnoDB;

-- ============================================
-- SYSTEM LOGS
-- ============================================

CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(50),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user (user_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================
-- SAMPLE DATA (Optional)
-- ============================================

-- Insert sample admin user
INSERT INTO users (id, email, password_hash, role) VALUES
('ADM001', 'admin@hyno.com', '$2a$10$...', 'admin');

-- Insert sample medicines
INSERT INTO medicines (id, name, description, price, stock, category, manufacturer, requires_prescription) VALUES
('MED001', 'Paracetamol 500mg', 'Pain reliever and fever reducer', 50.00, 500, 'Pain Relief', 'Sun Pharma', FALSE),
('MED002', 'Amoxicillin 500mg', 'Antibiotic for bacterial infections', 120.00, 200, 'Antibiotic', 'Cipla', TRUE),
('MED003', 'Metformin 500mg', 'Diabetes management', 80.00, 300, 'Diabetes', 'Dr. Reddys', TRUE),
('MED004', 'Cetirizine 10mg', 'Antihistamine for allergies', 40.00, 400, 'Allergy', 'Zydus', FALSE),
('MED005', 'Atorvastatin 10mg', 'Cholesterol management', 150.00, 150, 'Cardiovascular', 'Lupin', TRUE);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Additional indexes for frequently queried columns
CREATE INDEX idx_appointments_date_status ON appointments(appointment_date, status);
CREATE INDEX idx_orders_patient_status ON orders(patient_id, status);
CREATE INDEX idx_prescriptions_patient_date ON prescriptions(patient_id, prescription_date);

-- ============================================
-- END OF SCHEMA
-- ============================================
