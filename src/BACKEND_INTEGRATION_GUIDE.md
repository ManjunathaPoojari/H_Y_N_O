# 🔗 Backend Integration Guide - Spring Boot + MySQL

## Current Status
- ✅ **Frontend**: Fully functional with mock data
- ⏳ **Backend**: Ready to connect (API layer created)
- ⏳ **Database**: Ready to connect via Spring Boot

---

## Step 1: Set Up Spring Boot Backend

### 1.1 Create Spring Boot Project
```bash
# Using Spring Initializr (https://start.spring.io/)
# Add these dependencies:
- Spring Web
- Spring Data JPA
- MySQL Driver
- Spring Security
- Lombok
- Validation
```

### 1.2 Database Configuration (`application.properties`)
```properties
# MySQL Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/hyno_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Server Port
server.port=8080

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000
```

---

## Step 2: Create Database Schema

### 2.1 Create MySQL Database
```sql
CREATE DATABASE hyno_db;
USE hyno_db;
```

### 2.2 Database Tables (Auto-created by JPA, or manual)

```sql
-- Patients Table
CREATE TABLE patients (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    age INT,
    gender VARCHAR(10),
    blood_group VARCHAR(5),
    address TEXT,
    emergency_contact VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE doctors (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    qualification VARCHAR(200),
    experience INT,
    rating DECIMAL(2,1),
    available BOOLEAN DEFAULT TRUE,
    hospital_id VARCHAR(50),
    consultation_fee DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Hospitals Table
CREATE TABLE hospitals (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    total_doctors INT DEFAULT 0,
    registration_number VARCHAR(100) UNIQUE,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE appointments (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    patient_name VARCHAR(100),
    doctor_id VARCHAR(50),
    doctor_name VARCHAR(100),
    hospital_id VARCHAR(50),
    type VARCHAR(20),
    date DATE,
    time TIME,
    status VARCHAR(20) DEFAULT 'upcoming',
    reason TEXT,
    notes TEXT,
    prescription TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
);

-- Medicines Table
CREATE TABLE medicines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    stock INT DEFAULT 0,
    category VARCHAR(50),
    manufacturer VARCHAR(100),
    requires_prescription BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prescriptions Table
CREATE TABLE prescriptions (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    doctor_id VARCHAR(50),
    diagnosis TEXT,
    date DATE,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
);

-- Orders Table (Pharmacy)
CREATE TABLE orders (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    total_amount DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'pending',
    delivery_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Nutrition Plans Table
CREATE TABLE nutrition_plans (
    id VARCHAR(50) PRIMARY KEY,
    patient_id VARCHAR(50),
    bmi DECIMAL(4,1),
    calories INT,
    water_intake INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Yoga Trainers Table
CREATE TABLE yoga_trainers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    experience INT,
    rating DECIMAL(2,1),
    session_fee DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Step 3: Create Spring Boot Entities

### Example: Patient Entity
```java
package com.hyno.entity;

import lombok.Data;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "patients")
@Data
public class Patient {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String phone;
    private Integer age;
    private String gender;
    private String bloodGroup;
    
    @ElementCollection
    private List<String> allergies;
    
    @ElementCollection
    private List<String> medicalHistory;
    
    private String address;
    private String emergencyContact;
    
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

### Example: Doctor Entity
```java
package com.hyno.entity;

import lombok.Data;
import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctors")
@Data
public class Doctor {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String phone;
    private String specialization;
    private String qualification;
    private Integer experience;
    private BigDecimal rating;
    private Boolean available = true;
    
    @ManyToOne
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;
    
    private BigDecimal consultationFee;
    private String status = "pending";
    
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
```

---

## Step 4: Create Repositories

```java
package com.hyno.repository;

import com.hyno.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PatientRepository extends JpaRepository<Patient, String> {
    Patient findByEmail(String email);
}
```

```java
package com.hyno.repository;

import com.hyno.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, String> {
    List<Doctor> findByStatus(String status);
    List<Doctor> findByHospitalId(String hospitalId);
}
```

---

## Step 5: Create Services

```java
package com.hyno.service;

import com.hyno.entity.Patient;
import com.hyno.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientService {
    
    @Autowired
    private PatientRepository patientRepository;
    
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
    
    public Patient getPatientById(String id) {
        return patientRepository.findById(id).orElse(null);
    }
    
    public Patient createPatient(Patient patient) {
        return patientRepository.save(patient);
    }
    
    public Patient updatePatient(String id, Patient patient) {
        patient.setId(id);
        return patientRepository.save(patient);
    }
    
    public void deletePatient(String id) {
        patientRepository.deleteById(id);
    }
}
```

---

## Step 6: Create Controllers

```java
package com.hyno.controller;

import com.hyno.entity.Patient;
import com.hyno.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:3000")
public class PatientController {
    
    @Autowired
    private PatientService patientService;
    
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String id) {
        Patient patient = patientService.getPatientById(id);
        return patient != null ? ResponseEntity.ok(patient) : ResponseEntity.notFound().build();
    }
    
    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientService.createPatient(patient);
    }
    
    @PutMapping("/{id}")
    public Patient updatePatient(@PathVariable String id, @RequestBody Patient patient) {
        return patientService.updatePatient(id, patient);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ResponseEntity.ok().build();
    }
}
```

---

## Step 7: Configure CORS

```java
package com.hyno.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
    
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }
}
```

---

## Step 8: Connect Frontend to Backend

### 8.1 Create `.env` file in React root
```bash
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_USE_MOCK_DATA=false
```

### 8.2 Update `app-store.tsx` to use API

Replace mock data functions with API calls:

```typescript
// Example: Update addPatient function
const addPatient = async (patient: Patient) => {
  try {
    const newPatient = await api.patients.create(patient);
    setPatients([...patients, newPatient]);
    toast.success('Patient added successfully');
  } catch (error) {
    toast.error('Failed to add patient');
    console.error(error);
  }
};
```

---

## Step 9: Test the Integration

### 9.1 Start Backend
```bash
cd backend
mvn spring-boot:run
```

### 9.2 Start Frontend
```bash
cd frontend
npm start
```

### 9.3 Test API Endpoints
```bash
# Test patient creation
curl -X POST http://localhost:8080/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "id": "P001",
    "name": "Test Patient",
    "email": "test@example.com",
    "phone": "+91 1234567890",
    "age": 30,
    "gender": "Male"
  }'

# Get all patients
curl http://localhost:8080/api/patients
```

---

## Step 10: Complete API Endpoints Required

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/{id}` - Get doctor by ID
- `POST /api/doctors` - Create doctor
- `PUT /api/doctors/{id}` - Update doctor
- `PUT /api/doctors/{id}/approve` - Approve doctor
- `PUT /api/doctors/{id}/suspend` - Suspend doctor
- `DELETE /api/doctors/{id}` - Delete doctor

### Hospitals
- `GET /api/hospitals` - Get all hospitals
- `GET /api/hospitals/{id}` - Get hospital by ID
- `POST /api/hospitals` - Create hospital
- `PUT /api/hospitals/{id}` - Update hospital
- `PUT /api/hospitals/{id}/approve` - Approve hospital
- `PUT /api/hospitals/{id}/reject` - Reject hospital
- `DELETE /api/hospitals/{id}` - Delete hospital

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/{id}` - Get appointment by ID
- `GET /api/appointments/patient/{patientId}` - Get by patient
- `GET /api/appointments/doctor/{doctorId}` - Get by doctor
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `PUT /api/appointments/{id}/cancel` - Cancel appointment
- `PUT /api/appointments/{id}/complete` - Complete appointment
- `PUT /api/appointments/{id}/reschedule` - Reschedule appointment

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/{id}` - Get medicine by ID
- `GET /api/medicines/search?q={query}` - Search medicines
- `POST /api/medicines` - Create medicine
- `PUT /api/medicines/{id}` - Update medicine
- `DELETE /api/medicines/{id}` - Delete medicine

### Prescriptions
- `POST /api/prescriptions/upload` - Upload prescription file
- `GET /api/prescriptions/patient/{patientId}` - Get patient prescriptions
- `POST /api/prescriptions` - Create prescription

### Orders (Pharmacy)
- `POST /api/orders` - Create order
- `GET /api/orders/patient/{patientId}` - Get patient orders
- `GET /api/orders/{id}` - Get order by ID
- `PUT /api/orders/{id}/status` - Update order status

### Nutrition
- `GET /api/nutrition/plans` - Get all nutrition plans
- `GET /api/nutrition/plans/patient/{patientId}` - Get patient plan
- `POST /api/nutrition/plans` - Create nutrition plan
- `PUT /api/nutrition/plans/{id}` - Update nutrition plan
- `GET /api/nutrition/meals` - Get all meals
- `GET /api/nutrition/recipes?disease={disease}` - Get recipes by disease

### Yoga
- `GET /api/yoga/trainers` - Get all trainers
- `GET /api/yoga/trainers/{id}` - Get trainer by ID
- `POST /api/yoga/sessions` - Book yoga session
- `GET /api/yoga/sessions/patient/{patientId}` - Get patient sessions
- `GET /api/yoga/videos` - Get yoga videos

---

## Deployment Checklist

### Backend
- [ ] Spring Boot application running on port 8080
- [ ] MySQL database created and configured
- [ ] All tables created (auto or manual)
- [ ] CORS enabled for React frontend
- [ ] JWT authentication configured
- [ ] All endpoints tested

### Frontend
- [ ] `.env` file configured with backend URL
- [ ] `REACT_APP_USE_MOCK_DATA=false`
- [ ] API client integrated
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Build for production

### Database
- [ ] MySQL installed and running
- [ ] Database `hyno_db` created
- [ ] User permissions granted
- [ ] Initial data seeded (optional)

---

## 🎉 Once Connected

Your application will be fully integrated:
- ✅ Frontend makes real API calls
- ✅ Backend processes requests
- ✅ Database stores all data
- ✅ Real-time data synchronization
- ✅ Production-ready system

---

## Need Help?

Check these files:
- `/lib/api-client.ts` - API integration layer
- `/lib/app-store.tsx` - Update with API calls
- `/.env.example` - Environment configuration

**Your frontend is 100% ready. Just connect the Spring Boot backend!**
