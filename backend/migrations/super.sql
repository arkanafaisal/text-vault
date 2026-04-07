-- SOURCE D:/arkana/project/1.dataBox/backend/migrations/super.sql;

/*

migrations merge done:
001
002
003
004
005

*/

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  display_name VARCHAR(30) NOT NULL,
  username VARCHAR(30) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  publicKey VARCHAR(255),
);


CREATE TABLE data (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userId BIGINT UNSIGNED NOT NULL,

  title VARCHAR(31) NOT NULL,
  content VARCHAR(1000) NOT NULL,

  isLocked BOOLEAN NOT NULL DEFAULT TRUE,
  tags JSON NOT NULL,

  expiresAt TIMESTAMP NULL,

  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_user (userId),
  INDEX idx_user_updated (userId, updatedAt DESC),
  INDEX idx_expires (expiresAt),

  CONSTRAINT fk_data_user
    FOREIGN KEY (userId) REFERENCES users(id)
    ON DELETE CASCADE
);
