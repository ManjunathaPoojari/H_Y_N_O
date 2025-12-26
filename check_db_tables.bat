@echo off
mysql -u root -proot hyno_db -e "SHOW TABLES;"
echo.
echo Constraints on trainer_languages:
mysql -u root -proot hyno_db -e "SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA='hyno_db' AND TABLE_NAME='trainer_languages';"
echo.
echo Columns in trainer_languages:
mysql -u root -proot hyno_db -e "SHOW COLUMNS FROM trainer_languages;"
echo.
echo Columns in trainers:
mysql -u root -proot hyno_db -e "SHOW COLUMNS FROM trainers;"
