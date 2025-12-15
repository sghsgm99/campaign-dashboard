CREATE TABLE IF NOT EXISTS adgroups (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  campaign_id BIGINT UNSIGNED NOT NULL,

  name VARCHAR(255) NOT NULL,

  status ENUM('ENABLED', 'PAUSED', 'REMOVED')
    NOT NULL DEFAULT 'PAUSED',

  type ENUM(
    'SEARCH_STANDARD',
    'DISPLAY_STANDARD',
    'SHOPPING_STANDARD',
    'VIDEO_TRUEVIEW'
  ) NOT NULL,

  cpc_bid DECIMAL(12,4) NULL,

  google_adgroup_id BIGINT UNSIGNED NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_adgroups_campaign
    FOREIGN KEY (campaign_id)
    REFERENCES campaigns(id)
    ON DELETE CASCADE,

  INDEX idx_campaign_id (campaign_id),
  INDEX idx_status (status),
  INDEX idx_type (type),
  INDEX idx_google_adgroup_id (google_adgroup_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
