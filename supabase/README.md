# KINSUROI — Deployment Notes (Supabase migration)

The preview build runs on **Next.js 16 + Prisma (SQLite)** inside the sandbox.
The data model is intentionally identical to the Supabase/PostgreSQL design,
so migrating to production is a straightforward path.

## 1. Database — Supabase

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql` in this folder.
   - Creates `categories`, `products`, `articles`, `site_settings`, `admins`
   - Enables **Row Level Security**:
     - anonymous visitors can only read `published` rows and non-secret settings
     - full CRUD is granted only to authenticated users listed in `admins`
3. Create an auth user (Supabase Dashboard → Authentication) and register it:
   ```sql
   insert into public.admins (user_id) values ('<auth-user-uuid>');
   ```
4. A public `product-images` storage bucket is created by the script (with
   admin-only write policies). Uploads go to `product-images/products/…`;
   the database stores only the public URL (`image_path` style reference).

## 2. Application

- Install `@supabase/supabase-js` and `@supabase/ssr`.
- Replace the Prisma calls in `src/app/api/*` with Supabase queries, or keep
  the current API layer as a thin proxy. View components (`src/components/
  kinsuroi/views/*`) map 1:1 to real routes:
  | Route | Page |
  |-------|------|
  | `/` | home |
  | `/products` (+ `?category=face-care|lip-care|body-care`) | collection |
  | `/products/[slug]` | product detail |
  | `/about` | brand |
  | `/company` | company profile (CMS-editable) |
  | `/journal`, `/journal/[slug]` | journal |
  | `/contact` | contact |
  | `/admin` | CMS |
- In production, swap the cookie auth (`src/lib/auth.ts`) for Supabase
  Auth; the `admins` table + `is_admin()` RLS function enforce authorization
  at the database level.

## 3. Secrets & credentials

- The CMS password lives **only** in the server-side `ADMIN_PASSWORD`
  environment variable (git-ignored `.env`). It is never hardcoded, never
  stored in the database, never rendered on the login page, and never
  returned by any API.
- `ADMIN_SECRET` signs the admin session cookie (HMAC).
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for
  the client (protected by RLS). `SUPABASE_SERVICE_ROLE_KEY` is used only in
  `src/lib/storage.ts` (server-side upload/delete) and must never reach the
  client bundle or an API response.
- When `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set,
  uploads go to Supabase Storage automatically; otherwise the app falls back
  to local `public/uploads` (preview mode). Add `.env` to `.gitignore`
  (already done).

## 4. CMS fields that are intentionally empty

Product problem / benefits / ingredients / how-to-use / price / suitable-for /
FAQ and all purchase URLs are left blank by design — no invented claims.
Character limits in the CMS are recommendations only (Problem ±80,
Manfaat ±100, Cara Pakai ±500, Ingredient Highlight ±300, Deskripsi ±1000);
over-limit content shows a warning but can still be saved.

Company page sections (`company_*` settings) start empty and show a neutral
placeholder on `/company` until the owner fills them via the CMS — no
company facts are invented anywhere in the codebase.

## 5. Data migrations

- `scripts/seed.ts` — fresh installs (3 categories, 12 products, articles,
  settings; no credentials).
- `scripts/migrate-v3.ts` — existing databases: restructures categories to
  Face Care / Lip Care / Body Care, orders products 1–12 (creating the
  product #7 placeholder slot), stores the official WhatsApp number, adds
  `company_*` settings, and removes any `admin_password` row.
