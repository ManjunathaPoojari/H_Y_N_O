$passwords = @("root", "madhu@9248", "")
$database = "hyno_db"
$tables = @("trainer_languages", "trainer_specialties", "trainer_modes", "trainer_qualifications")

$validPassword = ""

foreach ($tryPass in $passwords) {
    Write-Host "Trying password: $tryPass"
    $test = mysql -h 127.0.0.1 -u root -p$tryPass -e "SELECT 1;" 2>&1
    if ($LASTEXITCODE -eq 0) {
        $validPassword = $tryPass
        Write-Host "Success with password: $tryPass"
        break
    }
}

if (-not $validPassword) {
    Write-Error "Could not connect to database with known passwords."
    exit 1
}

$password = $validPassword

Write-Host "Starting migration..."

# 1. Drop FKs from child tables
foreach ($table in $tables) {
    $query = "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA='$database' AND TABLE_NAME='$table' AND CONSTRAINT_TYPE='FOREIGN KEY';"
    $result = mysql -h 127.0.0.1 -u root -p$password -N -s -e $query 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $fks = $result -split "`r`n"
        foreach ($fk in $fks) {
            if ($fk -and $fk.Trim()) {
                $fkName = $fk.Trim()
                Write-Host "Dropping FK '$fkName' from '$table'"
                mysql -h 127.0.0.1 -u root -p$password -e "ALTER TABLE $table DROP FOREIGN KEY $fkName;"
            }
        }
    } else {
        Write-Host "Error getting FKs for $table : $result"
    }
}

# 2. Modify parent table
Write-Host "Modifying trainers.id to VARCHAR(50)"
mysql -h 127.0.0.1 -u root -p$password -e "ALTER TABLE trainers MODIFY COLUMN id VARCHAR(50) NOT NULL;"

# 3. Modify child tables and re-add FKs
foreach ($table in $tables) {
    Write-Host "Modifying $table.trainer_id to VARCHAR(50)"
    mysql -h 127.0.0.1 -u root -p$password -e "ALTER TABLE $table MODIFY COLUMN trainer_id VARCHAR(50) NOT NULL;"
    
    $fkName = "fk_" + $table + "_trainer"
    Write-Host "Adding FK $fkName to $table"
    mysql -h 127.0.0.1 -u root -p$password -e "ALTER TABLE $table ADD CONSTRAINT $fkName FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE;"
}

Write-Host "Migration complete."
