-- Fix trainer collection tables to use VARCHAR for trainer_id
-- Run this script in your MySQL database to fix the schema mismatch

USE hyno_db;

-- Step 1: Drop foreign key constraints first
-- Find and drop all foreign keys on these tables
ALTER TABLE trainer_languages DROP FOREIGN KEY IF EXISTS FKp783yn1je6vdp9sh8rg2mvxqd;
ALTER TABLE trainer_specialties DROP FOREIGN KEY IF EXISTS FK_trainer_specialties_trainer;
ALTER TABLE trainer_modes DROP FOREIGN KEY IF EXISTS FK_trainer_modes_trainer;
ALTER TABLE trainer_qualifications DROP FOREIGN KEY IF EXISTS FK_trainer_qualifications_trainer;

-- If the above doesn't work, find the constraint names first with:
-- SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
-- WHERE TABLE_SCHEMA = 'hyno_db' AND TABLE_NAME = 'trainer_languages' AND CONSTRAINT_TYPE = 'FOREIGN KEY';

-- Step 2: Modify columns to VARCHAR
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Step 3: Foreign keys will be recreated automatically by Hibernate on next startup
-- Or you can manually recreate them:
-- ALTER TABLE trainer_languages ADD CONSTRAINT FK_trainer_languages FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_specialties ADD CONSTRAINT FK_trainer_specialties FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_modes ADD CONSTRAINT FK_trainer_modes FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_qualifications ADD CONSTRAINT FK_trainer_qualifications FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;

