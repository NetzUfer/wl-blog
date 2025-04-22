<?php
// Session starten
session_start();

// Pru00fcfen, ob der Benutzer eingeloggt ist
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}

// Datenbankverbindung einbinden
require_once 'includes/db_connect.php';

$errors = [];
$success = false;

// Kategorien abrufen
$stmt = $pdo->query('SELECT * FROM categories ORDER BY name');
$categories = $stmt->fetchAll();

// Wenn das Formular abgesendet wurde
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Formulardaten validieren
    $title = trim($_POST['title'] ?? '');
    $content = trim($_POST['content'] ?? '');
    $selected_categories = $_POST['categories'] ?? [];
    
    // Titel pru00fcfen
    if (empty($title)) {
        $errors[] = 'Bitte geben Sie einen Titel ein.';
    } elseif (strlen($title) > 255) {
        $errors[] = 'Der Titel darf maximal 255 Zeichen lang sein.';
    }
    
    // Inhalt pru00fcfen
    if (empty($content)) {
        $errors[] = 'Bitte geben Sie einen Inhalt ein.';
    }
    
    // Wenn keine Fehler aufgetreten sind, Beitrag erstellen
    if (empty($errors)) {
        try {
            // Transaktion starten
            $pdo->beginTransaction();
            
            // Beitrag in die Datenbank einfu00fcgen
            $stmt = $pdo->prepare('INSERT INTO posts (title, content, user_id) VALUES (?, ?, ?)');
            $stmt->execute([$title, $content, $_SESSION['user_id']]);
            
            // ID des neuen Beitrags abrufen
            $post_id = $pdo->lastInsertId();
            
            // Kategorien zuordnen
            if (!empty($selected_categories)) {
                $stmt = $pdo->prepare('INSERT INTO post_categories (post_id, category_id) VALUES (?, ?)');
                foreach ($selected_categories as $category_id) {
                    $stmt->execute([$post_id, $category_id]);
                }
            }
            
            // Transaktion abschliessen
            $pdo->commit();
            
            $success = true;
            // Formularfelder zuru00fccksetzen
            $title = $content = '';
            $selected_categories = [];
        } catch (PDOException $e) {
            // Transaktion ru00fcckgu00e4ngig machen
            $pdo->rollBack();
            $errors[] = 'Beim Erstellen des Beitrags ist ein Fehler aufgetreten. Bitte versuchen Sie es spu00e4ter erneut.';
        }
    }
}
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neuen Beitrag erstellen - Mein Webblog</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>Mein Webblog</h1>
            <nav>
                <ul>
                    <li><a href="index.php">Startseite</a></li>
                    <?php if (isset($_SESSION['user_id'])): ?>
                        <li><a href="create_post.php">Neuer Beitrag</a></li>
                        <li><a href="logout.php">Logout</a></li>
                    <?php else: ?>
                        <li><a href="login.php">Login</a></li>
                        <li><a href="register.php">Registrieren</a></li>
                    <?php endif; ?>
                </ul>
            </nav>
        </div>
    </header>

    <main class="container">
        <section class="form-container">
            <h2>Neuen Beitrag erstellen</h2>
            
            <?php if ($success): ?>
                <div class="success-message">
                    <p>Der Beitrag wurde erfolgreich erstellt! <a href="index.php">Zuru00fcck zur Startseite</a>.</p>
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
                
                <form action="create_post.php" method="post">
                    <div class="form-group">
                        <label for="title">Titel</label>
                        <input type="text" id="title" name="title" value="<?php echo htmlspecialchars($title ?? ''); ?>" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="content">Inhalt</label>
                        <textarea id="content" name="content" rows="10" required><?php echo htmlspecialchars($content ?? ''); ?></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Kategorien</label>
                        <div class="checkbox-group">
                            <?php foreach ($categories as $category): ?>
                                <label>
                                    <input type="checkbox" name="categories[]" value="<?php echo $category['id']; ?>"
                                    <?php if (isset($selected_categories) && in_array($category['id'], $selected_categories)) echo 'checked'; ?>>
                                    <?php echo htmlspecialchars($category['name']); ?>
                                </label>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit">Beitrag erstellen</button>
                    </div>
                </form>
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