-- Manual fix for trainer collection tables
-- Run these commands one by one in your MySQL client

USE hyno_db;

-- First, find the foreign key constraint names:
-- SELECT CONSTRAINT_NAME, TABLE_NAME 
-- FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
-- WHERE TABLE_SCHEMA = 'hyno_db' 
-- AND TABLE_NAME IN ('trainer_languages', 'trainer_specialties', 'trainer_modes', 'trainer_qualifications')
-- AND CONSTRAINT_TYPE = 'FOREIGN KEY';

-- Step 1: Drop foreign key constraints (replace CONSTRAINT_NAME with actual names from query above)
ALTER TABLE trainer_languages DROP FOREIGN KEY FKp783yn1je6vdp9sh8rg2mvxqd;
-- Repeat for other tables with their actual constraint names

-- Step 2: Modify columns
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

