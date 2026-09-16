# KINSUROI — Official Website

Website resmi brand kosmetik **KINSUROI** dengan konsep *Elegant White Luxury / Clean Beauty*.

Dibangun dengan **Next.js 16 + TypeScript + Tailwind CSS 4 + shadcn/ui + Framer Motion**, database **Prisma/SQLite** yang siap dimigrasikan ke **Supabase (PostgreSQL + Storage)**.

## Fitur

- **Katalog produk** — 12 produk dalam 3 kategori: Face Care, Lip Care, Body Care
- **Halaman detail produk** — problem, manfaat, harga, CTA WhatsApp ("Beli Sekarang"), accordion Cara Pakai / Ingredient Highlight / Deskripsi Lengkap (mobile-friendly)
- **Company page** (`/company`) — About, Vision & Mission, Our Values, Quality & Commitment, Company Information
- **Journal** — artikel edukasi dengan halaman artikel terpisah
- **Admin CMS** (`/admin`) — login berbasis env, kelola produk (CRUD + upload gambar + urutan), kategori, artikel, konten website, sosial media; character counter dengan peringatan soft-limit (tidak memblokir simpan)
- **Upload gambar** — Supabase Storage (bucket `product-images`) dengan fallback lokal `public/uploads`
- **SEO** — metadata dinamis per produk/artikel, canonical, Open Graph, `sitemap.xml`, `robots.txt`, JSON-LD

## Menjalankan Project

```bash
# 1. Install dependencies
bun install

# 2. Siapkan environment
cp .env.example .env
# isi DATABASE_URL, ADMIN_PASSWORD, ADMIN_SECRET (lihat catatan di bawah)

# 3. Siapkan database + data awal
bun run db:push
bun scripts/seed.ts

# 4. Jalankan development server
bun run dev
```

Buka `http://localhost:3000` — CMS admin di `http://localhost:3000/admin`.

## Environment Variables

| Variable | Fungsi |
|---|---|
| `DATABASE_URL` | Koneksi database runtime — **Vercel/Supabase: pakai connection pooler port `6543` + `?pgbouncer=true&connection_limit=1`** |
| `DIRECT_URL` | Koneksi direct port `5432` — dipakai untuk membuat skema & seed (DDL tidak bisa lewat pooler) |
| `ADMIN_PASSWORD` | Password login CMS — **hanya dibaca di server, jangan pernah di-commit** |
| `ADMIN_SECRET` | Kunci HMAC untuk signing cookie sesi admin |
| `NEXT_PUBLIC_SUPABASE_URL` | URL project Supabase (untuk Storage) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key Supabase — **server-side only, jangan pernah di-commit** |

> Aman: kredensial CMS hanya hidup di environment variable server. Tidak ada password di source code, database, bundle client, maupun respons API.

## Migrasi ke Supabase

Skema PostgreSQL, kebijakan RLS, bucket storage, dan panduan migrasi lengkap tersedia di:

- [`supabase/schema.sql`](supabase/schema.sql)
- [`supabase/README.md`](supabase/README.md)

### Deployment Vercel — checklist

1. Build command: `prisma generate && bun run build`
2. Env (semua environment): `DATABASE_URL` (pooler 6543 + `pgbouncer=true&connection_limit=1`), `DIRECT_URL` (direct 5432), `ADMIN_PASSWORD`, `ADMIN_SECRET`, `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
3. Redeploy. Saat pertama kali dibuka, database akan **auto-provision** (buat tabel + seed) lewat `DIRECT_URL`.
4. Jika katalog belum muncul, login ke `/admin` → panel **Database tools** → **Seed default content** (hanya menambah baris yang hilang, tidak pernah menimpa konten yang sudah diedit).

### Upload gambar di produksi

- File disimpan ke **Supabase Storage** bucket `product-images` — bucket **dibuat otomatis (public)** saat upload pertama jika belum ada.
- Foto > 1,2 MB otomatis dikompres di browser (maks 2000 px, WebP/JPEG) agar lolos batas body 4,5 MB serverless.
- Jika env Supabase belum diisi, upload di Vercel akan gagal dengan pesan yang jelas (filesystem serverless read-only — tidak ada lagi crash `ENOENT mkdir`).

## Struktur Utama

```
src/
├── app/                  # Route pages (/, /products, /products/[slug], /company, /journal, /about, /contact, /admin) + API routes
├── components/kinsuroi/  # Navbar, Footer, ProductCard, views, Admin CMS
└── lib/                  # auth, db (Prisma), data, storage (Supabase), types
prisma/schema.prisma      # Model: Category, Product, Article, SiteSetting
scripts/                  # seed.ts, migrate-v3.ts, make-brand-assets.ts, gen-images.ts
supabase/                 # Skema & panduan migrasi Supabase
```
