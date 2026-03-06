-- ============================================
-- Migration 007: Profile Reactions & Guestbook
-- ============================================

-- Profile Reactions table
CREATE TABLE profile_reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  emoji text NOT NULL,
  count integer DEFAULT 0 NOT NULL,
  UNIQUE(user_id, emoji)
);

ALTER TABLE profile_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read reactions" ON profile_reactions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert reactions" ON profile_reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update reactions" ON profile_reactions
  FOR UPDATE USING (true);

-- Function to increment reaction count (upsert)
CREATE OR REPLACE FUNCTION increment_reaction(p_user_id uuid, p_emoji text)
RETURNS integer AS $$
DECLARE
  new_count integer;
BEGIN
  INSERT INTO profile_reactions (user_id, emoji, count)
  VALUES (p_user_id, p_emoji, 1)
  ON CONFLICT (user_id, emoji)
  DO UPDATE SET count = profile_reactions.count + 1
  RETURNING count INTO new_count;
  RETURN new_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Guestbook: add show_guestbook to profiles
ALTER TABLE profiles ADD COLUMN show_guestbook boolean DEFAULT false;

-- Guestbook entries table
CREATE TABLE guestbook_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL CHECK (char_length(author_name) <= 50),
  message text NOT NULL CHECK (char_length(message) <= 280),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE guestbook_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read guestbook entries" ON guestbook_entries
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert guestbook entries" ON guestbook_entries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Owner can delete guestbook entries" ON guestbook_entries
  FOR DELETE USING (auth.uid() = user_id);
