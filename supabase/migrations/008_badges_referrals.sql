-- ============================================
-- Migration 008: Badges & Referral Program
-- ============================================

-- Badges definition table
CREATE TABLE badges (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  category text NOT NULL DEFAULT 'general'
);

-- Seed the 8 base badges
INSERT INTO badges (id, name, description, icon, category) VALUES
  ('first_link', 'First Link', 'Added your first link', 'link', 'milestone'),
  ('century', 'Century', 'Reached 100 total clicks', 'target', 'engagement'),
  ('viral', 'Viral', 'Reached 1,000 total clicks', 'flame', 'engagement'),
  ('customizer', 'Customizer', 'Customized your theme', 'palette', 'creativity'),
  ('social_butterfly', 'Social Butterfly', 'Added 3 or more social links', 'share-2', 'social'),
  ('og', 'OG', 'Account is 30+ days old', 'clock', 'milestone'),
  ('popular', 'Popular', 'Reached 100 page views', 'eye', 'engagement'),
  ('collector', 'Collector', 'Added 10 or more links', 'layers', 'milestone'),
  ('referrer', 'Referrer', 'Referred your first user', 'user-plus', 'social'),
  ('ambassador', 'Ambassador', 'Referred 5 users', 'crown', 'social');

-- User badges (earned)
CREATE TABLE user_badges (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id text REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read badges" ON badges
  FOR SELECT USING (true);

CREATE POLICY "Anyone can read user badges" ON user_badges
  FOR SELECT USING (true);

CREATE POLICY "System can insert user badges" ON user_badges
  FOR INSERT WITH CHECK (true);

-- Referral program: add fields to profiles
ALTER TABLE profiles ADD COLUMN referral_code text UNIQUE;
ALTER TABLE profiles ADD COLUMN referred_by uuid REFERENCES profiles(id);

-- Auto-generate referral codes for existing profiles
UPDATE profiles SET referral_code = lower(substr(md5(random()::text), 1, 8)) WHERE referral_code IS NULL;

-- Function to auto-generate referral code on profile insert
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := lower(substr(md5(random()::text || NEW.id::text), 1, 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code
  BEFORE INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION generate_referral_code();

-- Referral rewards tracking
CREATE TABLE referral_rewards (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  reward_type text NOT NULL,
  reward_value text NOT NULL,
  unlocked_at timestamptz DEFAULT now()
);

ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can read referral rewards" ON referral_rewards
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert referral rewards" ON referral_rewards
  FOR INSERT WITH CHECK (true);
