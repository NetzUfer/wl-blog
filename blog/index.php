<?php
// Datenbankverbindung einbinden
require_once 'includes/db_connect.php';

// Alle Blogbeitru00e4ge abrufen (neueste zuerst)
$stmt = $pdo->query('SELECT posts.*, users.username 
                    FROM posts 
                    LEFT JOIN users ON posts.user_id = users.id 
                    ORDER BY posts.created_at DESC');
$posts = $stmt->fetchAll();
?>

<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mein Webblog</title>
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
        <section class="posts">
            <h2>Neueste Beitru00e4ge</h2>
            
            <?php if (empty($posts)): ?>
                <p>Noch keine Beitru00e4ge vorhanden.</p>
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
                    <?php foreach ($categories as $category): ?>
                        <li><a href="category.php?id=<?php echo $category['id']; ?>">
                            <?php echo htmlspecialchars($category['name']); ?>
                        </a></li>
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