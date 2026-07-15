-- AI Recruitment App — Database Init
-- Chạy trong phpMyAdmin: http://localhost/phpmyadmin

CREATE DATABASE IF NOT EXISTS recruitment_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE recruitment_db;

-- Bảng users
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  full_name  VARCHAR(100)  NOT NULL,
  email      VARCHAR(100)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  role       ENUM('candidate','recruiter','admin') DEFAULT 'candidate',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng jobs
CREATE TABLE IF NOT EXISTS jobs (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  description  TEXT         NOT NULL,
  requirements TEXT,
  salary_min   INT,
  salary_max   INT,
  location     VARCHAR(100),
  status       ENUM('draft','active','closed') DEFAULT 'active',
  recruiter_id INT          NOT NULL,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bảng applications
CREATE TABLE IF NOT EXISTS applications (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  job_id       INT          NOT NULL,
  candidate_id INT          NOT NULL,
  cv_path      VARCHAR(255),
  cover_letter TEXT,
  status       ENUM('applied','screening','interview','offer','hired','rejected') DEFAULT 'applied',
  ai_score     INT,
  ai_feedback  TEXT,
  created_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id)       REFERENCES jobs(id)  ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY uq_application (job_id, candidate_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed: 1 admin account (password: Admin@123)
INSERT IGNORE INTO users (full_name, email, password, role) VALUES
('Admin System', 'admin@recruitment.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

SELECT 'Database khởi tạo thành công!' AS message;
