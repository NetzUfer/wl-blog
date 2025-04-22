<?php
// Datenbankverbindung einbinden
require_once 'includes/db_connect.php';

$errors = [];
$success = false;

// Wenn das Formular abgesendet wurde
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Formulardaten validieren
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $password_confirm = $_POST['password_confirm'] ?? '';
    
    // Benutzername pru00fcfen
    if (empty($username)) {
        $errors[] = 'Bitte geben Sie einen Benutzernamen ein.';
    } elseif (strlen($username) < 3 || strlen($username) > 50) {
        $errors[] = 'Der Benutzername muss zwischen 3 und 50 Zeichen lang sein.';
    } else {
        // Pru00fcfen, ob der Benutzername bereits existiert
        $stmt = $pdo->prepare('SELECT id FROM users WHERE username = ?');
        $stmt->execute([$username]);
        if ($stmt->fetch()) {
            $errors[] = 'Dieser Benutzername ist bereits vergeben.';
        }
    }
    
    // E-Mail pru00fcfen
    if (empty($email)) {
        $errors[] = 'Bitte geben Sie eine E-Mail-Adresse ein.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Bitte geben Sie eine gu00fcltige E-Mail-Adresse ein.';
    } else {
        // Pru00fcfen, ob die E-Mail bereits existiert
        $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $errors[] = 'Diese E-Mail-Adresse ist bereits registriert.';
        }
    }
    
    // Passwort pru00fcfen
    if (empty($password)) {
        $errors[] = 'Bitte geben Sie ein Passwort ein.';
    } elseif (strlen($password) < 8) {
        $errors[] = 'Das Passwort muss mindestens 8 Zeichen lang sein.';
    } elseif ($password !== $password_confirm) {
        $errors[] = 'Die Passwortu00fcberpru00fcfung stimmt nicht u00fcberein.';
    }
    
    // Wenn keine Fehler aufgetreten sind, Benutzer registrieren
    if (empty($errors)) {
        try {
            // Passwort hashen
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            // Benutzer in die Datenbank einfu00fcgen
            $stmt = $pdo->prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');
            $stmt->execute([$username, $email, $password_hash]);
            
            $success = true;
        } catch (PDOException $e) {
            $errors[] = 'Bei der Registrierung ist ein Fehler aufgetreten. Bitte versuchen Sie es spu00e4ter erneut.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrieren - Mein Webblog</title>
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
            <h2>Registrieren</h2>
            
            <?php if ($success): ?>
                <div class="success-message">
                    <p>Sie haben sich erfolgreich registriert! <a href="login.php">Jetzt einloggen</a>.</p>
                </div>
            <?php else: ?>
                <?php if (!empty($errors)): ?>
                    <div class="error-message">
                        <ul>
                            <?php foreach ($errors as $error): ?>
                                <li><?php echo htmlspecialchars($error); ?></li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php endif; ?>
                
                <form action="register.php" method="post">
                    <div class="form-group">
                        <label for="username">Benutzername</label>
                        <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($username ?? ''); ?>" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">E-Mail</label>
                        <input type="email" id="email" name="email" value="<?php echo htmlspecialchars($email ?? ''); ?>" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Passwort</label>
                        <input type="password" id="password" name="password" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="password_confirm">Passwort wiederholen</label>
                        <input type="password" id="password_confirm" name="password_confirm" required>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit">Registrieren</button>
                    </div>
                </form>
                
                <p>Bereits registriert? <a href="login.php">Hier einloggen</a>.</p>
            <?php endif; ?>
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