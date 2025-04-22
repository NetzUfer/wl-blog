<?php
// Datenbankverbindungsparameter
$host = 'localhost'; // Ändern Sie dies zu Ihrem MySQL-Host
$user = 'username'; // Ändern Sie dies zu Ihrem MySQL-Benutzernamen
$password = 'password'; // Ändern Sie dies zu Ihrem MySQL-Passwort
$database = 'blog_db'; // Ändern Sie dies zu Ihrem Datenbanknamen

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