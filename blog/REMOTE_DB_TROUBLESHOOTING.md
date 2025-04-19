# Fehlerbehebung für Remote-Datenbankverbindungen

Wenn Sie Probleme mit der Verbindung zu Ihrer Remote-Datenbank haben, folgen Sie dieser Anleitung zur Fehlerbehebung.

## Häufige Fehlermeldungen und Lösungen

### 1. "Verbindung abgelehnt: Der Datenbankserver ist nicht erreichbar oder läuft nicht."

**Mögliche Ursachen:**
- Der Datenbankserver ist nicht online
- Die Firewall blockiert die Verbindung
- Der Hostname ist falsch
- Der Port ist blockiert

**Lösungen:**

1. **Überprüfen Sie, ob der Server erreichbar ist:**
   ```
   ping database-5017695371.ud-webspace.de
   ```
   Wenn der Ping nicht funktioniert, ist der Server möglicherweise nicht erreichbar.

2. **Kontaktieren Sie Ihren Hosting-Anbieter:**
   - Fragen Sie, ob der MySQL-Server läuft
   - Überprüfen Sie, ob Wartungsarbeiten durchgeführt werden
   - Bestätigen Sie, dass Ihre IP-Adresse Zugriff auf den Datenbankserver hat

3. **Überprüfen Sie die Firewall-Einstellungen:**
   - Stellen Sie sicher, dass ausgehende Verbindungen zum MySQL-Port (normalerweise 3306) erlaubt sind

### 2. "Verbindungs-Timeout: Die Datenbank ist nicht erreichbar."

**Mögliche Ursachen:**
- Langsame Internetverbindung
- Der Server ist überlastet
- Netzwerkprobleme

**Lösungen:**

1. **Erhöhen Sie den Timeout-Wert:**
   - In der db.js-Datei wurde der Timeout bereits auf 60 Sekunden erhöht
   - Bei Bedarf können Sie diesen Wert weiter erhöhen

2. **Überprüfen Sie Ihre Internetverbindung:**
   - Testen Sie die Verbindung zu anderen Websites
   - Starten Sie Ihren Router neu

### 3. "Zugriff verweigert: Überprüfen Sie Benutzername und Passwort."

**Lösungen:**

1. **Überprüfen Sie die Zugangsdaten in der .env-Datei:**
   - Stellen Sie sicher, dass Benutzername und Passwort korrekt sind
   - Achten Sie auf Groß- und Kleinschreibung

2. **Kontaktieren Sie Ihren Hosting-Anbieter:**
   - Fragen Sie nach den korrekten Zugangsdaten
   - Lassen Sie das Passwort zurücksetzen, falls nötig

## Testen der Verbindung

Verwenden Sie den folgenden Befehl, um die Verbindung zu Ihrer Remote-Datenbank zu testen:

```bash
npm run test-remote-db
```

Dieses Skript wird versuchen, eine Verbindung herzustellen und grundlegende Informationen über Ihre Datenbank anzuzeigen.

## Alternative: Lokale Entwicklung

Wenn Sie weiterhin Probleme mit der Remote-Datenbank haben, können Sie vorübergehend eine lokale Datenbank für die Entwicklung verwenden:

1. **Ändern Sie die .env-Datei:**
   ```
   # Kommentieren Sie die Remote-Datenbank aus
   # DB_HOST=database-5017695371.ud-webspace.de
   # DB_USER=dbu1921258
   # DB_PASSWORD=Schirema05042025!
   # DB_NAME=dbs14147259

   # Aktivieren Sie die lokale Datenbank
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=blog_db
   ```

2. **Installieren Sie einen lokalen MySQL-Server:**
   - XAMPP, MAMP oder MySQL direkt

3. **Erstellen Sie eine lokale Datenbank:**
   ```sql
   CREATE DATABASE blog_db;
   ```

4. **Initialisieren Sie die Datenbank:**
   ```bash
   npm run init-db
   ```

## Kontakt zum Support

Wenn Sie weiterhin Probleme haben, wenden Sie sich an Ihren Hosting-Anbieter oder das Entwicklungsteam für weitere Unterstützung.