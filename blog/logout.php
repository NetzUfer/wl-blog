<?php
// Session starten
session_start();

// Session-Variablen lu00f6schen
$_SESSION = [];

// Session-Cookie lu00f6schen
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Session zerstu00f6ren
session_destroy();

// Zur Login-Seite weiterleiten
header('Location: login.php');
exit;
?>