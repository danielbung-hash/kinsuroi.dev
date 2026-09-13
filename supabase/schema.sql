-- ═══════════════════════════════════════════════════════════════════
-- KINSUROI — Supabase / PostgreSQL production schema
-- ═══════════════════════════════════════════════════════════════════
-- Mirrors prisma/schema.prisma (the SQLite preview database).
-- Run this in the Supabase SQL editor when migrating to production.
--
-- Auth model:
--   • Public visitors  → read published content only (anon role + RLS)
--   • Admins           → full CRUD via Supabase Auth (authenticated role)
--                        membership in the `admins` table below
--   • Storage          → bucket "media" for product images / thumbnails
--   • Never expose the service_role key to the client.
-- ═══════════════════════════════════════════════════════════════════

-- ─── Custom types ───
create type public.publish_status as enum ('draft', 'published');

-- ─── Admins: mapping of auth.users → CMS admin ───
create table public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ─── Categories ───
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ─── Products ───
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid references public.categories(id) on delete set null,
  short_desc text,
  description text,
  benefits text,            -- newline-separated list
  ingredients text,         -- newline-separated list
  how_to_use text,          -- newline-separated steps
  suitable_for text,        -- newline-separated list
  image text,               -- storage path or URL
  gallery jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb, -- [{question, answer}]
  status public.publish_status not null default 'published',
  featured boolean not null default false,
  "order" integer not null default 0,
  marketplace_url text,     -- per-product BUY NOW link (Shopee/TikTok Shop)
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_idx on public.products (status, "order");
create index products_category_idx on public.products (category_id);

-- ─── Journal articles ───
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  thumbnail text,
  author text not null default 'KINSUROI Editorial',
  topic text,
  published_at timestamptz,
  seo_title text,
  seo_description text,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index articles_status_idx on public.articles (status, published_at desc);

-- ─── Website settings (hero, brand, CTA, footer, social, contact) ───
create table public.site_settings (
  key text primary key,
  value text not null default '',
  "group" text not null default 'general',
  updated_at timestamptz not null default now()
);

-- ─── updated_at triggers ───
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
create trigger categories_touch before update on public.categories
  for each row execute function public.touch_updated_at();
create trigger articles_touch before update on public.articles
  for each row execute function public.touch_updated_at();
create trigger settings_touch before update on public.site_settings
  for each row execute function public.touch_updated_at();

-- ═════════════════════════ ROW LEVEL SECURITY ═════════════════════════

alter table public.admins       enable row level security;
alter table public.categories   enable row level security;
alter table public.products     enable row level security;
alter table public.articles     enable row level security;
alter table public.site_settings enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- ─── Public read: published content only ───
create policy "public read published products" on public.products
  for select to anon, authenticated using (status = 'published');
create policy "public read published articles" on public.articles
  for select to anon, authenticated using (status = 'published');
create policy "public read categories" on public.categories
  for select to anon, authenticated using (true);
-- settings: everything except admin secrets is public-readable; the
-- admin_password-style keys live in group 'admin' and are filtered out.
create policy "public read settings" on public.site_settings
  for select to anon, authenticated using ("group" <> 'admin');

-- ─── Admin full access ───
create policy "admin full products" on public.products
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin full categories" on public.categories
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin full articles" on public.articles
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin full settings" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin read admins" on public.admins
  for select to authenticated using (public.is_admin());

-- ═════════════════════════ STORAGE ═════════════════════════
-- Bucket: "media" — product images, gallery, journal thumbnails, uploads.

insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict do nothing;

create policy "public read media" on storage.objects
  for select to anon, authenticated using (bucket_id = 'media');

create policy "admin upload media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());

create policy "admin update media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());

create policy "admin delete media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());

-- ═════════════════════════ SEED ═════════════════════════

insert into public.categories (name, slug, description, "order") values
  ('Face Care', 'face-care', 'Cleansers, creams and targeted treatments for the face.', 1),
  ('Serum', 'serum', 'Concentrated facial serums.', 2),
  ('Lip Care', 'lip-care', 'Balms and care for the lips.', 3),
  ('Body Care', 'body-care', 'Shower, oil and lotion rituals for the body.', 4)
on conflict (slug) do nothing;

insert into public.site_settings (key, value, "group") values
  ('hero_title', 'YOUR BEAUTY, YOUR RITUAL.', 'hero'),
  ('hero_subtitle', 'Discover a simple and elegant beauty ritual with KINSUROI.', 'hero'),
  ('hero_cta_text', 'SHOP PRODUCTS', 'hero'),
  ('hero_cta_url', '#/products', 'hero'),
  ('hero_cta2_text', 'EXPLORE KINSUROI', 'hero'),
  ('hero_cta2_url', '#/about', 'hero'),
  ('hero_image', '/images/hero.jpg', 'hero'),
  ('brand_title', 'Beauty, Simplified.', 'brand'),
  ('brand_image', '/images/brand.jpg', 'brand'),
  ('cta_title', 'DISCOVER YOUR BEAUTY ROUTINE', 'cta'),
  ('cta_text', 'Explore the KINSUROI collection and find the ritual that suits you.', 'cta'),
  ('cta_button_text', 'SHOP NOW', 'cta'),
  ('cta_button_url', '#/products', 'cta'),
  ('footer_text', 'Clean. Quiet. Elegant. Trustworthy.', 'footer'),
  ('footer_copyright', '© KINSUROI. All rights reserved.', 'footer'),
  ('contact_phone_1', '+62 21 29437988', 'contact'),
  ('contact_phone_2', '+62 21 29437987', 'contact'),
  ('social_shopee', '', 'social'),
  ('social_tiktok', '', 'social'),
  ('social_youtube', '', 'social'),
  ('social_instagram', '', 'social'),
  ('social_facebook', '', 'social')
on conflict (key) do nothing;

-- ─── Add the first admin after creating an auth user: ───
-- insert into public.admins (user_id) values ('<auth.users.id>');
