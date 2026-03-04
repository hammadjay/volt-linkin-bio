-- Migration 004: New features
-- Features: show_stats, email signup, card color overrides, featured links, sensitive links, section headers, subscribers

-- profiles: add new columns
ALTER TABLE profiles
  ADD COLUMN show_stats boolean NOT NULL DEFAULT false,
  ADD COLUMN show_email_signup boolean NOT NULL DEFAULT false,
  ADD COLUMN email_signup_text text NULL,
  ADD COLUMN card_bg_override text NULL,
  ADD COLUMN card_text_override text NULL;

-- links: add featured + sensitive columns
ALTER TABLE links
  ADD COLUMN is_featured boolean NOT NULL DEFAULT false,
  ADD COLUMN is_sensitive boolean NOT NULL DEFAULT false;

-- links: update type constraint to include 'header'
ALTER TABLE links DROP CONSTRAINT IF EXISTS links_type_check;
ALTER TABLE links ADD CONSTRAINT links_type_check CHECK (type IN ('link', 'embed', 'header'));

-- links: update embed platform constraint (NULL allowed for link and header)
ALTER TABLE links DROP CONSTRAINT IF EXISTS links_embed_platform_required;
ALTER TABLE links ADD CONSTRAINT links_embed_platform_required CHECK (
  (type = 'embed' AND embed_platform IS NOT NULL) OR
  (type IN ('link', 'header') AND embed_platform IS NULL)
);

-- links: only one featured link per user
CREATE UNIQUE INDEX links_one_featured_per_user
  ON links (user_id) WHERE (is_featured = true);

-- subscribers table
CREATE TABLE subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  email text NOT NULL,
  subscribed_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX subscribers_user_email_unique ON subscribers (user_id, email);

-- RLS for subscribers
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe"
  ON subscribers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Owner can view subscribers"
  ON subscribers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Owner can delete subscribers"
  ON subscribers FOR DELETE
  USING (auth.uid() = user_id);
