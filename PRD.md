# Volt — Product Requirements Document (PRD)

> **Version:** 1.0 (MVP)
> **Date:** 2026-02-20
> **Stack:** Next.js 15 (App Router) · Supabase · Tailwind CSS · shadcn/ui

---

## 1. Overview

**Volt** is a bold, modern link-in-bio platform targeted at Gen-Z creators. Users sign up, create a personalized page at `volt.app/username`, add their links, customize the look with pre-built themes, and track performance through built-in analytics.

**Design Philosophy:** Bold yet clean. Creative yet intuitive. Mobile-first, fully responsive.

---

## 2. Target Audience

- Gen-Z creators, influencers, freelancers
- Social media users who need a single link for multiple destinations
- Small businesses and side-project builders

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Database & Auth | Supabase (PostgreSQL + Auth) |
| Styling | Tailwind CSS + shadcn/ui |
| Drag & Drop | dnd-kit |
| Charts | Recharts |
| Deployment | Vercel |
| Image Storage | Supabase Storage |

---

## 4. Pages & Routes

### Public Routes

| Route | Description |
|---|---|
| `/` | Landing page — feature highlights, CTA, social proof |
| `/login` | Email/password login |
| `/signup` | Email/password registration + username selection |
| `/[username]` | Public profile page (the link-in-bio page) |

### Authenticated Routes (Dashboard)

| Route | Description |
|---|---|
| `/dashboard` | Overview — quick stats + link list |
| `/dashboard/links` | Full link management (CRUD, reorder, toggle) |
| `/dashboard/appearance` | Theme selection + minor customizations |
| `/dashboard/analytics` | Click analytics, charts, referrer & device data |
| `/dashboard/settings` | Profile editing (name, bio, avatar, username, social links) |

---

## 5. Feature Breakdown

### 5.1 Landing Page

- Hero section with bold headline, animated mockup/preview, primary CTA
- Features section — grid/cards highlighting key capabilities
- "How it works" — 3-step visual flow
- Social proof / testimonials section (placeholder for MVP)
- Final CTA section
- Footer with links
- Fully responsive, fast, SEO-optimized

### 5.2 Authentication

- Email + password signup with username selection
- Username validation (unique, lowercase, alphanumeric + hyphens, 3-30 chars)
- Email + password login
- Password reset flow via Supabase
- Protected dashboard routes (middleware redirect)

### 5.3 Public Profile Page (`/[username]`)

- Display name + avatar
- Bio text
- Social media icon row (Instagram, TikTok, Twitter/X, YouTube, GitHub, etc.)
- List of active links rendered as styled buttons/cards
- Themed according to user's selected theme + customizations
- OG meta tags for social sharing (title, description, avatar)
- Mobile-optimized layout
- Click tracking on each link (server-side or API route)

### 5.4 Link Management

- Add link: title, URL, icon/thumbnail (upload or URL)
- Edit link inline or via modal
- Delete link with confirmation
- Toggle link active/inactive (visible on public page or hidden)
- Drag-and-drop reorder (saved to DB via sort_order)
- Link preview/favicon auto-fetch (nice to have)

### 5.5 Appearance / Theming

**Pre-built Themes (6-8 themes for MVP):**

| Theme | Style |
|---|---|
| Midnight | Dark background, neon accents |
| Snow | Clean white, minimal |
| Sunset | Warm gradient (orange → pink) |
| Ocean | Blue gradient, soft feel |
| Neon | Black + bright neon green/pink |
| Lavender | Soft purple, rounded, friendly |
| Ember | Dark with warm red/orange accents |
| Minimal | Grayscale, typography-focused |

**Minor Customizations:**
- Accent color picker (overrides theme's accent)
- Background color/gradient override
- Button style (rounded, pill, sharp)

### 5.6 Analytics (MVP Core)

- Total clicks (all time + last 7/30 days)
- Clicks per link (with percentage breakdown)
- Clicks over time — line/bar chart (daily for last 30 days)
- Top referrers (where clicks come from)
- Device breakdown (mobile vs desktop vs tablet)
- Page views count

### 5.7 Profile / Settings

- Edit display name
- Edit bio (max 160 chars)
- Upload/change avatar (Supabase Storage)
- Change username (with uniqueness check)
- Manage social links (platform + URL, up to 8)
- Change password
- Delete account

---

## 6. Database Schema

### `profiles`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, references auth.users(id) |
| username | text | UNIQUE, lowercase, indexed |
| display_name | text | |
| bio | text | max 160 chars |
| avatar_url | text | |
| theme_id | uuid | FK → themes(id), nullable |
| accent_color | text | hex color override, nullable |
| background_override | text | color/gradient override, nullable |
| button_style | text | 'rounded' / 'pill' / 'sharp', default 'rounded' |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `links`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles(id), indexed |
| title | text | required |
| url | text | required |
| thumbnail_url | text | nullable |
| sort_order | integer | for drag-and-drop positioning |
| is_active | boolean | default true |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

### `social_links`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles(id), indexed |
| platform | text | e.g., 'instagram', 'tiktok', 'twitter' |
| url | text | required |
| sort_order | integer | display order |
| created_at | timestamptz | default now() |

### `themes`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| name | text | display name |
| slug | text | UNIQUE |
| background_type | text | 'solid' / 'gradient' / 'image' |
| background_value | text | color, gradient CSS, or image URL |
| text_color | text | hex |
| card_bg | text | card/button background |
| card_text_color | text | text on cards |
| accent_color | text | default accent |
| font_family | text | Google Font name |
| preview_image_url | text | for theme picker preview |
| created_at | timestamptz | default now() |

### `link_clicks`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| link_id | uuid | FK → links(id), indexed |
| user_id | uuid | FK → profiles(id), indexed (denormalized for fast queries) |
| clicked_at | timestamptz | default now(), indexed |
| referrer | text | nullable |
| user_agent | text | nullable |
| device_type | text | 'mobile' / 'desktop' / 'tablet' |
| country | text | nullable (Phase 2) |

### `page_views`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles(id), indexed |
| viewed_at | timestamptz | default now(), indexed |
| referrer | text | nullable |
| device_type | text | nullable |

**Indexes:**
- `profiles.username` — unique index
- `links.user_id` + `links.sort_order` — composite index
- `link_clicks.link_id` + `link_clicks.clicked_at` — composite index
- `link_clicks.user_id` + `link_clicks.clicked_at` — composite index
- `page_views.user_id` + `page_views.viewed_at` — composite index

**RLS (Row Level Security):**
- Profiles: public read, owner write
- Links: public read (active only), owner full CRUD
- Social links: public read, owner full CRUD
- Themes: public read, no user write
- Link clicks: insert open (for tracking), owner read
- Page views: insert open, owner read

---

## 7. Phase 2 (Post-MVP)

- Pricing tiers (free / pro)
- Advanced analytics (geo, browser, UTM tracking)
- Custom domains
- Admin dashboard
- Full custom theming (any color, background images, custom CSS)
- Link scheduling (go live at a specific time)
- Email collection / newsletter integration
- Sensitive content warning toggle
- QR code generation for profile page

---

## 8. Implementation Checklist

### Phase 0: Project Setup
- [ ] Initialize Next.js 15 project with App Router
- [ ] Install and configure Tailwind CSS
- [ ] Install and configure shadcn/ui
- [ ] Set up Supabase project (cloud)
- [ ] Configure Supabase client (env vars, lib files)
- [ ] Set up project folder structure
- [ ] Configure ESLint + Prettier

### Phase 1: Database & Auth
- [ ] Create all database tables via Supabase SQL editor / migrations
- [ ] Set up RLS policies for all tables
- [ ] Seed themes table with pre-built themes
- [ ] Implement signup page (email + password + username)
- [ ] Implement login page
- [ ] Implement password reset flow
- [ ] Add auth middleware for protected routes
- [ ] Create profile on signup (DB trigger or client-side)

### Phase 2: Dashboard — Link Management
- [ ] Build dashboard layout (sidebar/nav + main content)
- [ ] Build link list view (display all user links)
- [ ] Add link creation (modal/form: title, URL, thumbnail)
- [ ] Add link editing (inline or modal)
- [ ] Add link deletion with confirmation
- [ ] Add active/inactive toggle per link
- [ ] Implement drag-and-drop reorder with dnd-kit
- [ ] Persist sort order to database

### Phase 3: Dashboard — Profile & Settings
- [ ] Build settings page
- [ ] Edit display name + bio
- [ ] Avatar upload (Supabase Storage)
- [ ] Username change with validation
- [ ] Manage social links (add/edit/remove, platform picker)
- [ ] Change password
- [ ] Delete account flow

### Phase 4: Dashboard — Appearance
- [ ] Build theme picker UI (grid of theme cards with preview)
- [ ] Apply selected theme to user profile
- [ ] Accent color picker (color input)
- [ ] Background override option
- [ ] Button style selector (rounded / pill / sharp)
- [ ] Live preview of changes

### Phase 5: Public Profile Page
- [ ] Build dynamic `/[username]` route
- [ ] Fetch profile, links, social links, theme data
- [ ] Render themed profile page
- [ ] Display avatar, name, bio
- [ ] Render social icons row
- [ ] Render active links as styled buttons
- [ ] Implement click tracking (API route on link click)
- [ ] Track page views
- [ ] Add OG meta tags (dynamic)
- [ ] Mobile-responsive layout
- [ ] 404 page for invalid usernames

### Phase 6: Analytics Dashboard
- [ ] Build analytics page layout
- [ ] Total clicks summary cards (all time, 7d, 30d)
- [ ] Total page views summary
- [ ] Clicks-per-link breakdown (table or list)
- [ ] Clicks over time chart (Recharts line/bar chart)
- [ ] Top referrers list
- [ ] Device breakdown (pie/donut chart)
- [ ] Date range filter (7d / 30d / all time)

### Phase 7: Landing Page
- [ ] Hero section (headline, subtext, CTA, animated preview)
- [ ] Features grid section
- [ ] "How it works" 3-step section
- [ ] Social proof / testimonials (placeholder)
- [ ] Final CTA banner
- [ ] Footer
- [ ] Mobile responsive
- [ ] SEO meta tags
- [ ] Performance optimization (images, fonts, LCP)

### Phase 8: Polish & Deploy
- [ ] Loading states and skeletons across all pages
- [ ] Error handling and toast notifications
- [ ] Form validation (all forms)
- [ ] 404 and error pages
- [ ] Favicon + app icons
- [ ] Test on mobile devices
- [ ] Lighthouse audit (aim for 90+ on all scores)
- [ ] Deploy to Vercel
- [ ] Configure environment variables on Vercel
- [ ] Final QA pass

---

*This is a living document. Update as decisions evolve.*
