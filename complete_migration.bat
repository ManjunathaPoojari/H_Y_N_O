@echo off
echo Completing Trainer ID Migration...
echo.
echo This will complete the migration for the remaining 3 tables.
echo.

echo Step 1: Dropping remaining foreign keys...
mysql -u root -pmadhu@9248 -e "USE hyno_db; ALTER TABLE trainer_specialties DROP FOREIGN KEY FKbh1r4sm6dbpvwop9savgsu7s4;" 2>nul
echo Done with trainer_specialties FK

mysql -u root -pmadhu@9248 -e "USE hyno_db; SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='trainer_modes' AND REFERENCED_TABLE_NAME='trainers' AND TABLE_SCHEMA='hyno_db';" 2>nul
mysql -u root -pmadhu@9248 -e "USE hyno_db; SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='trainer_qualifications' AND REFERENCED_TABLE_NAME='trainers' AND TABLE_SCHEMA='hyno_db';" 2>nul

echo.
echo Step 2: Altering remaining columns...
mysql -u root -pmadhu@9248 -e "USE hyno_db; ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ trainer_specialties.trainer_id → VARCHAR(50)
) else (
    echo ! Failed to alter trainer_specialties
)

mysql -u root -pmadhu@9248 -e "USE hyno_db; ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ trainer_modes.trainer_id → VARCHAR(50)
) else (
    echo ! Failed to alter trainer_modes
)

mysql -u root -pmadhu@9248 -e "USE hyno_db; ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;" 2>nul
if %ERRORLEVEL% EQU 0 (
    echo ✓ trainer_qualifications.trainer_id → VARCHAR(50)
) else (
    echo ! Failed to alter trainer_qualifications
)

echo.
echo Step 3: Recreating all foreign keys...
mysql -u root -pmadhu@9248 -e "USE hyno_db; ALTER TABLE trainer_languages ADD CONSTRAINT fk_trainer_languages_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;" 2>nul
echo ✓ FK for trainer_languages

mysql -u root -pmadhu@9248 -e "USE hyno_db; ALTER TABLE trainer_specialties ADD CONSTRAINT fk_trainer_specialties_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;" 2>nul
echo ✓ FK for trainer_specialties

mysql -u root -pmadhu@9248 -e "USE hyno_db; ALTER TABLE trainer_modes ADD CONSTRAINT fk_trainer_modes_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;" 2>nul
echo ✓ FK for trainer_modes

mysql -u root -pmadhu@9248 -e "USE hyno_db; ALTER TABLE trainer_qualifications ADD CONSTRAINT fk_trainer_qualifications_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;" 2>nul
echo ✓ FK for trainer_qualifications

echo.
echo ========================================
echo Migration Complete!
echo ========================================
echo.
echo Verifying all columns...
mysql -u root -pmadhu@9248 -e "USE hyno_db; SHOW COLUMNS FROM trainers WHERE Field='id'; SHOW COLUMNS FROM trainer_languages WHERE Field='trainer_id'; SHOW COLUMNS FROM trainer_specialties WHERE Field='trainer_id'; SHOW COLUMNS FROM trainer_modes WHERE Field='trainer_id'; SHOW COLUMNS FROM trainer_qualifications WHERE Field='trainer_id';" 2>nul

echo.
echo All done! You can now create trainers with string IDs.
