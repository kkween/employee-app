CREATE DATABASE IF NOT EXISTS react_app;

USE react_app;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  position VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

INSERT INTO admins (username, password)
VALUES ('kween', 'test123')
ON DUPLICATE KEY UPDATE username=username;
