SELECT TABLE_NAME, CONSTRAINT_NAME 
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
WHERE TABLE_SCHEMA='hyno_db' 
AND CONSTRAINT_TYPE='FOREIGN KEY' 
AND TABLE_NAME IN ('trainer_languages', 'trainer_specialties', 'trainer_modes', 'trainer_qualifications');
