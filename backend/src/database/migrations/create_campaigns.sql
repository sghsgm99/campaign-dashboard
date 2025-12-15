CREATE TABLE IF NOT EXISTS campaigns (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  name VARCHAR(255) NOT NULL,
  status ENUM('ENABLED', 'PAUSED', 'REMOVED') NOT NULL DEFAULT 'PAUSED',
  channel_type ENUM(
    'SEARCH',
    'DISPLAY',
    'VIDEO',
    'SHOPPING',
    'PERFORMANCE_MAX'
  ) NOT NULL,
  
  budget DECIMAL(12,2) NOT NULL,

  google_campaign_id BIGINT UNSIGNED NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_status (status),
  INDEX idx_channel_type (channel_type),
  INDEX idx_google_campaign_id (google_campaign_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
