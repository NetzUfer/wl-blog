# LifestyleBlog - Moderner Webblog mit Astro

Ein moderner Lifestyle-Blog mit eigenem Backend, erstellt mit Astro, Tailwind CSS und MySQL.

## Funktionen

- Responsive Design mit Pastellfarben (rosa, beige)
- Admin-Bereich zum Verwalten von Beiträgen, Kategorien und Inhalten
- Suchfunktion für Blogbeiträge
- Newsletter-Anmeldung mit Anbindung an Mail-Service
- Fortschrittsanzeige im Footer
- Kontaktformular mit E-Mail-Versand
- SEO-optimiert

## Technologien

- Frontend: Astro mit Tailwind CSS
- Backend: Node.js mit MySQL-Datenbank
- Authentifizierung: bcrypt für Passwort-Hashing
- E-Mail-Versand: nodemailer

## Installation

### Voraussetzungen

- Node.js (v16 oder höher)
- MySQL-Datenbank

### Schritte

1. Repository klonen

```bash
git clone https://github.com/username/lifestyle-blog.git
cd lifestyle-blog
```

2. Abhängigkeiten installieren

```bash
npm install
```

3. Umgebungsvariablen konfigurieren

Erstelle eine `.env`-Datei im Hauptverzeichnis mit folgenden Variablen:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=dein_passwort
DB_NAME=lifestyle_blog

MAIL_HOST=smtp.example.com
MAIL_PORT=587
MAIL_USER=deine_email@example.com
MAIL_PASSWORD=dein_mail_passwort
```

4. Datenbank erstellen

Erstelle eine MySQL-Datenbank mit dem Namen `lifestyle_blog`.

5. Entwicklungsserver starten

```bash
npm run dev
```

Die Anwendung ist nun unter `http://localhost:3000` verfügbar.

## Produktionsumgebung

Um die Anwendung für die Produktion zu bauen:

```bash
npm run build
```

Um die gebaute Anwendung zu starten:

```bash
npm run start
```

## Admin-Bereich

Der Admin-Bereich ist unter `/admin` erreichbar. Die Standardanmeldedaten sind:

- E-Mail: admin@lifestyleblog.de
- Passwort: admin123

**Wichtig:** Ändere das Passwort nach der ersten Anmeldung!

## Anpassung

### Farben

Die Farbpalette kann in der Datei `tailwind.config.mjs` angepasst werden:

```js
colors: {
  primary: '#f8b0c2', // Rosa
  secondary: '#f5e6d8', // Beige
  accent: '#ff7bac', // Dunkleres Rosa für Akzente
  dark: '#333333',
  light: '#ffffff'
}
```

### Kategorien

Die Standardkategorien werden bei der Initialisierung der Datenbank erstellt. Weitere Kategorien können im Admin-Bereich hinzugefügt werden.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.