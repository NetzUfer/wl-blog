<?php
// Datenbankverbindung einbinden
require_once 'includes/db_connect.php';

// Pru00fcfen, ob eine Kategorie-ID u00fcbergeben wurde
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header('Location: index.php');
    exit;
}

$category_id = (int)$_GET['id'];

// Kategorie abrufen
$stmt = $pdo->prepare('SELECT * FROM categories WHERE id = ?');
$stmt->execute([$category_id]);
$category = $stmt->fetch();

// Wenn keine Kategorie gefunden wurde, zuru00fcck zur Startseite
if (!$category) {
    header('Location: index.php');
    exit;
}

// Beitru00e4ge der Kategorie abrufen
$stmt = $pdo->prepare('SELECT posts.*, users.username 
                      FROM posts 
                      LEFT JOIN users ON posts.user_id = users.id 
                      JOIN post_categories ON posts.id = post_categories.post_id 
                      WHERE post_categories.category_id = ? 
                      ORDER BY posts.created_at DESC');
$stmt->execute([$category_id]);
$posts = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kategorie: <?php echo htmlspecialchars($category['name']); ?> - Mein Webblog</title>
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
        <section class="posts">
            <h2>Kategorie: <?php echo htmlspecialchars($category['name']); ?></h2>
            
            <?php if (empty($posts)): ?>
                <p>Keine Beitru00e4ge in dieser Kategorie vorhanden.</p>
            <?php else: ?>
                <?php foreach ($posts as $post): ?>
                    <article class="post">
                        <h3><a href="post.php?id=<?php echo $post['id']; ?>"><?php echo htmlspecialchars($post['title']); ?></a></h3>
                        <div class="meta">
                            Verfasst von <?php echo htmlspecialchars($post['username'] ?? 'Unbekannt'); ?> 
                            am <?php echo date('d.m.Y H:i', strtotime($post['created_at'])); ?>
                        </div>
                        <div class="excerpt">
                            <?php echo nl2br(htmlspecialchars(substr($post['content'], 0, 200))); ?>...
                            <a href="post.php?id=<?php echo $post['id']; ?>">Weiterlesen</a>
                        </div>
                    </article>
                <?php endforeach; ?>
            <?php endif; ?>
        </section>

        <aside class="sidebar">
            <div class="widget">
                <h3>Kategorien</h3>
                <?php
                $stmt = $pdo->query('SELECT * FROM categories ORDER BY name');
                $categories = $stmt->fetchAll();
                ?>
                <ul>
                    <?php foreach ($categories as $cat): ?>
                        <li>
                            <a href="category.php?id=<?php echo $cat['id']; ?>" 
                               <?php if ($cat['id'] == $category_id) echo 'class="active"'; ?>>
                                <?php echo htmlspecialchars($cat['name']); ?>
                            </a>
                        </li>
                    <?php endforeach; ?>
                </ul>
            </div>
        </aside>
    </main>

    <footer>
        <div class="container">
            <p>&copy; <?php echo date('Y'); ?> Mein Webblog. Alle Rechte vorbehalten.</p>
        </div>
    </footer>

    <script src="js/script.js"></script>
</body>
</html>