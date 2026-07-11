-- Jalankan file SQL ini SEKALI di database kamu (yang sama kaya di config.js
-- bot / lib/config.js website) sebelum pakai fitur Whitelist & Character
-- Story di website.

CREATE TABLE IF NOT EXISTS `wl_web_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_ic` VARCHAR(64) NOT NULL,
  `pin_code` INT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_nama_ic` (`nama_ic`)
);

CREATE TABLE IF NOT EXISTS `cs_web_submissions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_ic` VARCHAR(64) NOT NULL,
  `story_text` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
