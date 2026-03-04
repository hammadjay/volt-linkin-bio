export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  theme_id: string | null;
  accent_color: string | null;
  background_override: string | null;
  button_style: "rounded" | "pill" | "sharp";
  show_stats: boolean;
  show_email_signup: boolean;
  email_signup_text: string | null;
  card_bg_override: string | null;
  card_text_override: string | null;
  created_at: string;
  updated_at: string;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  thumbnail_url: string | null;
  sort_order: number;
  is_active: boolean;
  scheduled_start: string | null;
  scheduled_end: string | null;
  type: "link" | "embed" | "header";
  embed_platform: "youtube" | "spotify" | "twitter" | "tiktok" | "soundcloud" | null;
  is_featured: boolean;
  is_sensitive: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  user_id: string;
  platform: string;
  url: string;
  sort_order: number;
  created_at: string;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  background_type: "solid" | "gradient" | "image";
  background_value: string;
  text_color: string;
  card_bg: string;
  card_text_color: string;
  accent_color: string;
  font_family: string;
  preview_image_url: string | null;
  created_at: string;
}

export interface LinkClick {
  id: string;
  link_id: string;
  user_id: string;
  clicked_at: string;
  referrer: string | null;
  user_agent: string | null;
  device_type: "mobile" | "desktop" | "tablet";
  country: string | null;
}

export interface PageView {
  id: string;
  user_id: string;
  viewed_at: string;
  referrer: string | null;
  device_type: string | null;
}

export interface Subscriber {
  id: string;
  user_id: string;
  email: string;
  subscribed_at: string;
}
