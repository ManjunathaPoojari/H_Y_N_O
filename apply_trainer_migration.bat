@echo off
echo ========================================
echo Trainer ID Column Type Migration Script
echo ========================================
echo.
echo This script will:
echo 1. Identify foreign key constraints
echo 2. Drop foreign key constraints
echo 3. Alter column types to VARCHAR(50)
echo 4. Recreate foreign key constraints
echo.

REM Step 1: Get ALL foreign key constraint names for each table
echo Step 1: Identifying foreign key constraints...
echo.

REM Get FK for trainer_languages
FOR /F "tokens=*" %%i IN ('mysql -u root -pmadhu@9248 hyno_db -N -s -e "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='trainer_languages' AND REFERENCED_TABLE_NAME='trainers' AND TABLE_SCHEMA='hyno_db';"') DO SET FK_LANGUAGES=%%i

REM Get FK for trainer_specialties
FOR /F "tokens=*" %%i IN ('mysql -u root -pmadhu@9248 hyno_db -N -s -e "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='trainer_specialties' AND REFERENCED_TABLE_NAME='trainers' AND TABLE_SCHEMA='hyno_db';"') DO SET FK_SPECIALTIES=%%i

REM Get FK for trainer_modes
FOR /F "tokens=*" %%i IN ('mysql -u root -pmadhu@9248 hyno_db -N -s -e "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='trainer_modes' AND REFERENCED_TABLE_NAME='trainers' AND TABLE_SCHEMA='hyno_db';"') DO SET FK_MODES=%%i

REM Get FK for trainer_qualifications
FOR /F "tokens=*" %%i IN ('mysql -u root -pmadhu@9248 hyno_db -N -s -e "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE WHERE TABLE_NAME='trainer_qualifications' AND REFERENCED_TABLE_NAME='trainers' AND TABLE_SCHEMA='hyno_db';"') DO SET FK_QUALIFICATIONS=%%i

echo Found foreign keys:
if defined FK_LANGUAGES echo   - trainer_languages: %FK_LANGUAGES%
if defined FK_SPECIALTIES echo   - trainer_specialties: %FK_SPECIALTIES%
if defined FK_MODES echo   - trainer_modes: %FK_MODES%
if defined FK_QUALIFICATIONS echo   - trainer_qualifications: %FK_QUALIFICATIONS%
echo.

REM Step 2: Drop all foreign keys
echo Step 2: Dropping foreign key constraints...

if defined FK_LANGUAGES (
    mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_languages DROP FOREIGN KEY %FK_LANGUAGES%;" 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Dropped FK from trainer_languages: %FK_LANGUAGES%
    ) else (
        echo ! Failed to drop FK from trainer_languages
    )
) else (
    echo ! No FK found for trainer_languages
)

if defined FK_SPECIALTIES (
    mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_specialties DROP FOREIGN KEY %FK_SPECIALTIES%;" 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Dropped FK from trainer_specialties: %FK_SPECIALTIES%
    ) else (
        echo ! Failed to drop FK from trainer_specialties
    )
) else (
    echo ! No FK found for trainer_specialties
)

if defined FK_MODES (
    mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_modes DROP FOREIGN KEY %FK_MODES%;" 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Dropped FK from trainer_modes: %FK_MODES%
    ) else (
        echo ! Failed to drop FK from trainer_modes
    )
) else (
    echo ! No FK found for trainer_modes
)

if defined FK_QUALIFICATIONS (
    mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_qualifications DROP FOREIGN KEY %FK_QUALIFICATIONS%;" 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Dropped FK from trainer_qualifications: %FK_QUALIFICATIONS%
    ) else (
        echo ! Failed to drop FK from trainer_qualifications
    )
) else (
    echo ! No FK found for trainer_qualifications
)

echo.
echo Step 3: Altering column types to VARCHAR(50)...

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainers MODIFY COLUMN id VARCHAR(50) NOT NULL;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to alter trainers.id
    exit /b 1
)
echo ✓ trainers.id → VARCHAR(50)

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_languages MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to alter trainer_languages.trainer_id
    exit /b 1
)
echo ✓ trainer_languages.trainer_id → VARCHAR(50)

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_specialties MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to alter trainer_specialties.trainer_id
    exit /b 1
)
echo ✓ trainer_specialties.trainer_id → VARCHAR(50)

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_modes MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to alter trainer_modes.trainer_id
    exit /b 1
)
echo ✓ trainer_modes.trainer_id → VARCHAR(50)

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_qualifications MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;" 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to alter trainer_qualifications.trainer_id
    exit /b 1
)
echo ✓ trainer_qualifications.trainer_id → VARCHAR(50)

echo.
echo Step 4: Recreating foreign key constraints...

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_languages ADD CONSTRAINT fk_trainer_languages_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;" 2>nul
echo ✓ Recreated FK for trainer_languages

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_specialties ADD CONSTRAINT fk_trainer_specialties_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;" 2>nul
echo ✓ Recreated FK for trainer_specialties

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_modes ADD CONSTRAINT fk_trainer_modes_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;" 2>nul
echo ✓ Recreated FK for trainer_modes

mysql -u root -pmadhu@9248 hyno_db -e "ALTER TABLE trainer_qualifications ADD CONSTRAINT fk_trainer_qualifications_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;" 2>nul
echo ✓ Recreated FK for trainer_qualifications

echo.
echo ========================================
echo Migration completed successfully!
echo ========================================
echo.
echo Verifying changes...
mysql -u root -pmadhu@9248 hyno_db -e "SHOW COLUMNS FROM trainers WHERE Field='id';" 2>nul
echo.
mysql -u root -pmadhu@9248 hyno_db -e "SHOW COLUMNS FROM trainer_languages WHERE Field='trainer_id';" 2>nul

echo.
echo Done! You can now create trainers with string IDs like T001, T002, etc.
