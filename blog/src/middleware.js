import { initializeDatabase } from './backend/db.js';

let initialized = false;
let initializationAttempts = 0;
const MAX_ATTEMPTS = 3;

export async function onRequest({ locals, request }, next) {
  // Initialize the database only once
  if (!initialized && initializationAttempts < MAX_ATTEMPTS) {
    try {
      await initializeDatabase();
      console.log('Database initialized successfully');
      initialized = true;
    } catch (error) {
      initializationAttempts++;
      console.error(`Failed to initialize database (attempt ${initializationAttempts}/${MAX_ATTEMPTS}):`, error);
      
      // If we've reached max attempts, we'll continue anyway but log a warning
      if (initializationAttempts >= MAX_ATTEMPTS) {
        console.warn('Maximum database initialization attempts reached. Continuing without database connection.');
      }
    }
  }
  
  // Continue with the request even if database initialization failed
  return next();
}