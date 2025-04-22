<?php
// Datenbankverbindung einbinden
require_once 'includes/db_connect.php';

// Pru00fcfen, ob eine Beitrags-ID u00fcbergeben wurde
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: index.php');
    exit;
}

$post_id = (int)$_GET['id'];

// Beitrag abrufen
$stmt = $pdo->prepare('SELECT posts.*, users.username 
                      FROM posts 
                      LEFT JOIN users ON posts.user_id = users.id 
                      WHERE posts.id = ?');
$stmt->execute([$post_id]);
$post = $stmt->fetch();

// Wenn kein Beitrag gefunden wurde, zuru00fcck zur Startseite
if (!$post) {
    header('Location: index.php');
    exit;
}

// Kommentare zum Beitrag abrufen
$stmt = $pdo->prepare('SELECT comments.*, users.username 
                      FROM comments 
                      LEFT JOIN users ON comments.user_id = users.id 
                      WHERE comments.post_id = ? 
                      ORDER BY comments.created_at');
$stmt->execute([$post_id]);
$comments = $stmt->fetchAll();

// Kategorien des Beitrags abrufen
$stmt = $pdo->prepare('SELECT categories.* 
                      FROM categories 
                      JOIN post_categories ON categories.id = post_categories.category_id 
                      WHERE post_categories.post_id = ?');
$stmt->execute([$post_id]);
$post_categories = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($post['title']); ?> - Mein Webblog</title>
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
        <article class="full-post">
            <h2><?php echo htmlspecialchars($post['title']); ?></h2>
            <div class="meta">
                Verfasst von <?php echo htmlspecialchars($post['username'] ?? 'Unbekannt'); ?> 
                am <?php echo date('d.m.Y H:i', strtotime($post['created_at'])); ?>
                <?php if (!empty($post_categories)): ?>
                    in 
                    <?php 
                    $category_links = [];
                    foreach ($post_categories as $category) {
                        $category_links[] = '<a href="category.php?id=' . $category['id'] . '">' . 
                                          htmlspecialchars($category['name']) . '</a>';
                    }
                    echo implode(', ', $category_links);
                    ?>
                <?php endif; ?>
            </div>
            <div class="content">
                <?php echo nl2br(htmlspecialchars($post['content'])); ?>
            </div>
        </article>

        <section class="comments">
            <h3>Kommentare</h3>
            
            <?php if (empty($comments)): ?>
                <p>Noch keine Kommentare vorhanden.</p>
            <?php else: ?>
                <?php foreach ($comments as $comment): ?>
                    <div class="comment">
                        <div class="meta">
                            <strong><?php echo htmlspecialchars($comment['username'] ?? 'Anonym'); ?></strong> 
                            am <?php echo date('d.m.Y H:i', strtotime($comment['created_at'])); ?>
                        </div>
                        <div class="comment-text">
                            <?php echo nl2br(htmlspecialchars($comment['comment'])); ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>

            <div class="comment-form">
                <h4>Kommentar hinterlassen</h4>
                <p>Bitte <a href="login.php">loggen Sie sich ein</a>, um einen Kommentar zu hinterlassen.</p>
                <!-- Hier ku00f6nnte ein Kommentarformular fu00fcr eingeloggte Benutzer angezeigt werden -->
            </div>
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