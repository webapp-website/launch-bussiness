/*
# Create increment_websites_count function

1. New Functions
- `increment_websites_count(user_id uuid)` - Increments the websites_count for a given user

2. Security
- Function is SECURITY DEFINER to allow updating profiles table
- Called from the frontend after creating a website
*/

CREATE OR REPLACE FUNCTION increment_websites_count(user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET websites_count = websites_count + 1
  WHERE id = user_id;
END;
$$;