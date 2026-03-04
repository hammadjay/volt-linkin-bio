# CLAUDE.md — Volt Development Rules

## Project Overview

Volt is a link-in-bio platform for Gen-Z creators. Users sign up, create a page at `/username`, manage links, customize themes, and view analytics. See `PRD.md` for full product requirements.

## Tech Stack

- **Framework:** Next.js 16 (App Router) with React 19
- **Language:** TypeScript (strict mode)
- **Database & Auth:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Tailwind CSS 4 + shadcn/ui (new-york style, neutral base color)
- **Drag & Drop:** dnd-kit
- **Charts:** Recharts
- **Icons:** Lucide React (only)
- **Notifications:** Sonner (toast)
- **Path alias:** `@/*` maps to `./src/*`

## Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/               # Auth pages (login, signup, reset-password)
│   ├── (dashboard)/          # Protected routes — layout fetches user + profile
│   │   └── dashboard/        # /dashboard, /dashboard/links, etc.
│   ├── (public)/             # Public profile — /[username]
│   ├── api/                  # API routes (e.g., /api/track)
│   ├── layout.tsx            # Root layout (Inter font, dark mode, Toaster)
│   ├── page.tsx              # Landing page
│   └── not-found.tsx         # 404 page
├── components/
│   ├── ui/                   # shadcn/ui primitives — DO NOT edit manually
│   ├── dashboard/            # Dashboard feature components
│   ├── profile/              # Public profile components
│   └── landing/              # Landing page components (if separated)
├── lib/
│   └── supabase/
│       ├── server.ts         # Server-side Supabase client (uses cookies)
│       ├── client.ts         # Browser-side Supabase client
│       └── middleware.ts     # Session refresh + route protection logic
├── types/
│   └── database.ts           # TypeScript interfaces for all DB tables
├── hooks/                    # Custom React hooks
└── middleware.ts              # Next.js middleware entry point
supabase/
└── migrations/               # SQL migrations (numbered, sequential)
```

## Architecture Rules

### Server vs Client Components

- **Default to Server Components.** Only add `"use client"` when the component needs browser APIs, hooks, or interactivity.
- **Route pages under `(dashboard)/`** are Server Components — they fetch data server-side via `createClient()` from `@/lib/supabase/server`, then pass data as props to client components.
- **Interactive feature components** (link manager, appearance editor, settings form, analytics dashboard) are client components in `src/components/dashboard/`.
- The `(dashboard)/layout.tsx` is a Server Component that fetches the authenticated user and profile, then renders the `<DashboardShell>` client component.

### Data Fetching Pattern

- **Server Components:** Use `await createClient()` from `@/lib/supabase/server` — this reads cookies for auth.
- **Client Components:** Use `createClient()` from `@/lib/supabase/client` — for mutations and real-time interactions.
- **Never import the server client in a `"use client"` file** or vice versa.
- Always call `supabase.auth.getUser()` to get the authenticated user — never trust cookies/session alone.
- Use `router.refresh()` after mutations in client components to revalidate server-fetched data.

### Route Groups

- `(auth)` — Login, signup, reset-password. Unauthenticated only (middleware redirects logged-in users to `/dashboard`).
- `(dashboard)` — All dashboard routes. Protected by middleware + layout-level auth check. Always redirect to `/login` if unauthenticated.
- `(public)` — Public-facing routes like `[username]`. No auth required.

### Middleware

- Defined in `src/middleware.ts`, delegates to `src/lib/supabase/middleware.ts`.
- Refreshes Supabase session on every request.
- Redirects unauthenticated users from `/dashboard/*` to `/login`.
- Redirects authenticated users from `/login` and `/signup` to `/dashboard`.

## Coding Conventions

### TypeScript

- Use strict TypeScript. All database interfaces live in `src/types/database.ts`.
- Use `interface` for object shapes (not `type` aliases for objects).
- Define prop types inline for components: `{ profile: Profile; children: React.ReactNode }`.
- Use union types for known values: `"rounded" | "pill" | "sharp"`, `"mobile" | "desktop" | "tablet"`.
- Use non-null assertion (`!`) sparingly — only when auth middleware guarantees the user exists (e.g., `user!.id` in dashboard pages).

### Components

- **shadcn/ui components** live in `src/components/ui/` — add new ones via `npx shadcn@latest add <component>`. Never manually edit these files.
- **Feature components** go in `src/components/<feature>/` (e.g., `dashboard/`, `profile/`, `landing/`).
- Use `cn()` from `@/lib/utils` for conditional class merging.
- Use Lucide React for all icons. Import individual icons: `import { Zap, Plus } from "lucide-react"`.
- Use `sonner`'s `toast` for user feedback: `toast.success()`, `toast.error()`.
- Standard icon size in UI: `h-4 w-4` for inline, `h-5 w-5` for nav/buttons.

### Styling

- **Tailwind CSS 4** with CSS variables for theming. Dark mode via `.dark` class on `<html>`.
- The app ships in dark mode by default (`<html lang="en" className="dark">`).
- Use shadcn semantic color tokens: `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-card`, `border-border`, `bg-accent`, `text-destructive`, etc.
- Responsive: mobile-first. Use `sm:`, `md:`, `lg:` breakpoints. The dashboard sidebar hides below `md`.
- For conditional classes, use template literals with ternary: `` `base-classes ${condition ? "active" : "inactive"}` ``.
- Global styles in `src/app/globals.css` — imports Tailwind, tw-animate-css, and shadcn theme tokens.

### Forms & Mutations

- Client-side forms use `useState` for form fields and `loading`/`saving` states.
- Validate inputs before calling Supabase. Show errors via `toast.error()`.
- Pattern: `setLoading(true)` → Supabase call → handle error/success → `setLoading(false)`.
- After successful mutations, call `router.refresh()` to keep server-fetched data fresh.
- Disable submit buttons while loading: `disabled={loading}`.

### Supabase Queries

- Select data: `supabase.from("table").select("*").eq("column", value)`.
- For single records: append `.single()`.
- For counts: `supabase.from("table").select("*", { count: "exact", head: true })`.
- For related data: `supabase.from("profiles").select("*, themes(*)")`.
- Handle errors: check `error` from destructured result, show toast on failure.
- Use `.order("column", { ascending: true })` for sorted results.
- Insert and return data: `.insert({...}).select().single()`.
- Use `.upsert()` for bulk sort-order updates (drag-and-drop reorder).

## Database

### Schema

Six tables: `profiles`, `links`, `social_links`, `themes`, `link_clicks`, `page_views`. See `src/types/database.ts` for TypeScript interfaces and `supabase/migrations/001_initial_schema.sql` for the full schema.

### Migrations

- Migrations live in `supabase/migrations/` with numbered prefixes: `001_`, `002_`, etc.
- Run migrations in the Supabase SQL editor.
- Always include RLS policies for new tables.

### Row Level Security

All tables have RLS enabled. Follow these patterns:
- **Public read, owner write:** profiles, links (active + owner), social_links
- **Public read only:** themes
- **Open insert, owner read:** link_clicks, page_views (for anonymous tracking)
- Owner checks use `auth.uid() = user_id` (or `auth.uid() = id` for profiles).

### Key Constraints

- `profiles.username`: unique, lowercase, alphanumeric + hyphens, 3–30 chars, regex `^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$`.
- `profiles.bio`: max 160 characters.
- `profiles.button_style`: one of `'rounded'`, `'pill'`, `'sharp'`.
- `themes.background_type`: one of `'solid'`, `'gradient'`, `'image'`.
- `link_clicks.device_type`: one of `'mobile'`, `'desktop'`, `'tablet'`.
- A DB trigger auto-creates a profile row when a user signs up via `auth.users`.
- A DB trigger auto-updates `updated_at` on profile and link modifications.

## API Routes

- **POST `/api/track`** — Records link clicks and page views. Accepts `{ type, linkId, userId, referrer, deviceType, userAgent }`. No auth required (anonymous tracking).
- API routes use `createClient()` from `@/lib/supabase/server`.
- Return `NextResponse.json(...)` with appropriate status codes.

## Public Profile Rendering

- The public page at `/(public)/[username]/page.tsx` is a Server Component that fetches profile + theme + links + social links.
- It passes everything to `<ProfilePage>`, a client component that handles theming, tracking, and interactivity.
- Theme properties (background, text color, card styles) are applied via inline `style` attributes, not Tailwind classes — because themes are dynamic data from the DB.
- Click tracking fires via `fetch("/api/track", ...)` on link click and on page mount (page view).
- OG meta tags are generated server-side via `generateMetadata`.

## Common Patterns

### Adding a New Dashboard Page

1. Create `src/app/(dashboard)/dashboard/<route>/page.tsx` (Server Component).
2. Fetch data server-side via `createClient()`.
3. Create a client component in `src/components/dashboard/` for interactivity.
4. Pass server-fetched data as props to the client component.

### Adding a New shadcn/ui Component

```bash
npx shadcn@latest add <component-name>
```

This installs it to `src/components/ui/`. Never manually create or edit UI primitives.

### Adding a New Database Table

1. Write a numbered migration in `supabase/migrations/`.
2. Include RLS policies.
3. Add the TypeScript interface to `src/types/database.ts`.

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=<supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

Never commit `.env.local`. Use `.env.example` as a template.

## Commands

| Command         | Purpose                |
| --------------- | ---------------------- |
| `npm run dev`   | Start dev server       |
| `npm run build` | Production build       |
| `npm run start` | Start production server|
| `npm run lint`  | Run ESLint             |
