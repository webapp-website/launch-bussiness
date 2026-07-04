/*
# Add pages configuration to websites

1. Modified Tables
- `websites` table
  - Add `pages` jsonb column to store page configuration
  - Structure: { home: boolean, selling: boolean, prize: boolean }
  - Add `selling_content` text for selling page content
  - Add `prize_content` text for prize page content
  - Add `selling_items` jsonb for selling items (name, description, price, image)
  - Add `prize_items` jsonb for prize items (name, description, value)

2. Notes
- Default pages is { home: true, selling: false, prize: false }
- All existing websites will have home page only
*/

ALTER TABLE websites
ADD COLUMN IF NOT EXISTS pages jsonb DEFAULT '{"home": true, "selling": false, "prize": false}'::jsonb,
ADD COLUMN IF NOT EXISTS selling_content text,
ADD COLUMN IF NOT EXISTS prize_content text,
ADD COLUMN IF NOT EXISTS selling_items jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS prize_items jsonb DEFAULT '[]'::jsonb;
