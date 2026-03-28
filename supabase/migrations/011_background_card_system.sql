-- ============================================
-- Migration 011: Enhanced Background & Card System
-- ============================================

-- Background image URL (page-level)
ALTER TABLE profiles ADD COLUMN bg_image_url text;

-- Background overlay (sits between bg and content)
ALTER TABLE profiles ADD COLUMN bg_overlay_color text DEFAULT '#000000';
ALTER TABLE profiles ADD COLUMN bg_overlay_opacity integer DEFAULT 0
  CHECK (bg_overlay_opacity >= 0 AND bg_overlay_opacity <= 80);

-- Content card style
ALTER TABLE profiles ADD COLUMN card_style text DEFAULT 'none'
  CHECK (card_style IN ('none', 'glass', 'solid', 'outlined', 'image'));

-- Card background options
ALTER TABLE profiles ADD COLUMN card_bg_opacity integer DEFAULT 100
  CHECK (card_bg_opacity >= 0 AND card_bg_opacity <= 100);
ALTER TABLE profiles ADD COLUMN card_bg_image_url text;

-- Card shape / layout
ALTER TABLE profiles ADD COLUMN card_blur integer DEFAULT 20;
ALTER TABLE profiles ADD COLUMN card_border_radius integer DEFAULT 24;
ALTER TABLE profiles ADD COLUMN card_border_color text;
ALTER TABLE profiles ADD COLUMN card_shadow boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN card_max_width text DEFAULT 'md'
  CHECK (card_max_width IN ('sm', 'md', 'lg', 'full'));
ALTER TABLE profiles ADD COLUMN card_padding text DEFAULT 'md'
  CHECK (card_padding IN ('sm', 'md', 'lg'));
