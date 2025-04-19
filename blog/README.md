# Lifestyle Blog

## Fehlerbehebung: Datenbankverbindung

Wenn Sie den Fehler `connect ETIMEDOUT` erhalten, bedeutet dies, dass die Anwendung keine Verbindung zur Datenbank herstellen kann. Hier sind die Schritte zur Behebung:

### 1. Lokale Entwicklungsumgebung einrichten

Für die lokale Entwicklung empfehlen wir, eine lokale MySQL-Datenbank zu verwenden:

- Installieren Sie [XAMPP](https://www.apachefriends.org/de/index.html), [MAMP](https://www.mamp.info/) oder [MySQL](https://dev.mysql.com/downloads/) direkt
- Erstellen Sie eine neue Datenbank namens `blog_db`
- Passen Sie die `.env`-Datei an Ihre lokale Konfiguration an

### 2. Datenbankverbindung testen

Verwenden Sie den folgenden Befehl, um die Datenbankverbindung zu testen:

```bash
npm install dotenv  # Falls noch nicht installiert
npm run test-db
```

### 3. Umgebungsvariablen konfigurieren

Stellen Sie sicher, dass Ihre `.env`-Datei korrekt konfiguriert ist. Für die lokale Entwicklung:

```
DB_HOST=localhost
DB_USER=root  # Oder Ihr lokaler MySQL-Benutzername
DB_PASSWORD=   # Ihr lokales MySQL-Passwort (leer lassen, wenn keines gesetzt ist)
DB_NAME=blog_db
```

Für die Produktion:

```
DB_HOST=database-5017695371.ud-webspace.de
DB_USER=dbu1921258
DB_PASSWORD=Schirema05042025!
DB_NAME=dbs14147259
```

### 4. Netzwerkprobleme beheben

Wenn Sie auf einen Remote-Datenbankserver zugreifen:

- Überprüfen Sie, ob der Server erreichbar ist
- Stellen Sie sicher, dass keine Firewall den Zugriff blockiert
- Kontaktieren Sie Ihren Hosting-Anbieter, um zu prüfen, ob der Datenbankserver funktioniert

### 5. Anwendung starten

Nachdem die Datenbankverbindung hergestellt wurde, können Sie die Anwendung starten:

```bash
npm run dev  # Für Entwicklung
# oder
npm run build && npm run start  # Für Produktion
```

## Weitere Informationen

Für weitere Hilfe oder Fragen wenden Sie sich bitte an das Entwicklungsteam.