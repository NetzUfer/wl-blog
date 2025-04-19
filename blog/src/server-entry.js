// This file is used as the entry point for the server adapter
import { handler as ssrHandler } from '../dist/server/entry.mjs';
import { initializeDatabase } from './backend/db.js';

// Initialize the database when the server starts
let dbInitialized = false;

async function initDb() {
  if (dbInitialized) return;
  
  try {
    await initializeDatabase();
    console.log('Database initialized successfully');
    dbInitialized = true;
  } catch (err) {
    console.error('Failed to initialize database:', err);
    // We'll continue even if the database fails to initialize
    // This allows the static parts of the site to work
  }
}

// Custom handler that initializes the database before handling requests
export const handler = async (request, context) => {
  // Try to initialize the database, but don't block the request if it fails
  if (!dbInitialized) {
    initDb().catch(err => console.error('Background database initialization failed:', err));
  }
  
  // Process the request with the SSR handler
  return ssrHandler(request, context);
};