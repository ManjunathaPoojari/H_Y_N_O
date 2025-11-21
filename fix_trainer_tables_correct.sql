-- Correct fix for trainer collection tables with proper constraint names
-- Run these commands in your MySQL database

USE hyno_db;

-- Step 1: Drop all foreign key constraints
ALTER TABLE trainer_languages DROP FOREIGN KEY FKp783yn1je6vdp9sh8rg2mvxqd;
ALTER TABLE trainer_modes DROP FOREIGN KEY FKcreip196183f0cc26nc45kpud;
ALTER TABLE trainer_qualifications DROP FOREIGN KEY FKlmjw7k15qa5biaxe89bxs39cf;
ALTER TABLE trainer_specialties DROP FOREIGN KEY FKbh1r4sm6dbpvwop9savgsu7s4;

-- Step 2: Modify columns to VARCHAR
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Step 3: Hibernate will recreate foreign keys automatically on next startup
-- Or you can manually recreate them:
-- ALTER TABLE trainer_languages ADD CONSTRAINT FK_trainer_languages FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_specialties ADD CONSTRAINT FK_trainer_specialties FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_modes ADD CONSTRAINT FK_trainer_modes FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_qualifications ADD CONSTRAINT FK_trainer_qualifications FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;

