-- Volt Appearance Studio 2.0
-- Run this in the Supabase SQL editor

-- Typography
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS font_heading text DEFAULT 'Inter';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS font_body text DEFAULT 'Inter';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS font_buttons text DEFAULT 'Inter';

-- Button System 2.0
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS button_shape text DEFAULT 'rounded';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS button_hover_effect text DEFAULT 'scale';

-- Avatar Effects
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_shape text DEFAULT 'circle';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_ring_style text DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_ring_color text DEFAULT '#8b5cf6';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_effect text DEFAULT 'none';

-- Custom Status
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_emoji text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status_text text;

-- Texture Overlay
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS texture_type text DEFAULT 'none';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS texture_opacity integer DEFAULT 20;

-- Spotlight Effect
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spotlight_enabled boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS spotlight_color text DEFAULT '#ffffff';

-- Active Vibe
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS vibe_id text;

-- Draft system
CREATE TABLE IF NOT EXISTS profile_drafts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  draft_data jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profile_drafts ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profile_drafts' AND policyname = 'Users manage own drafts'
  ) THEN
    CREATE POLICY "Users manage own drafts" ON profile_drafts
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END $$;
