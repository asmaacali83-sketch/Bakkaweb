require("dotenv").config();
const bcrypt = require("bcryptjs");
const mysql = require("mysql2/promise");

async function init() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const statements = [
    `CREATE TABLE IF NOT EXISTS roles (
      id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE
    )`,
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY, role_id INT NOT NULL, email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (role_id) REFERENCES roles(id)
    )`,
    `CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NULL, student_number VARCHAR(30) NOT NULL UNIQUE,
      full_name VARCHAR(160) NOT NULL, phone VARCHAR(30), address VARCHAR(255),
      status VARCHAR(20) NOT NULL DEFAULT 'active',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS staff (
      id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NULL, staff_number VARCHAR(30) NOT NULL UNIQUE,
      full_name VARCHAR(160) NOT NULL, job_title VARCHAR(100), status VARCHAR(20) NOT NULL DEFAULT 'active',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )`,
    `CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(160) NOT NULL, code VARCHAR(30) NOT NULL UNIQUE,
      category VARCHAR(80), duration VARCHAR(50), status VARCHAR(20) NOT NULL DEFAULT 'draft'
    )`,
    `CREATE TABLE IF NOT EXISTS batches (
      id INT AUTO_INCREMENT PRIMARY KEY, course_id INT NOT NULL, name VARCHAR(100) NOT NULL,
      code VARCHAR(40) NOT NULL UNIQUE, start_date DATE, end_date DATE, capacity INT NOT NULL DEFAULT 25,
      status VARCHAR(20) NOT NULL DEFAULT 'draft',
      FOREIGN KEY (course_id) REFERENCES courses(id)
    )`,
    `CREATE TABLE IF NOT EXISTS enrollments (
      id INT AUTO_INCREMENT PRIMARY KEY, student_id INT NOT NULL, batch_id INT NOT NULL,
      status VARCHAR(20) NOT NULL DEFAULT 'pending', created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_student_batch (student_id, batch_id),
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (batch_id) REFERENCES batches(id)
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id INT AUTO_INCREMENT PRIMARY KEY, batch_id INT NOT NULL, title VARCHAR(160),
      starts_at DATETIME NOT NULL, ends_at DATETIME,
      FOREIGN KEY (batch_id) REFERENCES batches(id)
    )`,
    `CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY, session_id INT NOT NULL, student_id INT NOT NULL,
      status VARCHAR(20) NOT NULL,
      UNIQUE KEY unique_attendance (session_id, student_id),
      FOREIGN KEY (session_id) REFERENCES sessions(id),
      FOREIGN KEY (student_id) REFERENCES students(id)
    )`,
  ];
  for (const statement of statements) {
    await connection.query(statement);
  }

  await connection.query("INSERT IGNORE INTO roles (name) VALUES ('admin'), ('staff'), ('student')");
  if (process.env.NODE_ENV !== "production") {
    const password = await bcrypt.hash("Admin@123", 12);
    await connection.execute(
      "INSERT IGNORE INTO users (role_id,email,password_hash,status) SELECT id,?, ?, 'active' FROM roles WHERE name='admin'",
      ["admin@bakka.training", password],
    );
  }
  await connection.end();
  console.log("Database initialized");
}

init().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
