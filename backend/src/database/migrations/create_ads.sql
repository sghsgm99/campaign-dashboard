CREATE TABLE IF NOT EXISTS ads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,

  adgroup_id BIGINT UNSIGNED NOT NULL,

  ad_type ENUM(
    'RESPONSIVE_SEARCH_AD',
    'EXPANDED_TEXT_AD',
    'DISPLAY_AD',
    'VIDEO_AD'
  ) NOT NULL,

  status ENUM('ENABLED', 'PAUSED', 'REMOVED')
    NOT NULL DEFAULT 'PAUSED',

  headlines JSON NOT NULL,

  descriptions JSON NOT NULL,

  final_url VARCHAR(2048) NOT NULL,

  google_ad_id BIGINT UNSIGNED NULL,

  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_ads_adgroup
    FOREIGN KEY (adgroup_id)
    REFERENCES adgroups(id)
    ON DELETE CASCADE,

  INDEX idx_adgroup_id (adgroup_id),
  INDEX idx_status (status),
  INDEX idx_ad_type (ad_type),
  INDEX idx_google_ad_id (google_ad_id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;
