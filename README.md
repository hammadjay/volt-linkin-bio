# Volt

A bold, modern link-in-bio platform targeted at Gen-Z creators. Users sign up, create a personalized page at `volt.app/username`, add links, customize the look with pre-built themes, and track performance through built-in analytics.

## Tech Stack

| Layer            | Technology                     |
| ---------------- | ------------------------------ |
| Framework        | Next.js 16 (App Router)       |
| Database & Auth  | Supabase (PostgreSQL + Auth)   |
| Styling          | Tailwind CSS 4 + shadcn/ui    |
| Drag & Drop      | dnd-kit                        |
| Charts           | Recharts                       |
| Notifications    | Sonner                         |
| Deployment       | Vercel                         |

## Features

- **Authentication** — Email/password signup with username selection, login, and password reset via Supabase Auth
- **Public Profile Pages** — Dynamic `/:username` routes with themed layouts, social icons, link buttons, and OG meta tags
- **Link Management** — Full CRUD with drag-and-drop reordering (dnd-kit), active/inactive toggle, and thumbnail support
- **Appearance Customization** — 8 pre-built themes (Midnight, Snow, Sunset, Ocean, Neon, Lavender, Ember, Minimal), accent color picker, background override, and button style selector
- **Analytics Dashboard** — Total clicks/views, clicks-per-link breakdown, daily charts, top referrers, and device type breakdown with date range filtering
- **Profile Settings** — Edit display name, bio, avatar (Supabase Storage), username, social links, and password
- **Click & View Tracking** — Server-side API for recording link clicks and page views with referrer and device detection

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Login, signup, password reset
│   ├── (dashboard)/         # Protected dashboard routes
│   │   └── dashboard/
│   │       ├── links/       # Link management
│   │       ├── appearance/  # Theme & customization
│   │       ├── analytics/   # Analytics charts & stats
│   │       └── settings/    # Profile & account settings
│   ├── (public)/
│   │   └── [username]/      # Public profile page
│   ├── api/track/           # Click & view tracking endpoint
│   └── page.tsx             # Landing page
├── components/
│   ├── dashboard/           # Dashboard-specific components
│   ├── profile/             # Public profile components
│   └── ui/                  # shadcn/ui primitives
├── lib/
│   └── supabase/            # Supabase client & middleware helpers
├── types/                   # TypeScript interfaces
└── middleware.ts             # Auth route protection
supabase/
└── migrations/              # Database schema & RLS policies
```

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### Setup

1. Clone the repository:

   ```bash
   git clone <repo-url>
   cd volt
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the database migration in your Supabase SQL editor using `supabase/migrations/001_initial_schema.sql`.

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Production build         |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

## Database

Six tables with Row Level Security enabled:

- **profiles** — User profile data (username, display name, bio, avatar, theme preferences)
- **links** — User links with sort order and active toggle
- **social_links** — Social platform links
- **themes** — 8 pre-built themes seeded on migration
- **link_clicks** — Click analytics (referrer, device type, timestamp)
- **page_views** — Page view tracking

## License

Private
