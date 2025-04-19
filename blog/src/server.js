// Server utilities
import { initializeDatabase } from './backend/db.js';

// Function to initialize the server
export async function initializeServer() {
  try {
    await initializeDatabase();
    console.log('Server initialized and database connected');
    return true;
  } catch (error) {
    console.error('Failed to initialize server:', error);
    return false;
  }
}