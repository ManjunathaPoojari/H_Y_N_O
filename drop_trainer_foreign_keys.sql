-- Step-by-step guide to drop foreign key constraints on trainer collection tables

USE hyno_db;

-- STEP 1: First, find all foreign key constraints on these tables
-- Run this query to see all foreign keys:
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'hyno_db'
AND TABLE_NAME IN ('trainer_languages', 'trainer_specialties', 'trainer_modes', 'trainer_qualifications')
AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME;

-- STEP 2: Once you have the constraint names from the query above,
-- drop them using this format (replace <CONSTRAINT_NAME> with actual names):

-- Example:
-- ALTER TABLE trainer_languages DROP FOREIGN KEY <CONSTRAINT_NAME>;
-- ALTER TABLE trainer_specialties DROP FOREIGN KEY <CONSTRAINT_NAME>;
-- ALTER TABLE trainer_modes DROP FOREIGN KEY <CONSTRAINT_NAME>;
-- ALTER TABLE trainer_qualifications DROP FOREIGN KEY <CONSTRAINT_NAME>;

-- STEP 3: After dropping all foreign keys, modify the columns:
ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;
ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

