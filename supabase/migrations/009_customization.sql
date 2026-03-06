-- ============================================
-- Migration 009: Profile Customization
-- Video backgrounds, music, cursors, stickers
-- ============================================

-- Add customization columns to profiles
ALTER TABLE profiles ADD COLUMN video_background_url text;
ALTER TABLE profiles ADD COLUMN music_url text;
ALTER TABLE profiles ADD COLUMN cursor_effect text DEFAULT 'default'
  CHECK (cursor_effect IN ('default', 'sparkle', 'emoji_trail', 'glow', 'ring'));

-- Profile stickers table
CREATE TABLE profile_stickers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  sticker_key text NOT NULL,
  x_percent float NOT NULL DEFAULT 50,
  y_percent float NOT NULL DEFAULT 50,
  scale float NOT NULL DEFAULT 1,
  rotation float NOT NULL DEFAULT 0,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE profile_stickers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read stickers" ON profile_stickers
  FOR SELECT USING (true);

CREATE POLICY "Owner can insert stickers" ON profile_stickers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owner can update stickers" ON profile_stickers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete stickers" ON profile_stickers
  FOR DELETE USING (auth.uid() = user_id);

-- Enforce max 5 stickers per profile
CREATE OR REPLACE FUNCTION enforce_max_stickers()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM profile_stickers WHERE user_id = NEW.user_id) >= 5 THEN
    RAISE EXCEPTION 'Maximum of 5 stickers per profile';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_max_stickers
  BEFORE INSERT ON profile_stickers
  FOR EACH ROW
  EXECUTE FUNCTION enforce_max_stickers();
