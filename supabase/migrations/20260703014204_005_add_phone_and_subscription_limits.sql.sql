-- Add phone number to profiles for tracking free usage
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text UNIQUE;

-- Add index on phone for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);

-- Update subscription plan limits
-- Free: 1 website
-- Premium 500: 2 websites  
-- Premium 1000: 4 websites
-- Premium 1500: 10 websites

-- Add subscription fields to track payment and active status
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_active boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_expires_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
