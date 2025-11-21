-- Direct fix for trainer collection tables
-- Run these commands in your MySQL database

USE hyno_db;

-- Step 1: Drop the foreign key constraint that's causing the issue
ALTER TABLE trainer_languages DROP FOREIGN KEY FKp783yn1je6vdp9sh8rg2mvxqd;

-- Step 2: Find and drop other foreign keys (run this query first to find constraint names)
-- SELECT CONSTRAINT_NAME, TABLE_NAME 
-- FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
-- WHERE TABLE_SCHEMA = 'hyno_db' 
-- AND TABLE_NAME IN ('trainer_specialties', 'trainer_modes', 'trainer_qualifications')
-- AND CONSTRAINT_TYPE = 'FOREIGN KEY';

-- Then drop them (replace with actual constraint names):
-- ALTER TABLE trainer_specialties DROP FOREIGN KEY <constraint_name>;
-- ALTER TABLE trainer_modes DROP FOREIGN KEY <constraint_name>;
-- ALTER TABLE trainer_qualifications DROP FOREIGN KEY <constraint_name>;

-- Step 3: Modify columns to VARCHAR
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Step 4: Hibernate will recreate foreign keys automatically on next startup
-- Or manually recreate them if needed:
-- ALTER TABLE trainer_languages ADD CONSTRAINT FK_trainer_languages FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_specialties ADD CONSTRAINT FK_trainer_specialties FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_modes ADD CONSTRAINT FK_trainer_modes FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;
-- ALTER TABLE trainer_qualifications ADD CONSTRAINT FK_trainer_qualifications FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;

