const mysql = require('mysql2');

//connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '?G0LdF1sHy?',
    database: 'business'
  },
  console.log('Connected to the database!')
);

module.exports = db;