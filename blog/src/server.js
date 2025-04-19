// Server-Initialisierung
import { initializeDatabase } from './backend/db.js';

// Datenbank beim Serverstart initialisieren
initializeDatabase();

console.log('Server initialized and database connected');