USE bakka_training_center;

ALTER TABLE roles
  ADD COLUMN IF NOT EXISTS description VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS full_name VARCHAR(160) NULL,
  ADD COLUMN IF NOT EXISTS last_login_at DATETIME NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS date_of_birth DATE NULL,
  ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(160) NULL,
  ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(30) NULL,
  ADD COLUMN IF NOT EXISTS registered_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD KEY ix_students_name (full_name),
  ADD KEY ix_students_status (status);

ALTER TABLE staff
  ADD COLUMN IF NOT EXISTS email VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(30) NULL,
  ADD COLUMN IF NOT EXISTS hire_date DATE NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD KEY ix_staff_name (full_name),
  ADD KEY ix_staff_status (status);

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS description TEXT NULL,
  ADD COLUMN IF NOT EXISTS category VARCHAR(80) NULL,
  ADD COLUMN IF NOT EXISTS duration VARCHAR(50) NULL,
  ADD COLUMN IF NOT EXISTS fee DECIMAL(10,2) NULL,
  ADD COLUMN IF NOT EXISTS prerequisites TEXT NULL,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD KEY ix_courses_status (status),
  ADD KEY ix_courses_title (title);

ALTER TABLE batches
  ADD COLUMN IF NOT EXISTS start_date DATE NULL,
  ADD COLUMN IF NOT EXISTS end_date DATE NULL,
  ADD COLUMN IF NOT EXISTS capacity INT UNSIGNED NOT NULL DEFAULT 25,
  ADD COLUMN IF NOT EXISTS schedule TEXT NULL,
  ADD COLUMN IF NOT EXISTS location VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS online_url VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD KEY ix_batches_course_status (course_id, status);

CREATE TABLE IF NOT EXISTS batch_staff (
  batch_id INT NOT NULL,
  staff_id INT NOT NULL,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (batch_id, staff_id),
  KEY ix_batch_staff_staff (staff_id),
  CONSTRAINT fk_batch_staff_batch FOREIGN KEY (batch_id) REFERENCES batches (id),
  CONSTRAINT fk_batch_staff_staff FOREIGN KEY (staff_id) REFERENCES staff (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE enrollments
  ADD COLUMN IF NOT EXISTS created_by INT NULL,
  ADD COLUMN IF NOT EXISTS approved_by INT NULL,
  ADD COLUMN IF NOT EXISTS approved_at DATETIME NULL,
  ADD COLUMN IF NOT EXISTS notes TEXT NULL,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS active_batch_id INT
    GENERATED ALWAYS AS (CASE WHEN status IN ('pending', 'approved', 'active') THEN batch_id ELSE NULL END) STORED,
  ADD KEY ix_enrollments_student (student_id, status),
  ADD KEY ix_enrollments_batch (batch_id, status),
  ADD KEY ix_enrollments_approver (approved_by),
  ADD CONSTRAINT fk_enrollments_creator FOREIGN KEY (created_by) REFERENCES users (id),
  ADD CONSTRAINT fk_enrollments_approver FOREIGN KEY (approved_by) REFERENCES users (id);

SET @drop_legacy_enrollment_unique = IF(
  EXISTS (
    SELECT 1 FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'enrollments'
      AND index_name = 'unique_student_batch'
  ),
  'ALTER TABLE enrollments DROP INDEX unique_student_batch',
  'SELECT 1'
);
PREPARE drop_legacy_enrollment_unique_stmt FROM @drop_legacy_enrollment_unique;
EXECUTE drop_legacy_enrollment_unique_stmt;
DEALLOCATE PREPARE drop_legacy_enrollment_unique_stmt;

SET @add_active_enrollment_unique = IF(
  EXISTS (
    SELECT 1 FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'enrollments'
      AND index_name = 'uq_enrollments_active_batch'
  ),
  'SELECT 1',
  'ALTER TABLE enrollments ADD UNIQUE KEY uq_enrollments_active_batch (student_id, active_batch_id)'
);
PREPARE add_active_enrollment_unique_stmt FROM @add_active_enrollment_unique;
EXECUTE add_active_enrollment_unique_stmt;
DEALLOCATE PREPARE add_active_enrollment_unique_stmt;

ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS ends_at DATETIME NULL,
  ADD COLUMN IF NOT EXISTS location VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'scheduled',
  ADD COLUMN IF NOT EXISTS created_by INT NULL,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD KEY ix_sessions_batch_start (batch_id, starts_at),
  ADD CONSTRAINT fk_sessions_creator FOREIGN KEY (created_by) REFERENCES users (id);

ALTER TABLE attendance
  ADD COLUMN IF NOT EXISTS notes VARCHAR(500) NULL,
  ADD COLUMN IF NOT EXISTS recorded_by INT NULL,
  ADD COLUMN IF NOT EXISTS marked_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  ADD KEY ix_attendance_student (student_id, status),
  ADD CONSTRAINT fk_attendance_recorder FOREIGN KEY (recorded_by) REFERENCES users (id);

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

INSERT IGNORE INTO system_settings (setting_key, setting_value)
VALUES
  ('timezone', 'Africa/Mogadishu'),
  ('certificate_completion_rules', 'Configure completion requirements before certificate issuance.');

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
