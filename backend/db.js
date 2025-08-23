// db.js (improved version from previous response)
const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'rootuser',
  database: process.env.DB_NAME || 'react_app', // <-- change default to 'react_app'
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

db.getConnection()
  .then((connection) => {
    console.log('Successfully connected to the database');
    connection.release();
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err.message);
    // process.exit(1); // Uncomment if you want to exit on error
  });

module.exports = db;