const mysql = require('mysql2'); // import mysql2
const dotenv = require('dotenv').config();

const db = mysql.createConnection( // connect the application to the MySQL database
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: process.env.DB_PASSWORD,
      database: 'employees'
    },
    console.log('Connected to the election database.')
  );

  module.exports = db; // so we can use elsewhere