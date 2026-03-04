-- Add SEO fields and animation type to profiles
ALTER TABLE profiles ADD COLUMN seo_title text NULL;
ALTER TABLE profiles ADD COLUMN seo_description text NULL;
ALTER TABLE profiles ADD COLUMN seo_image text NULL;
ALTER TABLE profiles ADD COLUMN animation_type text NOT NULL DEFAULT 'none'
  CHECK (animation_type IN ('none', 'gradient', 'particles', 'float'));
