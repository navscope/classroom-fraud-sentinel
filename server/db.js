
require('dotenv').config();
const mysql = require('mysql2/promise');

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ai_detection',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function initializeDatabase() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');

    // Create detection_results table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS detection_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        text_hash VARCHAR(64) NOT NULL,
        text_preview VARCHAR(255) NOT NULL,
        ai_probability FLOAT NOT NULL,
        human_probability FLOAT NOT NULL,
        confidence FLOAT NOT NULL,
        suggested_action TEXT,
        flagged_sentences JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (text_hash)
      )
    `);

    console.log('Database initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

module.exports = {
  pool,
  initializeDatabase
};
