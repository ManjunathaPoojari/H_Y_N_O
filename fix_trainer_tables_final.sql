-- Final fix for trainer collection tables
-- First run find_trainer_foreign_keys.sql to get actual constraint names
-- Then modify this script with the correct constraint names

USE hyno_db;

-- Step 1: Drop foreign key constraints (update with actual constraint names from query)
-- Example (replace with actual names):
-- ALTER TABLE trainer_languages DROP FOREIGN KEY <actual_constraint_name>;
-- ALTER TABLE trainer_specialties DROP FOREIGN KEY <actual_constraint_name>;
-- ALTER TABLE trainer_modes DROP FOREIGN KEY <actual_constraint_name>;
-- ALTER TABLE trainer_qualifications DROP FOREIGN KEY <actual_constraint_name>;

-- OR: If no foreign keys exist, skip to Step 2

-- Step 2: Modify columns to VARCHAR (this will work even without dropping FKs if they don't exist)
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Step 3: Hibernate will recreate foreign keys automatically on next startup

