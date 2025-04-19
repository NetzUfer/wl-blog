import mysql from 'mysql2/promise';

// Datenbankverbindung erstellen
async function createConnection() {
  try {
    // Increase timeout and add retry logic
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost', // Default to localhost for development
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'blog_db',
      connectTimeout: 30000, // 30 seconds timeout
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      // Add these options for better stability
      enableKeepAlive: true,
      keepAliveInitialDelay: 10000 // 10 seconds
    });
    
    console.log('Datenbankverbindung hergestellt');
    return connection;
  } catch (error) {
    console.error('Fehler bei der Datenbankverbindung:', error);
    // Log more detailed error information
    if (error.code === 'ETIMEDOUT') {
      console.error('Verbindungs-Timeout: Die Datenbank ist nicht erreichbar. Überprüfen Sie die Netzwerkverbindung und die Datenbankkonfiguration.');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Zugriff verweigert: Überprüfen Sie Benutzername und Passwort.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Verbindung abgelehnt: Der Datenbankserver ist nicht erreichbar oder läuft nicht.');
    }
    throw error;
  }
}

// Hilfsfunktion für Datenbankoperationen mit automatischem Verbindungsmanagement
async function executeQuery(callback) {
  const connection = await createConnection();
  try {
    return await callback(connection);
  } catch (error) {
    console.error('Datenbankfehler:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Datenbank initialisieren
async function initializeDatabase() {
  return executeQuery(async (connection) => {
    await connection.beginTransaction();
    
    try {
      // Tabelle für Benutzer
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role ENUM('admin', 'editor') NOT NULL DEFAULT 'editor',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Tabelle für Kategorien
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS categories (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          icon VARCHAR(50),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Tabelle für Beiträge
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          excerpt TEXT,
          content TEXT NOT NULL,
          image VARCHAR(255),
          category_id INT,
          author_id INT,
          status ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
          meta_title VARCHAR(255),
          meta_description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
          FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
        )
      `);
      
      // Tabelle für Tags
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS tags (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Tabelle für die Verknüpfung von Beiträgen und Tags
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS post_tags (
          post_id INT,
          tag_id INT,
          PRIMARY KEY (post_id, tag_id),
          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
          FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        )
      `);
      
      // Tabelle für Kommentare
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS comments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          post_id INT NOT NULL,
          author_name VARCHAR(255) NOT NULL,
          author_email VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          status ENUM('pending', 'approved', 'spam') NOT NULL DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
        )
      `);
      
      // Tabelle für Newsletter-Abonnenten
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS subscribers (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255) NOT NULL UNIQUE,
          status ENUM('active', 'unsubscribed') NOT NULL DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      console.log('Datenbank initialisiert');
      
      // Standardkategorien einfügen, wenn keine vorhanden sind
      const [categories] = await connection.execute('SELECT COUNT(*) as count FROM categories');
      if (categories[0].count === 0) {
        await connection.execute(`
          INSERT INTO categories (name, slug, description, icon) VALUES
          ('Über mich', 'ueber-mich', 'Erfahre mehr über meine Geschichte und meinen Weg zu einem gesünderen Leben.', 'fa-user'),
          ('Abnehmen', 'abnehmen', 'Tipps und Tricks für eine nachhaltige Gewichtsreduktion ohne Verzicht.', 'fa-weight-scale'),
          ('Bewegung', 'bewegung', 'Workouts und Übungen für mehr Fitness und Wohlbefinden im Alltag.', 'fa-person-running'),
          ('Bücher', 'buecher', 'Meine Buchempfehlungen zu Gesundheit, Ernährung und persönlichem Wachstum.', 'fa-book'),
          ('Filme', 'filme', 'Inspirierende Filme und Dokumentationen für mehr Motivation.', 'fa-film')
        `);
        console.log('Standardkategorien eingefügt');
      }
      
      // Admin-Benutzer erstellen, wenn keiner vorhanden ist
      const [users] = await connection.execute('SELECT COUNT(*) as count FROM users');
      if (users[0].count === 0) {
        const bcrypt = await import('bcrypt');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await connection.execute(`
          INSERT INTO users (name, email, password, role) VALUES
          ('Admin', 'admin@lifestyleblog.de', ?, 'admin')
        `, [hashedPassword]);
        console.log('Admin-Benutzer erstellt');
      }
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      console.error('Fehler bei der Datenbankinitialisierung:', error);
      throw error;
    }
  });
}

// Beiträge abrufen
async function getPosts({ limit = 10, offset = 0, category = null, status = 'published' } = {}) {
  const connection = await createConnection();
  
  try {
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, u.name as author_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = ?
    `;
    
    const queryParams = [status];
    
    if (category) {
      query += ' AND c.slug = ?';
      queryParams.push(category);
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    const [posts] = await connection.execute(query, queryParams);
    
    // Tags für jeden Beitrag abrufen
    for (const post of posts) {
      const [tags] = await connection.execute(`
        SELECT t.id, t.name, t.slug
        FROM tags t
        JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ?
      `, [post.id]);
      
      post.tags = tags;
    }
    
    return posts;
  } catch (error) {
    console.error('Fehler beim Abrufen der Beiträge:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Einzelnen Beitrag abrufen
async function getPostBySlug(slug) {
  const connection = await createConnection();
  
  try {
    const [posts] = await connection.execute(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, u.name as author_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.slug = ? AND p.status = 'published'
    `, [slug]);
    
    if (posts.length === 0) {
      return null;
    }
    
    const post = posts[0];
    
    // Tags abrufen
    const [tags] = await connection.execute(`
      SELECT t.id, t.name, t.slug
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ?
    `, [post.id]);
    
    post.tags = tags;
    
    // Kommentare abrufen
    const [comments] = await connection.execute(`
      SELECT id, author_name, content, created_at
      FROM comments
      WHERE post_id = ? AND status = 'approved'
      ORDER BY created_at DESC
    `, [post.id]);
    
    post.comments = comments;
    
    return post;
  } catch (error) {
    console.error('Fehler beim Abrufen des Beitrags:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Kategorien abrufen
async function getCategories() {
  return executeQuery(async (connection) => {
    const [categories] = await connection.execute(`
      SELECT c.*, COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
      GROUP BY c.id
      ORDER BY c.name
    `);
    
    return categories;
  });
}

// Beitrag erstellen
async function createPost(postData, userId) {
  const connection = await createConnection();
  
  try {
    await connection.beginTransaction();
    
    // Slug aus dem Titel generieren
    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
    
    // Beitrag einfügen
    const [result] = await connection.execute(`
      INSERT INTO posts (
        title, slug, excerpt, content, image, category_id, author_id, status, meta_title, meta_description
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      postData.title,
      slug,
      postData.excerpt || null,
      postData.content,
      postData.image || null,
      postData.category_id || null,
      userId,
      postData.status || 'draft',
      postData.meta_title || null,
      postData.meta_description || null
    ]);
    
    const postId = result.insertId;
    
    // Tags verarbeiten, wenn vorhanden
    if (postData.tags && postData.tags.length > 0) {
      const tags = postData.tags.split(',').map(tag => tag.trim());
      
      for (const tagName of tags) {
        if (!tagName) continue;
        
        // Slug für den Tag generieren
        const tagSlug = tagName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        
        // Prüfen, ob der Tag bereits existiert
        const [existingTags] = await connection.execute(
          'SELECT id FROM tags WHERE slug = ?',
          [tagSlug]
        );
        
        let tagId;
        
        if (existingTags.length > 0) {
          tagId = existingTags[0].id;
        } else {
          // Neuen Tag erstellen
          const [tagResult] = await connection.execute(
            'INSERT INTO tags (name, slug) VALUES (?, ?)',
            [tagName, tagSlug]
          );
          tagId = tagResult.insertId;
        }
        
        // Verknüpfung zwischen Beitrag und Tag erstellen
        await connection.execute(
          'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
          [postId, tagId]
        );
      }
    }
    
    await connection.commit();
    
    return { id: postId, slug };
  } catch (error) {
    await connection.rollback();
    console.error('Fehler beim Erstellen des Beitrags:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Beitrag aktualisieren
async function updatePost(postId, postData) {
  const connection = await createConnection();
  
  try {
    await connection.beginTransaction();
    
    // Beitrag aktualisieren
    await connection.execute(`
      UPDATE posts SET
        title = ?,
        excerpt = ?,
        content = ?,
        image = ?,
        category_id = ?,
        status = ?,
        meta_title = ?,
        meta_description = ?
      WHERE id = ?
    `, [
      postData.title,
      postData.excerpt || null,
      postData.content,
      postData.image || null,
      postData.category_id || null,
      postData.status || 'draft',
      postData.meta_title || null,
      postData.meta_description || null,
      postId
    ]);
    
    // Bestehende Tag-Verknüpfungen entfernen
    await connection.execute('DELETE FROM post_tags WHERE post_id = ?', [postId]);
    
    // Tags verarbeiten, wenn vorhanden
    if (postData.tags && postData.tags.length > 0) {
      const tags = postData.tags.split(',').map(tag => tag.trim());
      
      for (const tagName of tags) {
        if (!tagName) continue;
        
        // Slug für den Tag generieren
        const tagSlug = tagName
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
        
        // Prüfen, ob der Tag bereits existiert
        const [existingTags] = await connection.execute(
          'SELECT id FROM tags WHERE slug = ?',
          [tagSlug]
        );
        
        let tagId;
        
        if (existingTags.length > 0) {
          tagId = existingTags[0].id;
        } else {
          // Neuen Tag erstellen
          const [tagResult] = await connection.execute(
            'INSERT INTO tags (name, slug) VALUES (?, ?)',
            [tagName, tagSlug]
          );
          tagId = tagResult.insertId;
        }
        
        // Verknüpfung zwischen Beitrag und Tag erstellen
        await connection.execute(
          'INSERT INTO post_tags (post_id, tag_id) VALUES (?, ?)',
          [postId, tagId]
        );
      }
    }
    
    await connection.commit();
    
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Fehler beim Aktualisieren des Beitrags:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Beitrag löschen
async function deletePost(postId) {
  const connection = await createConnection();
  
  try {
    await connection.execute('DELETE FROM posts WHERE id = ?', [postId]);
    return true;
  } catch (error) {
    console.error('Fehler beim Löschen des Beitrags:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// No exports here - moved to the end of the file

// Kommentar hinzufügen
async function addComment(postId, commentData) {
  const connection = await createConnection();
  
  try {
    await connection.execute(`
      INSERT INTO comments (post_id, author_name, author_email, content)
      VALUES (?, ?, ?, ?)
    `, [
      postId,
      commentData.author_name,
      commentData.author_email,
      commentData.content
    ]);
    
    return true;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Kommentars:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Newsletter-Abonnent hinzufügen
async function addSubscriber(email) {
  const connection = await createConnection();
  
  try {
    await connection.execute(`
      INSERT INTO subscribers (email)
      VALUES (?)
      ON DUPLICATE KEY UPDATE status = 'active'
    `, [email]);
    
    return true;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Abonnenten:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Benutzer authentifizieren
async function authenticateUser(email, password) {
  const connection = await createConnection();
  
  try {
    const [users] = await connection.execute(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return null;
    }
    
    const user = users[0];
    
    const bcrypt = await import('bcrypt');
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return null;
    }
    
    // Passwort aus dem Objekt entfernen, bevor es zurückgegeben wird
    delete user.password;
    
    return user;
  } catch (error) {
    console.error('Fehler bei der Authentifizierung:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Suche in Beiträgen
async function searchPosts(query) {
  const connection = await createConnection();
  
  try {
    const searchTerm = `%${query}%`;
    
    const [posts] = await connection.execute(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, u.name as author_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.status = 'published' AND (
        p.title LIKE ? OR
        p.excerpt LIKE ? OR
        p.content LIKE ?
      )
      ORDER BY p.created_at DESC
      LIMIT 20
    `, [searchTerm, searchTerm, searchTerm]);
    
    return posts;
  } catch (error) {
    console.error('Fehler bei der Suche:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

export {
  createConnection,
  executeQuery,
  initializeDatabase,
  getPosts,
  getPostBySlug,
  getCategories,
  createPost,
  updatePost,
  deletePost,
  addComment,
  addSubscriber,
  authenticateUser,
  searchPosts
};