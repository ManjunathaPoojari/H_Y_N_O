-- Find all foreign key constraints on trainer collection tables
-- Run this first to get the actual constraint names

USE hyno_db;

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
ORDER BY TABLE_NAME, CONSTRAINT_NAME;

