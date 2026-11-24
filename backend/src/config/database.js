const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.DATABASE_URL || {
  host: "localhost",
  user: "root",
  password: "",
  database: "bakka_training_center",
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
});

module.exports = pool;
