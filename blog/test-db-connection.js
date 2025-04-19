import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
  console.log('Testing database connection...');
  console.log('Using the following configuration:');
  console.log(`Host: ${process.env.DB_HOST || 'localhost'}`);
  console.log(`User: ${process.env.DB_USER || 'root'}`);
  console.log(`Database: ${process.env.DB_NAME || 'blog_db'}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'blog_db',
      connectTimeout: 30000, // 30 seconds timeout
    });
    
    console.log('\n✅ Connection successful!');
    
    // Test a simple query
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('\n✅ Query executed successfully:', rows);
    
    await connection.end();
    console.log('\n✅ Connection closed properly');
    
    return true;
  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    
    // Provide helpful troubleshooting information
    if (error.code === 'ETIMEDOUT') {
      console.error('\nThe connection timed out. This usually means one of the following:');
      console.error('1. The database server is not reachable (check network/firewall)');
      console.error('2. The host address is incorrect');
      console.error('3. The database server is down or not accepting connections');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nAccess denied. This usually means:');
      console.error('1. The username or password is incorrect');
      console.error('2. The user does not have permission to access the database');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error('\nDatabase does not exist. You need to:');
      console.error('1. Create the database first');
      console.error('2. Check if the database name is correct');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('\nConnection refused. This usually means:');
      console.error('1. The database server is not running');
      console.error('2. The port is incorrect or blocked');
      console.error('3. A firewall is blocking the connection');
    }
    
    console.error('\nTroubleshooting steps:');
    console.error('1. Check your .env file for correct database credentials');
    console.error('2. Make sure your database server is running');
    console.error('3. Check if you can connect to the database using another tool');
    console.error('4. Verify network connectivity to the database server');
    
    return false;
  }
}

// Run the test
testConnection();