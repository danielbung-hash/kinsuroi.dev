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
4. A public `media` storage bucket is created by the script (with
   admin-only write policies).

## 2. Application

- Install `@supabase/supabase-js` and `@supabase/ssr`.
- Replace the Prisma calls in `src/app/api/*` with Supabase queries, or keep
  the current API layer as a thin proxy. View components (`src/components/
  kinsuroi/views/*`) map 1:1 to real routes:
  | Current hash route | Production route |
  |--------------------|------------------|
  | `#/`               | `/` |
  | `#/products`       | `/products` |
  | `#/products/[slug]`| `/products/[slug]` |
  | `#/about`          | `/about` |
  | `#/journal`        | `/journal` |
  | `#/journal/[slug]` | `/journal/[slug]` |
  | `#/contact`        | `/contact` |
  | `#/admin`          | `/admin` |
- In production, swap the demo cookie auth (`src/lib/auth.ts`) for Supabase
  Auth; the `admins` table + `is_admin()` RLS function enforce authorization
  at the database level.

## 3. Secrets

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are safe for
  the client (protected by RLS).
- Never ship the `service_role` key to the client bundle.

## 4. CMS fields that are intentionally empty

Product benefits / ingredients / how-to-use / suitable-for / FAQ and all
marketplace URLs are left blank by design — no invented claims. Fill them in
via the Admin CMS (`#/admin`, default password `kinsuroi-admin` — change it in
the first session, or via the `admin_password` setting).
