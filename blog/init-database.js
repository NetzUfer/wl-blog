import { initializeDatabase } from './src/backend/db.js';
import dotenv from 'dotenv';

// Lade Umgebungsvariablen
dotenv.config();

async function init() {
  console.log('Initialisiere Datenbank...');
  try {
    await initializeDatabase();
    console.log('Datenbank erfolgreich initialisiert!');
  } catch (error) {
    console.error('Fehler bei der Datenbankinitialisierung:', error);
  }
}

init();