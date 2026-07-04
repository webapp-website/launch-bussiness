/*
# Launch Business - Database Schema

1. New Tables
- `profiles` (user data extending auth.users)
  - id (uuid, PK, references auth.users)
  - email (text)
  - sub_status (text: 'free', 'premium_500', 'premium_1000', 'premium_1500')
  - websites_count (int, default 0)
  - created_at (timestamp)
  
- `websites` (business landing pages)
  - id (uuid, PK)
  - user_id (uuid, FK to auth.users, DEFAULT auth.uid())
  - name (text, business name)
  - type (text, business type)
  - city (text)
  - whatsapp (text, phone number)
  - address (text)
  - lang (text: en/hi/tm/te/kn/mr/bn/gu)
  - services (jsonb: array of {name, price})
  - headline (text, AI-generated)
  - tagline (text, AI-generated)
  - about (text, AI-generated)
  - slug (text, unique, URL-friendly)
  - is_published (boolean, default false)
  - palette (text: color scheme)
  - created_at (timestamp)

2. Security
- RLS enabled on both tables
- Owner-scoped policies for authenticated users
- Public read on websites for published pages (via /site/:slug)
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  sub_status text NOT NULL DEFAULT 'free' CHECK (sub_status IN ('free', 'premium_500', 'premium_1000', 'premium_1500')),
  websites_count integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Websites table
CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text,
  city text,
  whatsapp text,
  address text,
  lang text NOT NULL DEFAULT 'en',
  services jsonb DEFAULT '[]'::jsonb,
  headline text,
  tagline text,
  about text,
  slug text UNIQUE,
  is_published boolean NOT NULL DEFAULT false,
  palette text DEFAULT 'blue',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Owners can manage their own websites
DROP POLICY IF EXISTS "select_own_websites" ON websites;
CREATE POLICY "select_own_websites" ON websites FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_websites" ON websites;
CREATE POLICY "insert_own_websites" ON websites FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_websites" ON websites;
CREATE POLICY "update_own_websites" ON websites FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_websites" ON websites;
CREATE POLICY "delete_own_websites" ON websites FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Public can view published websites (for /site/:slug)
DROP POLICY IF EXISTS "view_published_websites" ON websites;
CREATE POLICY "view_published_websites" ON websites FOR SELECT
  TO anon, authenticated USING (is_published = true);

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_websites_slug ON websites(slug);
CREATE INDEX IF NOT EXISTS idx_websites_user_id ON websites(user_id);
