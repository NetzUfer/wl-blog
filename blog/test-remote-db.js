import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Lade Umgebungsvariablen
dotenv.config();

async function testRemoteConnection() {
  console.log('Teste Verbindung zur Remote-Datenbank...');
  console.log('Verwende folgende Konfiguration:');
  console.log(`Host: ${process.env.DB_HOST}`);
  console.log(`Benutzer: ${process.env.DB_USER}`);
  console.log(`Datenbank: ${process.env.DB_NAME}`);
  
  try {
    // Konfiguration für Remote-Verbindungen
    const config = {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 60000, // 60 Sekunden Timeout
      ssl: process.env.DB_HOST.includes('ud-webspace.de') ? {
        rejectUnauthorized: false
      } : undefined
    };
    
    console.log('\nVerbindung wird hergestellt...');
    const connection = await mysql.createConnection(config);
    
    console.log('\n✅ Verbindung erfolgreich hergestellt!');
    
    // Teste eine einfache Abfrage
    console.log('\nFühre Test-Abfrage aus...');
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ Abfrage erfolgreich ausgeführt:', rows);
    
    // Prüfe, ob die erforderlichen Tabellen existieren
    console.log('\nPrüfe Datenbanktabellen...');
    const [tables] = await connection.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = '${process.env.DB_NAME}'
    `);
    
    if (tables.length > 0) {
      console.log('✅ Gefundene Tabellen:');
      tables.forEach(table => {
        console.log(`  - ${table.TABLE_NAME}`);
      });
    } else {
      console.log('⚠️ Keine Tabellen in der Datenbank gefunden.');
    }
    
    await connection.end();
    console.log('\n✅ Verbindung ordnungsgemäß geschlossen');
    
    return true;
  } catch (error) {
    console.error('\n❌ Verbindung fehlgeschlagen:', error.message);
    
    // Hilfreiche Fehlerbehebungsinformationen
    if (error.code === 'ETIMEDOUT') {
      console.error('\nDie Verbindung wurde zeitlich überschritten. Dies bedeutet in der Regel:');
      console.error('1. Der Datenbankserver ist nicht erreichbar (Netzwerk/Firewall prüfen)');
      console.error('2. Die Host-Adresse ist falsch');
      console.error('3. Der Datenbankserver ist ausgefallen oder akzeptiert keine Verbindungen');
      console.error('\nVersuchen Sie:');
      console.error('- Ping an den Server: ping ' + process.env.DB_HOST);
      console.error('- Prüfen Sie, ob der Hosting-Anbieter Wartungsarbeiten durchführt');
      console.error('- Kontaktieren Sie Ihren Hosting-Anbieter, um zu prüfen, ob der Datenbankserver läuft');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nZugriff verweigert. Dies bedeutet in der Regel:');
      console.error('1. Der Benutzername oder das Passwort ist falsch');
      console.error('2. Der Benutzer hat keine Berechtigung, auf die Datenbank zuzugreifen');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\nDatenbank existiert nicht. Sie müssen:');
      console.error('1. Die Datenbank zuerst erstellen');
      console.error('2. Prüfen, ob der Datenbankname korrekt ist');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nVerbindung abgelehnt. Dies bedeutet in der Regel:');
      console.error('1. Der Datenbankserver läuft nicht');
      console.error('2. Der Port ist falsch oder blockiert');
      console.error('3. Eine Firewall blockiert die Verbindung');
    }
    
    return false;
  }
}

// Führe den Test aus
testRemoteConnection();