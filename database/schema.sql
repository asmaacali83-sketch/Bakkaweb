CREATE DATABASE IF NOT EXISTS bakka_training_center
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bakka_training_center;

CREATE TABLE IF NOT EXISTS roles (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  description VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS permissions (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  code VARCHAR(100) NOT NULL,
  description VARCHAR(255) NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permissions_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT NOT NULL,
  permission_id INT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id) REFERENCES roles (id),
  CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id) REFERENCES permissions (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id INT NOT NULL AUTO_INCREMENT,
  role_id INT NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(160) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  KEY ix_users_role_status (role_id, status),
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS students (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NULL,
  student_number VARCHAR(30) NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(30) NULL,
  address VARCHAR(255) NULL,
  date_of_birth DATE NULL,
  emergency_contact_name VARCHAR(160) NULL,
  emergency_contact_phone VARCHAR(30) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_students_number (student_number),
  KEY ix_students_name (full_name),
  KEY ix_students_status (status),
  CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS staff (
  id INT NOT NULL AUTO_INCREMENT,
  user_id INT NULL,
  staff_number VARCHAR(30) NOT NULL,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(30) NULL,
  job_title VARCHAR(100) NULL,
  hire_date DATE NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_staff_number (staff_number),
  KEY ix_staff_name (full_name),
  KEY ix_staff_status (status),
  CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS courses (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(160) NOT NULL,
  code VARCHAR(30) NOT NULL,
  description TEXT NULL,
  category VARCHAR(80) NULL,
  duration VARCHAR(50) NULL,
  fee DECIMAL(10,2) NULL,
  prerequisites TEXT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_courses_code (code),
  KEY ix_courses_status (status),
  KEY ix_courses_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS batches (
  id INT NOT NULL AUTO_INCREMENT,
  course_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(40) NOT NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  capacity INT UNSIGNED NOT NULL DEFAULT 25,
  schedule TEXT NULL,
  location VARCHAR(255) NULL,
  online_url VARCHAR(500) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_batches_code (code),
  KEY ix_batches_course_status (course_id, status),
  CONSTRAINT fk_batches_course FOREIGN KEY (course_id) REFERENCES courses (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS batch_staff (
  batch_id INT NOT NULL,
  staff_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (batch_id, staff_id),
  KEY ix_batch_staff_staff (staff_id),
  CONSTRAINT fk_batch_staff_batch FOREIGN KEY (batch_id) REFERENCES batches (id),
  CONSTRAINT fk_batch_staff_staff FOREIGN KEY (staff_id) REFERENCES staff (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS enrollments (
  id INT NOT NULL AUTO_INCREMENT,
  student_id INT NOT NULL,
  batch_id INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  created_by INT NULL,
  approved_by INT NULL,
  approved_at DATETIME NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_enrollments_student (student_id, status),
  KEY ix_enrollments_batch (batch_id, status),
  KEY ix_enrollments_approver (approved_by),
  CONSTRAINT fk_enrollments_student FOREIGN KEY (student_id) REFERENCES students (id),
  CONSTRAINT fk_enrollments_batch FOREIGN KEY (batch_id) REFERENCES batches (id),
  CONSTRAINT fk_enrollments_creator FOREIGN KEY (created_by) REFERENCES users (id),
  CONSTRAINT fk_enrollments_approver FOREIGN KEY (approved_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id INT NOT NULL AUTO_INCREMENT,
  batch_id INT NOT NULL,
  title VARCHAR(160) NULL,
  starts_at DATETIME NOT NULL,
  ends_at DATETIME NULL,
  location VARCHAR(255) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_sessions_batch_start (batch_id, starts_at),
  CONSTRAINT fk_sessions_batch FOREIGN KEY (batch_id) REFERENCES batches (id),
  CONSTRAINT fk_sessions_creator FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendance (
  id INT NOT NULL AUTO_INCREMENT,
  session_id INT NOT NULL,
  student_id INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  notes VARCHAR(500) NULL,
  recorded_by INT NULL,
  marked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_attendance_session_student (session_id, student_id),
  KEY ix_attendance_student (student_id, status),
  CONSTRAINT fk_attendance_session FOREIGN KEY (session_id) REFERENCES sessions (id),
  CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) REFERENCES students (id),
  CONSTRAINT fk_attendance_recorder FOREIGN KEY (recorded_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attendance_history (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  attendance_id INT NOT NULL,
  old_status VARCHAR(20) NULL,
  new_status VARCHAR(20) NOT NULL,
  changed_by INT NULL,
  changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_attendance_history_record (attendance_id, changed_at),
  CONSTRAINT fk_attendance_history_record FOREIGN KEY (attendance_id) REFERENCES attendance (id),
  CONSTRAINT fk_attendance_history_actor FOREIGN KEY (changed_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS assessments (
  id INT NOT NULL AUTO_INCREMENT,
  batch_id INT NOT NULL,
  title VARCHAR(160) NOT NULL,
  description TEXT NULL,
  max_score DECIMAL(8,2) NULL,
  due_at DATETIME NULL,
  published_at DATETIME NULL,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_assessments_batch (batch_id),
  CONSTRAINT fk_assessments_batch FOREIGN KEY (batch_id) REFERENCES batches (id),
  CONSTRAINT fk_assessments_creator FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS results (
  id INT NOT NULL AUTO_INCREMENT,
  assessment_id INT NOT NULL,
  student_id INT NOT NULL,
  score DECIMAL(8,2) NULL,
  feedback TEXT NULL,
  recorded_by INT NULL,
  recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_results_assessment_student (assessment_id, student_id),
  KEY ix_results_student (student_id),
  CONSTRAINT fk_results_assessment FOREIGN KEY (assessment_id) REFERENCES assessments (id),
  CONSTRAINT fk_results_student FOREIGN KEY (student_id) REFERENCES students (id),
  CONSTRAINT fk_results_recorder FOREIGN KEY (recorded_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS certificates (
  id INT NOT NULL AUTO_INCREMENT,
  enrollment_id INT NOT NULL,
  certificate_number VARCHAR(60) NOT NULL,
  verification_code CHAR(64) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
  issued_by INT NULL,
  issued_at DATETIME NULL,
  revoked_by INT NULL,
  revoked_at DATETIME NULL,
  revocation_reason TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_certificates_number (certificate_number),
  UNIQUE KEY uq_certificates_verification (verification_code),
  KEY ix_certificates_enrollment_status (enrollment_id, status),
  CONSTRAINT fk_certificates_enrollment FOREIGN KEY (enrollment_id) REFERENCES enrollments (id),
  CONSTRAINT fk_certificates_issuer FOREIGN KEY (issued_by) REFERENCES users (id),
  CONSTRAINT fk_certificates_revoker FOREIGN KEY (revoked_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS announcements (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(180) NOT NULL,
  body TEXT NOT NULL,
  audience VARCHAR(20) NOT NULL DEFAULT 'all',
  batch_id INT NULL,
  published_at DATETIME NULL,
  created_by INT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_announcements_published (published_at, audience),
  CONSTRAINT fk_announcements_batch FOREIGN KEY (batch_id) REFERENCES batches (id),
  CONSTRAINT fk_announcements_creator FOREIGN KEY (created_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  actor_user_id INT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(80) NOT NULL,
  target_id VARCHAR(80) NULL,
  metadata JSON NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_audit_actor_time (actor_user_id, created_at),
  KEY ix_audit_target (target_type, target_id),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS system_settings (
  setting_key VARCHAR(100) NOT NULL,
  setting_value TEXT NOT NULL,
  updated_by INT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (setting_key),
  CONSTRAINT fk_settings_updater FOREIGN KEY (updated_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id INT NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  used_at DATETIME NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_password_reset_hash (token_hash),
  KEY ix_password_reset_user (user_id, expires_at),
  CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO roles (name) VALUES
  ('admin'),
  ('staff'),
  ('student');

INSERT IGNORE INTO permissions (code, description) VALUES
  ('students.read', 'View authorized student records'),
  ('students.create', 'Create student records'),
  ('students.update', 'Update authorized student records'),
  ('staff.manage', 'Manage staff accounts and assignments'),
  ('courses.manage', 'Manage courses and batches'),
  ('enrollments.read', 'View authorized enrollments'),
  ('enrollments.create', 'Create enrollments'),
  ('enrollments.approve', 'Approve or reject enrollments'),
  ('attendance.read', 'View authorized attendance'),
  ('attendance.write', 'Record attendance for assigned batches'),
  ('results.write', 'Record results for assigned batches'),
  ('certificates.review', 'Review certificate requests'),
  ('certificates.issue', 'Issue or revoke certificates'),
  ('reports.read', 'View authorized reports'),
  ('audit.read', 'View audit logs'),
  ('settings.manage', 'Manage system settings and permissions');

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r CROSS JOIN permissions p
WHERE r.name = 'admin';

INSERT IGNORE INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r JOIN permissions p ON p.code IN (
  'students.read', 'students.create', 'students.update',
  'enrollments.read', 'enrollments.create', 'attendance.read',
  'attendance.write', 'results.write', 'certificates.review', 'reports.read'
)
WHERE r.name = 'staff';

INSERT IGNORE INTO system_settings (setting_key, setting_value)
VALUES
  ('timezone', 'Africa/Mogadishu'),
  ('certificate_completion_rules', 'Configure completion requirements before certificate issuance.');
