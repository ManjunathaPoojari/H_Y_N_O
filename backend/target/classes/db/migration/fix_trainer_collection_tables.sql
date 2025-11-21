-- Fix trainer collection tables to use VARCHAR for trainer_id instead of INTEGER
-- This script fixes the schema mismatch where trainer_id should be VARCHAR(50) to match Trainer.id (String)

-- Fix trainer_languages table
ALTER TABLE trainer_languages 
MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Fix trainer_specialties table  
ALTER TABLE trainer_specialties 
MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Fix trainer_modes table
ALTER TABLE trainer_modes 
MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

-- Fix trainer_qualifications table
ALTER TABLE trainer_qualifications 
MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;

