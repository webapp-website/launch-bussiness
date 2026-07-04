/*
# Add webapp data to websites

1. Modified Tables
- `websites` table
  - Add `webapp_data` jsonb column to store web app page configuration
  - Structure: { appName, tagline, description, features: [], downloadLink, previewImage }
  - Add `webapp_content` text for web app page headline

2. Notes
- webapp_data defaults to empty jsonb object
- All existing websites will have webapp page disabled by default (in pages column)
*/

ALTER TABLE websites
ADD COLUMN IF NOT EXISTS webapp_data jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS webapp_content text;
