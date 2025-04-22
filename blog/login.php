<?php
// Session starten
session_start();

// Wenn der Benutzer bereits eingeloggt ist, zur Startseite weiterleiten
if (isset($_SESSION['user_id'])) {
    header('Location: index.php');
    exit;
}

// Datenbankverbindung einbinden
require_once 'includes/db_connect.php';

$errors = [];

// Wenn das Formular abgesendet wurde
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Formulardaten validieren
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';
    
    // Benutzername und Passwort pru00fcfen
    if (empty($username)) {
        $errors[] = 'Bitte geben Sie Ihren Benutzernamen ein.';
    }
    
    if (empty($password)) {
        $errors[] = 'Bitte geben Sie Ihr Passwort ein.';
    }
    
    // Wenn keine Fehler aufgetreten sind, Anmeldung versuchen
    if (empty($errors)) {
        try {
            // Benutzer in der Datenbank suchen
            $stmt = $pdo->prepare('SELECT id, username, password, is_admin FROM users WHERE username = ?');
            $stmt->execute([$username]);
            $user = $stmt->fetch();
            
            // Wenn Benutzer gefunden und Passwort korrekt
            if ($user && password_verify($password, $user['password'])) {
                // Benutzer in der Session speichern
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['is_admin'] = $user['is_admin'];
                
                // Zur Startseite weiterleiten
                header('Location: index.php');
                exit;
            } else {
                $errors[] = 'Benutzername oder Passwort ist falsch.';
            }
        } catch (PDOException $e) {
            $errors[] = 'Bei der Anmeldung ist ein Fehler aufgetreten. Bitte versuchen Sie es spu00e4ter erneut.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Mein Webblog</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Mein Webblog</h1>
            <nav>
                <ul>
                    <li><a href="index.php">Startseite</a></li>
                    <li><a href="login.php">Login</a></li>
                    <li><a href="register.php">Registrieren</a></li>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <section class="form-container">
            <h2>Login</h2>
            
            <?php if (!empty($errors)): ?>
                <div class="error-message">
                    <ul>
                        <?php foreach ($errors as $error): ?>
                            <li><?php echo htmlspecialchars($error); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
            <?php endif; ?>
            
            <form action="login.php" method="post">
                <div class="form-group">
                    <label for="username">Benutzername</label>
                    <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($username ?? ''); ?>" required>
                </div>
                
                <div class="form-group">
                    <label for="password">Passwort</label>
                    <input type="password" id="password" name="password" required>
                </div>
                
                <div class="form-group">
                    <button type="submit">Einloggen</button>
                </div>
            </form>
            
            <p>Noch kein Konto? <a href="register.php">Hier registrieren</a>.</p>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> Mein Webblog. Alle Rechte vorbehalten.</p>
        </div>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>