<?php
// Datenbankverbindungsparameter
$host = 'database-5017695371.ud-webspace.de'; // Ändern Sie dies zu Ihrem MySQL-Host
$user = 'dbu1921258'; // Ändern Sie dies zu Ihrem MySQL-Benutzernamen
$password = 'Schirema05042025!'; // Ändern Sie dies zu Ihrem MySQL-Passwort
$database = 'dbs14147259'; // Ändern Sie dies zu Ihrem Datenbanknamen

// Verbindung zur Datenbank herstellen
try {
    $pdo = new PDO("mysql:host=$host;dbname=$database;charset=utf8", $user, $password);
    // Fehlerberichterstattung einschalten
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    echo "Verbindungsfehler: " . $e->getMessage();
    die();
}
?>