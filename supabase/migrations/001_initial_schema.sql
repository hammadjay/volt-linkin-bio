-- ============================================
-- Volt - Initial Database Schema
-- ============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================
-- THEMES TABLE (pre-built, no user writes)
-- ============================================
create table public.themes (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  background_type text not null check (background_type in ('solid', 'gradient', 'image')),
  background_value text not null,
  text_color text not null default '#ffffff',
  card_bg text not null default 'rgba(255,255,255,0.1)',
  card_text_color text not null default '#ffffff',
  accent_color text not null default '#8b5cf6',
  font_family text not null default 'Inter',
  preview_image_url text,
  created_at timestamptz not null default now()
);

-- ============================================
-- PROFILES TABLE
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  bio text check (char_length(bio) <= 160),
  avatar_url text,
  theme_id uuid references public.themes(id) on delete set null,
  accent_color text,
  background_override text,
  button_style text not null default 'rounded' check (button_style in ('rounded', 'pill', 'sharp')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Username format constraint
alter table public.profiles
  add constraint username_format
  check (username ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$');

create index idx_profiles_username on public.profiles(username);

-- ============================================
-- LINKS TABLE
-- ============================================
create table public.links (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  url text not null,
  thumbnail_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_links_user_sort on public.links(user_id, sort_order);

-- ============================================
-- SOCIAL LINKS TABLE
-- ============================================
create table public.social_links (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  platform text not null,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index idx_social_links_user on public.social_links(user_id);

-- ============================================
-- LINK CLICKS TABLE (analytics)
-- ============================================
create table public.link_clicks (
  id uuid primary key default uuid_generate_v4(),
  link_id uuid not null references public.links(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  clicked_at timestamptz not null default now(),
  referrer text,
  user_agent text,
  device_type text check (device_type in ('mobile', 'desktop', 'tablet')),
  country text
);

create index idx_link_clicks_link_time on public.link_clicks(link_id, clicked_at);
create index idx_link_clicks_user_time on public.link_clicks(user_id, clicked_at);

-- ============================================
-- PAGE VIEWS TABLE
-- ============================================
create table public.page_views (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  viewed_at timestamptz not null default now(),
  referrer text,
  device_type text
);

create index idx_page_views_user_time on public.page_views(user_id, viewed_at);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger on_link_updated
  before update on public.links
  for each row execute function public.handle_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'display_name'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles: public read, owner write
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Links: public read (active only), owner full CRUD
alter table public.links enable row level security;

create policy "Active links are viewable by everyone"
  on public.links for select
  using (is_active = true or auth.uid() = user_id);

create policy "Users can insert their own links"
  on public.links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own links"
  on public.links for update
  using (auth.uid() = user_id);

create policy "Users can delete their own links"
  on public.links for delete
  using (auth.uid() = user_id);

-- Social Links: public read, owner full CRUD
alter table public.social_links enable row level security;

create policy "Social links are viewable by everyone"
  on public.social_links for select
  using (true);

create policy "Users can insert their own social links"
  on public.social_links for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own social links"
  on public.social_links for update
  using (auth.uid() = user_id);

create policy "Users can delete their own social links"
  on public.social_links for delete
  using (auth.uid() = user_id);

-- Themes: public read only
alter table public.themes enable row level security;

create policy "Themes are viewable by everyone"
  on public.themes for select
  using (true);

-- Link Clicks: anyone can insert (for tracking), owner can read
alter table public.link_clicks enable row level security;

create policy "Anyone can insert link clicks"
  on public.link_clicks for insert
  with check (true);

create policy "Users can view their own link clicks"
  on public.link_clicks for select
  using (auth.uid() = user_id);

-- Page Views: anyone can insert, owner can read
alter table public.page_views enable row level security;

create policy "Anyone can insert page views"
  on public.page_views for insert
  with check (true);

create policy "Users can view their own page views"
  on public.page_views for select
  using (auth.uid() = user_id);

-- ============================================
-- SEED THEMES
-- ============================================
insert into public.themes (name, slug, background_type, background_value, text_color, card_bg, card_text_color, accent_color, font_family) values
  ('Midnight', 'midnight', 'solid', '#0f0f23', '#ffffff', 'rgba(255,255,255,0.08)', '#ffffff', '#8b5cf6', 'Inter'),
  ('Snow', 'snow', 'solid', '#fafafa', '#1a1a1a', 'rgba(0,0,0,0.05)', '#1a1a1a', '#3b82f6', 'Inter'),
  ('Sunset', 'sunset', 'gradient', 'linear-gradient(135deg, #f97316, #ec4899)', '#ffffff', 'rgba(255,255,255,0.15)', '#ffffff', '#fbbf24', 'Poppins'),
  ('Ocean', 'ocean', 'gradient', 'linear-gradient(135deg, #0ea5e9, #6366f1)', '#ffffff', 'rgba(255,255,255,0.12)', '#ffffff', '#22d3ee', 'Inter'),
  ('Neon', 'neon', 'solid', '#000000', '#39ff14', 'rgba(57,255,20,0.08)', '#39ff14', '#ff00ff', 'Space Mono'),
  ('Lavender', 'lavender', 'gradient', 'linear-gradient(135deg, #c084fc, #f9a8d4)', '#1e1b4b', 'rgba(255,255,255,0.3)', '#1e1b4b', '#7c3aed', 'Nunito'),
  ('Ember', 'ember', 'solid', '#1c1917', '#ffffff', 'rgba(239,68,68,0.1)', '#ffffff', '#ef4444', 'Inter'),
  ('Minimal', 'minimal', 'solid', '#ffffff', '#171717', 'rgba(0,0,0,0.03)', '#171717', '#737373', 'IBM Plex Mono');
