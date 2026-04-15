ALTER TABLE data
ADD COLUMN visibility ENUM('private', 'public') NOT NULL DEFAULT 'private';