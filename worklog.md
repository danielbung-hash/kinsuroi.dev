# Worklog

---
Task ID: 1
Agent: Super Z (main agent)
Task: Build KINSUROI official cosmetics brand website — Elegant White Luxury / Clean Beauty concept (Next.js 16 + TypeScript + Tailwind 4 + shadcn/ui + Framer Motion + Prisma/SQLite mirroring Supabase design, with Admin CMS)

Work Log:
- Initialized fullstack environment (init-fullstack.sh), inspected scaffold (Next.js 16, React 19, Tailwind 4, shadcn/ui, Prisma 6, framer-motion)
- Designed Prisma schema mirroring the requested Supabase/PostgreSQL model: Category, Product (with benefits/ingredients/howToUse/suitableFor/faq/gallery/marketplaceUrl/SEO fields), Article, SiteSetting (key-value CMS)
- Seeded DB via scripts/seed.ts: 4 categories (Face Care, Serum, Lip Care, Body Care), 11 KINSUROI products (exact names from brief), 3 published educational journal articles, 27 site settings (hero/brand/CTA/footer/contact/social/admin). Product claims intentionally left EMPTY (no fabricated info per brief)
- Generated 16 premium AI placeholder images via z-ai-web-dev-sdk (scripts/gen-images.ts): hero, brand, 3 journal thumbnails, 11 unlabeled minimal product shots on off-white studio background (public/images/)
- Built design system in globals.css: White Luxury palette (#FFFFFF, #FAFAF8, #F4F1EC, #222222, #EAEAEA + minimal bronze accent), Cormorant Garamond serif headings + Jost sans body (Google Fonts via client-side link), custom btn-primary/btn-outline/btn-light/kicker/link-underline classes
- Built SPA with hash routing (sandbox exposes only `/` route): src/components/kinsuroi/{router,store,KinsuroiApp}.tsx — deep-linkable routes #/, #/products, #/products/[slug], #/about, #/journal, #/journal/[slug], #/contact, #/admin
- Server-rendered initial data in src/app/page.tsx (SSR fetch from Prisma) + layout.tsx SEO metadata, OpenGraph, Organization/WebSite JSON-LD
- Public components: Navbar (sticky, transparent→white on scroll, mobile full-screen hamburger overlay), Footer (nav + customer links + CMS-driven social icons + copyright), ProductCard (hover image scale, VIEW PRODUCT), Reveal/RevealImage (subtle framer-motion fade-up/scale)
- HomeView: Hero ("YOUR BEAUTY, YOUR RITUAL." + SHOP PRODUCTS / EXPLORE KINSUROI), Brand Intro ("Beauty, Simplified." editorial split), Collection grid (all products), charcoal CTA banner ("DISCOVER YOUR BEAUTY ROUTINE" + SHOP NOW), Journal preview, Contact block
- Views: ProductsView (category filter chips), ProductDetailView (breadcrumb, big image, BUY NOW / BUY ON SHOPEE with graceful "links soon" state, Benefits/Ingredients/HowToUse/SuitableFor sections with elegant pending states, FAQ accordion, related products), AboutView, JournalView, ArticleView, ContactView, ComingSoonView
- API routes: /api/bootstrap (public), /api/products + [id], /api/categories, /api/articles + [id], /api/settings (admin GET/PUT), /api/upload (multipart → public/uploads), /api/admin/login (POST login / GET session / DELETE logout, HMAC cookie auth)
- Admin CMS (AdminView + admin/{fields,ProductEditor,ArticleEditor}): password login, stats overview, Products table + full editor (all fields, image upload + preview, FAQ repeater, status/featured/order/marketplace/SEO), Categories CRUD, Journal CRUD (draft/publish, thumbnail upload, SEO), Website content (hero/brand/CTA/footer fields), Social & Contact (5 social URLs + address/phones/email/WhatsApp — empty channels hidden on site)
- Provided supabase/schema.sql (PostgreSQL tables, RLS policies with is_admin(), media storage bucket, seed) + supabase/README.md migration guide
- Fixed issues found during verification: module import paths (./admin/*), Tailwind v4 flattening @layer components→unlayered CSS (used !hidden lg:!inline-flex important utilities for navbar CTA), React hydration mismatch (hash router now SSR-safe), lint setState-in-effect errors (key-reset pattern)

Stage Summary:
- Verified end-to-end with Agent Browser: home/products/filter/detail/journal/article/about/contact/coming-soon all render; mobile 390px + hamburger OK; sticky footer OK; admin login + product editor + social-URL save reflected live on storefront footer; zero console errors; lint clean
- Preview URL serves on `/`; admin at `#/admin` (password admin via env `ADMIN_PASSWORD` di `.env` — tidak pernah di-commit, changeable in CMS)
- Migration path to production Supabase documented in supabase/README.md + supabase/schema.sql

---
Task ID: 2
Agent: Super Z (main agent)
Task: Konversi SPA hash-routing menjadi 5 halaman terpisah (real Next.js routes) + terjemahan seluruh konten ke Bahasa Indonesia

Work Log:
- Rewrote src/components/kinsuroi/router.tsx: HashLink now wraps next/link; navigate() uses an app-router bridge (setAppRouter) with scroll-to-top
- Created SiteShell.tsx: shared client shell providing BootstrapContext (server-fetched Prisma data) + Navbar/Footer for every real route
- Created src/lib/data.ts (getBootstrapData) and 9 route pages: /, /products (+?category=), /products/[slug] (generateMetadata from product), /about, /journal, /journal/[slug] (generateMetadata from article), /contact, /coming-soon?page=, /admin (bare AdminView, noindex)
- Added loading.tsx (elegant brand loader), not-found.tsx (styled 404 inside SiteShell), sitemap.ts (static + product + article URLs)
- Deleted KinsuroiApp.tsx (SPA hash shell no longer needed)
- Fixed critical SSR bug: Zustand store was empty during server render → product detail rendered "not found" in SSR HTML. Solution: BootstrapContext (context-first useK hook, Zustand fallback for admin); SSR HTML now contains full content (SEO-safe)
- Navbar: Indonesian labels (Beranda/Produk/Tentang/Journal/Kontak), active-state via usePathname (bronze highlight), mobile menu closes on link click
- Translated all storefront UI to Indonesian: hero "KECANTIKANMU, RITUALMU.", "JELAJAHI KOLEKSI KAMI", "TEMUKAN RITUAL KECANTIKANMU", BELI SEKARANG/LIHAT PRODUK/HUBUNGI KAMI, footer NAVIGASI/PELANGGAN/BELANJA, product sections Manfaat/Komposisi/Cara Penggunaan/Cocok Untuk, date formatting id-ID, ComingSoon Indonesian title map
- Re-seeded DB (scripts/seed.ts, upsert by slug/key): categories (Perawatan Wajah/Serum/Perawatan Bibir/Perawatan Tubuh), 11 products shortDesc in Indonesian, 3 journal articles fully rewritten in Indonesian (titles, topics, excerpts, content, SEO), 27 settings (hero/brand/CTA/footer Indonesian + CTA URLs now real paths /products, /about)
- layout.tsx: lang="id", metadata + OpenGraph Indonesian, locale id_ID
- Fixed hero overflow with long word "KECANTIKANMU," (text-[2.5rem] md:text-5xl lg:text-6xl); lint setState-in-effect fix (menu closes via onClick)

Stage Summary:
- Verified via Agent Browser (desktop 1280px + mobile 390px): all 9 routes return 200, client-side nav works (menu → /products, card → detail), mobile hamburger opens/navigates/closes, active nav highlight works, 404 page styled, sitemap.xml + robots.txt 200, zero console errors, lint clean
- SSR HTML verified to contain full product/article/hero content (grep on curl output)
- URLs now shareable as real paths: /products/kinsuroi-soft-cleanser-gel, /journal/the-ritual-of-body-care, dst.

---
Task ID: 3
Agent: Super Z (main agent)
Task: Update KINSUROI per 16-point requirement list — 3 kategori produk, product card/detail baru, per-product Cara Pakai, CMS lengkap + character counter, WhatsApp CTA 085888244750, Supabase Storage, keamanan CMS, Company page, logo/favicon dari foto owner

Work Log:
- Schema (additive, backward-compatible): Product += problem/price/purchaseUrl (prisma db push; supabase/schema.sql disamakan). Data existing tidak dihapus.
- scripts/migrate-v3.ts: kategori dirapikan jadi 3 (Face Care / Lip Care / Body Care; Serum di-merge ke Face Care lalu dihapus), urutan produk 1–12 sesuai penomoran owner, produk #7 baru (Lip Care "Segera Hadir", placeholder), contact_whatsapp=085888244750, 5 setting company_* dibuat, row admin_password DIHAPUS dari DB. seed.ts disamakan untuk install baru.
- scripts/make-brand-assets.ts (sharp): foto owner (upload/Screenshot_20260915-193330.jpg) → public/images/kinsuroi-logo.png (transparan, dipakai di navbar/menu mobile/login CMS) + src/app/icon.png & apple-icon.png (favicon = crop bola emas kinbaki, bbox diukur via pixel scan) + kinsuroi-placeholder.jpg (placeholder produk #7, bukan foto produk palsu).
- Storage (req 16): src/lib/storage.ts (Supabase Storage REST via service-role server-side + fallback lokal public/uploads saat env kosong), /api/upload route BARU (admin-only, validasi MIME/5MB, nama file acak aman, GET status storage, DELETE server-side), next.config remotePatterns *.supabase.co, ImageField CMS: Replace/Remove/preview + indikator Supabase vs Local.
- Keamanan (req 9): ADMIN_PASSWORD/ADMIN_SECRET hanya di .env (git-ignored; .env di-untrack dari git index), auth.ts checkAdminPassword (timing-safe, tanpa default/hardcode), login route tanpa lookup DB + error generik, /api/settings GET/PUT menfilter secret keys, hint password di halaman login DIHAPUS, supabase/README.md ditulis ulang.
- Frontend: types.ts buyCta() (purchaseUrl → marketplaceUrl → wa.me/628588244750?text="Halo, saya ingin membeli {nama}."), ProductCard baru (kategori/nama/Problem 1 baris/Manfaat 1 baris/Harga/CTA Beli; kartu #7 = chip "Segera Hadir"), ProductDetailView baru (Nama→Problem→Manfaat→Harga→CTA→accordion CARA PAKAI/INGREDIENT HIGHLIGHT/DESKRIPSI LENGKAP + FAQ), ProductsView (kategori sticky + swipeable mobile), Navbar/Footer + menu Company, HomeView Collection fix (settings scope bug).
- Company page (req 10): /company + CompanyView (5 seksi: About/Vision&Mission/Values/Quality/Company Information dari data contact asli; seksi kosong = placeholder, TIDAK mengarang fakta), metadata + canonical + OG, sitemap += /company.
- CMS (req 5,6): ProductEditor += Problem(80)/Manfaat(100)/Cara Pakai(500)/Ingredient Highlight(300)/Deskripsi(1000)/Harga/Purchase URL, CharCounter "72 / 80 characters" + "Content is longer than recommended." (warning, TIDAK memblokir save), tab Company baru di AdminView, "View site" fix → /.
- Validasi (req 15): lint clean; bundle client dipindai → 0 kemunculan password; kategori/urutan terverifikasi via DB (Face 6, Lip 3, Body 3); filter kategori via browser OK; WhatsApp CTA href diverifikasi; accordion buka/tutup OK; CMS login + editor + counter (95/80 warning tampil) + save OK; CRUD produk API create/patch/delete + 401 tanpa cookie; upload API valid(JPG)/invalid(PDF ditolak) + file tersaji; regression 13 route 200 + 404 page; sitemap 21 URL; metadata produk (#7) + /company + favicon icon.png/apple-icon.png terpasang; responsive dicek 390/768/1280; data uji dibersihkan (problem/price produk 1 kembali null, row test dihapus).

Stage Summary:
- Seluruh 16 requirement terpenuhi; katalog 12 produk (Face Care 1,2,3,4,11,12 · Lip Care 5,6,7 · Body Care 8,9,10), produk #7 menunggu foto final via CMS upload (slot siap, otomatis tampil setelah upload).
- Credential CMS kini env-only (ADMIN_PASSWORD di .env, tidak ada di source/Git/bundle/API/login page); password lama masih berlaku agar owner tidak terkunci.
- Supabase Storage aktif otomatis saat NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY diisi (bucket product-images); preview sandbox jalan dengan fallback lokal tanpa mengubah flow CMS.

---
Task ID: 4
Agent: Super Z (main agent)
Task: Push project ke github.com/danielbung-hash/kinsuroi.dev (token PAT diberikan user)

Work Log:
- Audit pra-push: upload route src/app/api/upload/route.ts ditemukan hilang dari working tree (dipulihkan dari HEAD; CMS fields.tsx merujuknya) — login CMS diverifikasi 200 setelah env dipulihkan.
- .env hanya berisi DATABASE_URL (ADMIN_PASSWORD/ADMIN_SECRET hilang akibat reset sandbox) — dikembalikan: ADMIN_PASSWORD=password lama owner, ADMIN_SECRET=random hex-32; login /api/admin/login = 200.
- Temuan secret: string password ada di db/custom.db (freelist SQLite), worklog.md line 26, tool-results/*.txt, dan visuo pada screenshot login versi lama → db di-VACUUM (string hilang), worklog diredaksi, semuanya di-gitignore.
- .gitignore += /db/ /tool-results/ /download/ /public/uploads/ scripts/*.png scripts/*.html; dibuat README.md (setup, env vars, struktur) + .env.example (nama var saja, tanpa nilai asli).
- Histori git lama (5 commit) terbukti mengandung password di 4 commit → dibangun ulang jadi 1 commit bersih (5b8e68e, 159 file); verifikasi: git grep password = 0, db/tool-results/.env/download tidak ter-track.
- Remote dicek: repo PUBLIK dan sudah berisi snapshot lama yang BOCOR (password di worklog.md, db/custom.db, seed.ts, login route fallback, AdminView default hint + histori commit).
- Percobaan push force (x-access-token / oauth2 / username+token) → GAGAL semua: "Invalid username or token"; REST API juga 401 Bad credentials. Token tidak valid/expired/revoked untuk operasi tulis. Bacaanonim OK karena repo publik.
- Remote origin di-set (URL bersih tanpa token). Push menunggu token baru dengan izin Contents: Read and write.

Stage Summary:
- Repo lokal SIAP PUSH: 1 commit bersih tanpa secret, 159 file, CMS jalan (login 200).
- Setelah token valid diterima: git push --force origin main (menimpa snapshot lama yang bocor).
- Rekomendasi keamanan ke owner: ganti ADMIN_PASSWORD di .env deployment (password lama sudah pernah muncul di chat & repo publik), revoke PAT lama, pertimbangkan recreate repo agar histori lama yang bocor hilang total.

---
Task ID: 5
Agent: Super Z (main agent)
Task: Push ulang dengan token baru user

Work Log:
- Token baru (fine-grained PAT, 93 char) divalidasi: login danielbung-hash, repo kinsuroi.dev (public), permissions push:true.
- git push --force origin main BERHASIL: 3f5ae50 → 29eedef (forced update). Remote HEAD = 29eedef30 = local main (2 commit bersih, 159 file, tanpa secret).
- Snapshot lama yang membocorkan password admin tertimpa dari branch utama.

Stage Summary:
- github.com/danielbung-hash/kinsuroi.dev kini berisi versi bersih final project KINSUROI.
- Sisa tindakan owner: revoke kedua token lama yang pernah dikirim di chat, ganti ADMIN_PASSWORD di .env deployment, (opsional) purge histori lama via GitHub Support / recreate repo agar commit bocor tidak reachable by SHA.

---
Task ID: 6
Agent: Super Z (main agent)
Task: Fix build error Vercel — TypeError: Invalid URL di next.config

Work Log:
- Akar masalah: next.config.ts memanggil new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) saat load; env var yang di-set KOSONG/tidak valid di Vercel → new URL("") throw → build mati (ERR_INVALID_URL, input [REDACTED] = env var).
- Fix next.config.ts: supabaseHostFromEnv() — trim, guard kosong, try/catch; nilai invalid diabaikan dengan warning (wildcard **.supabase.co tetap mencakup host asli).
- Fix src/lib/storage.ts: supabaseConfig() memvalidasi URL (parse + protokol http/https) sebelum dipakai; invalid → fallback local storage, tidak crash runtime.
- Verifikasi: NEXT_PUBLIC_SUPABASE_URL="" bun run build → EXIT 0, semua route ter-compile (statis + dinamis).
- Dev server sandbox di-restart, preview HTTP 200.

Stage Summary:
- Build tahan terhadap env Supabase hilang/kosong/salah; deploy Vercel bisa di-retry.
- Catatan owner: isi NEXT_PUBLIC_SUPABASE_URL (https://<ref>.supabase.co) + SUPABASE_SERVICE_ROLE_KEY di Vercel jika ingin Storage aktif — tanpa itu upload CMS jatuh ke disk lokal yang ephemeral di Vercel.

---
Task ID: 7
Agent: Super Z (main agent)
Task: Fix build Vercel (lanjutan) + integrasi perubahan schema user (sqlite→postgresql)

Work Log:
- User mengubah prisma/schema.prisma di GitHub: provider sqlite→postgresql + directUrl=env("DIRECT_URL") (persiapan Supabase).
- Rebase fix build (6141033) di atas commit user (e24235a) — tanpa konflik — lalu push fast-forward.
- Bootstrap API terverifikasi TIDAK auto-seed → DB Supabase kosong = situs kosong; owner harus seed (scripts/seed.ts) atau jalankan supabase/schema.sql sebelum/vimala setelah deploy.
- Catatan lokal: prisma client di sandbox tetap sqlite-generated; JANGAN jalankan prisma generate lokal sebelum ada Postgres yang bisa dihubungi (akan memutus preview). Untuk Vercel: build command disarankan "prisma generate && bun run build".

Stage Summary:
- Build anti-crash terhadap NEXT_PUBLIC_SUPABASE_URL kosong; schema postgresql user dipertahankan.
- Checklist Vercel: DATABASE_URL (pooled :6543), DIRECT_URL (direct :5432), ADMIN_PASSWORD, ADMIN_SECRET, NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (jangan kosong); seed DB Supabase.

---
Task ID: 8
Agent: Super Z (main agent)
Task: DB Supabase kosong di produksi → auto-provision runtime (schema + seed)

Work Log:
- Live site ditemukan: https://kinsuroi-dev.vercel.app (200) — /api/bootstrap: 0 settings/categories/products/articles (DB Supabase kosong).
- src/lib/seed.ts BARU: data seed terpusat (3 kategori, 12 produk, 3 artikel, 31 settings) + seedDatabase(client) idempoten (upsert by slug/key; field klaim owner tidak pernah ditimpa nilai kosong).
- src/lib/db-setup.ts BARU: ensureDatabase() — probe tabel; jika tidak ada → CREATE TABLE IF NOT EXISTS (4 tabel, DDL = schema.prisma) → seed jika category.count()===0; never-throw, ready-flag + in-flight lock, retry otomatis di request berikutnya.
- Wire ensureDatabase(): getBootstrapData (semua halaman SSR) + API bootstrap/products/categories/articles/settings (first-load CMS).
- scripts/seed.ts direfaktor jadi wrapper tipis seedDatabase — CLI tetap jalan (diverifikasi idempoten di sqlite lokal).
- Verifikasi: tsc (error tersisa pre-existing di examples/skills + 1 mismatch lama tertutup ignoreBuildErrors), bun run build EXIT 0, preview 200 + bootstrap 12/3/3/31.

Stage Summary:
- Deploy berikutnya self-provisioning: kunjungan pertama membuat tabel + mengisi data di Supabase otomatis. Fallback manual: prisma db push + bun scripts/seed.ts.

---
Task ID: 9
Agent: Super Z (main agent)
Task: Deploy produksi live & terverifikasi

Work Log:
- Vercel auto-redeploy setelah push 1313469; polling /api/bootstrap: attempt pertama menangkap provision mid-flight (0/3/12/1 — race antar instance serverless), attempt kedua konvergen penuh 31/3/12/3.
- Verifikasi live kinsuroi-dev.vercel.app: /, /products, /company, /journal, detail produk, /admin → semua 200; nama produk tampil di homepage; WhatsApp CTA benar (wa.me/628588244750).

Stage Summary:
- Produksi LIVE dengan data lengkap & self-provisioning: DB Supabase terisi otomatis pada request pertama.
- Sisa untuk owner: login CMS (/admin, password = ADMIN_PASSWORD di Vercel) → isi klaim produk (problem/manfaat/harga/cara pakai — sengaja kosong, tidak dikarang), upload foto final produk #7, dan revocation token lama.

---
Task ID: 10
Agent: Super Z (main agent)
Task: Fix upload foto di Vercel (ENOENT mkdir /var/task/public) + kompresi gambar + tombol seed/repair di CMS

Work Log:
- Diagnosis: error `ENOENT mkdir '/var/task/public'` terjadi karena upload jatuh ke fallback lokal saat env Supabase belum terbaca di serverless (filesystem Vercel read-only → crash).
- src/lib/storage.ts: (1) auto-create bucket `product-images` (public, limit 5MB) via service key saat upload pertama + retry sekali saat 404; (2) guard `process.env.VERCEL === '1'` → fallback lokal diganti error Indonesia yang actionable (bukan crash ENOENT); (3) delete error di-log, 404 diabaikan.
- src/lib/db-setup.ts: DDL + seed sekarang jalan via klien ephemeral `DIRECT_URL` (port 5432) karena CREATE TABLE tidak reliable lewat pooler 6543 (PgBouncer); klien diputus setelah provisioning; fallback ke klien utama di lokal (sqlite tetap aman).
- src/lib/seed.ts: tambah `seedMissing()` — repair-mode yang hanya MENAMBAH baris hilang by slug/key, tidak pernah menimpa konten owner.
- src/app/api/seed/route.ts (baru): POST = repair seed (admin-only), GET = jumlah baris (admin-only).
- src/components/kinsuroi/AdminView.tsx: panel "Database tools" di overview — deteksi DB kosong (badge "Empty") + tombol "Seed default content"/"Seed / repair content" dengan konfirmasi AlertDialog; toast ringkasan jumlah baris yang ditambahkan.
- src/components/kinsuroi/admin/fields.tsx: kompresi gambar sisi browser sebelum upload (foto > 1.2MB → max 2000px, WebP utk PNG/WebP dengan alpha, JPEG 0.85 lainnya) supaya lolos batas body 4.5MB serverless; pesan error ukuran diperbarui.
- next.config.ts: remotePatterns + `**.supabase.com` (host project Supabase baru).
- README.md: tabel env (DATABASE_URL pooler 6543 + pgbouncer=true, DIRECT_URL 5432), checklist deploy Vercel, penjelasan upload produksi.
- Build test: `NEXT_PUBLIC_SUPABASE_URL="" bun run build` exit 0 (semua route termasuk /api/seed).
- Runtime test lokal: home 200; login 200; GET /api/seed → {3,12,3,31}; POST /api/seed → ok, 0 ditambahkan (repair mode benar, semua sudah ada); POST /api/upload lokal → 201 file tersimpan.

Stage Summary:
- Upload/ganti/hapus foto di produksi kini berfungsi: Supabase Storage target utama dengan bucket auto-provisioned; tanpa env → pesan jelas, bukan crash.
- DB Supabase aman self-provision (DDL via DIRECT_URL) dan CMS punya tombol seed/repair non-destruktif.
- Foto HP besar otomatis dikompres di browser sebelum upload.
- Owner tetap perlu: set env NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY di Vercel (bila belum), lalu redeploy.

---
Task ID: 11
Agent: Super Z (main agent)
Task: Merge halaman Company+About (template PDF) + section testimoni foto di homepage

Work Log:
- Sinkronisasi git: sandbox checkpoint merusak history lokal (kode Task 10 hilang + schema sqlite); reset ke origin/main yang berisi commit foto baru owner (hero.jpg, brand.jpg) + schema postgresql. /upload/ di-gitignore.
- Ekstrak 3 foto dari "PT Derma Company Profile_compressed.pdf" (pdfimages + sharp): founder portrait, fasilitas lab+produksi, founder di lab → public/images/company/*.jpg (scripts/extract-pdf-images.ts).
- Merge Company+About → SATU halaman /about "Tentang KINSUROI — Company Profile" mengikuti template PDF: 01 Siapa Kami (+facts grid), 02 Kenapa Pabrik Sendiri (+2 kartu highlight + kutipan besar), 03 Formulasi & Produksi In-House (+Encapsulation +Ekstrak Alami), 04 Brand KINSUROI (+Kintsukuroi), Visi&Misi + Nilai (opsional, tampil jika terisi), Company Information. /company → redirect 308 permanen via next.config; CompanyView.tsx dihapus; Navbar/Footer/sitemap dibersihkan.
- seed.ts: 18 setting company_* baru berisi konten literal dari PDF (siapa kami, founder, facts, pabrik, kontrol kualitas, tanggung jawab, kutipan, produksi, encapsulation, ekstrak alami, brand story, kintsukuroi, visi, nilai, 3 path foto). seedMissing kini MENGISI setting yang masih kosong (tidak pernah menimpa isi owner) → owner cukup klik "Seed / repair content" di CMS agar konten PDF masuk ke database produksi.
- Testimonial: model baru di prisma/schema.prisma (postgres) + prisma/schema.local.prisma (sqlite mirror utk sandbox) + DDL db-setup + supabase/schema.sql; API /api/testimonials (GET publik/admin, POST admin) & /api/testimonials/[id] (PATCH/DELETE admin; DELETE juga menghapus file foto dari storage); bootstrap/data/store membawa testimonials (dengan guard catch utk kompatibilitas).
- Homepage: section "KATA MEREKA" (galeri foto testimoni 4:5, snap-scroll, caption/nama/sumber opsional), disembunyikan otomatis saat kosong, diposisikan setelah CTA banner.
- CMS: tab "Testimoni" (list + editor dialog + ImageField upload + status draft/published + urutan + konfirmasi hapus); tab Company dirombak jadi 5 section sesuai struktur PDF (termasuk 3 ImageField foto).
- .env sandbox dipulihkan (ADMIN_PASSWORD/ADMIN_SECRET hilang karena reset).
- Verifikasi: build exit 0; login 200; seed repair menambah/mengisi 17 setting; bootstrap membawa company_about 1152 chars; /about merender semua section; /company → 308 /about; testimoni create 201 → tampil di homepage ("KATA MEREKA") → PATCH 200 → DELETE 200.

Stage Summary:
- Halaman Tentang kini = Company Profile resmi (dari PDF), CMS Company tab mengikuti struktur PDF, foto founder/fasilitas otomatis terpasang.
- Testimoni foto bisa dikelola penuh via CMS (upload/ganti/hapus/urutan/draft) dan tampil elegan di beranda.
- Owner perlu: klik "Seed / repair content" di /admin (mengisi konten PDF ke DB produksi), lalu upload foto testimoni via tab Testimoni.

---
Task ID: 12
Agent: Super Z (main agent)
Task: Isi data Company dari PDF resmi (email/alamat/Instagram/paragraf Lab & Produksi/klaim portofolio produk) + perbaikan DDL agar tabel baru terbentuk di DB produksi lama

Work Log:
- Perbaikan db-setup.ts: DDL idempoten (CREATE TABLE IF NOT EXISTS) kini SELALU dijalankan pada provisioning — sebelumnya hanya jalan bila tabel Category tidak ada, sehingga tabel "Testimonial" TIDAK AKAN PERNAH terbentuk di DB produksi yang sudah terisi (tab CMS akan error). tablesExist() yang tak terpakai dihapus.
- seed.ts disesuaikan dengan PDF resmi: contact_email = danieramardika@gmail.com (kosong → diisi repair), contact_address = teks persis PDF ("Komplek Sentra Niaga Surya Kadu Blok F.9 ... Kabupaten Tangerang, Banten 15810"), social_instagram = https://www.instagram.com/kinsuroi, setting BARU company_lab (paragraf "Setiap formula dikembangkan, diuji, disempurnakan..." dari halaman 03 PDF).
- productClaims: 7 klaim manfaat resmi dari section PRODUCT PORTFOLIO PDF (Soft Cleanser Gel, L-Active C+, Retinol Serum+, Lip Balm, Shower Öl, Body Öl, Body Lotion Retinol) → diisi HANYA ke produk yang field benefits-nya masih kosong (fillEmptyClaims dipanggil di seedDatabase & seedMissing; klaim isi owner tidak pernah ditimpa).
- refreshLegacyAddress: alamat kontak lama hasil seed otomatis (versi singkat "Kota Tangerang...") diperbarui ke versi PDF HANYA bila masih byte-equal dengan seed lama (bukti belum diedit owner).
- AboutView.tsx: section 03 kini merender paragraf "Lab & Produksi" di antara narasi utama dan Bahan Baku Encapsulation. AdminView Company tab: field "Lab & Produksi" ditambahkan.
- scripts/verify-seed.ts (baru): CLI verifikasi cepat isi settings/benefits + uji repair-mode.
- Testimonial uji ("Sarah M." dari sesi sebelumnya) dihapus dari DB lokal agar CMS owner mulai bersih.
- Verifikasi (Agent Browser): /about merender semua section PDF (01 Siapa Kami + foto founder, 02 Pabrik + 2 kartu + kutipan, 03 Produksi + Lab & Produksi + Encapsulation + Ekstrak Alami, 04 Brand + Kintsukuroi, Visi, Nilai, Company Information dengan email baru) desktop 1280 + mobile 390; beranda menyembunyikan "KATA MEREKA" saat kosong; CMS Testimoni: buat (201) → tampil di beranda → hapus OK tanpa error konsol; kartu produk kini menampilkan klaim PDF; lint clean; build exit 0; repair-mode lokal melaporkan 0 baris baru (idempoten benar).
- Commit 7dec341 dibuat lokal. PUSH BELUM BISA: remote tanpa kredensial (token lama sengaja dihapus dari URL) — butuh PAT baru dari owner.

Stage Summary:
- Seluruh data Company Profile kini bersumber dari PDF resmi dan tetap bisa diedit via CMS (tab Company, Social & Contact, dan editor produk).
- Owner: (1) kirim PAT baru (Contents: Read and write) agar commit 7dec341 bisa di-push → Vercel auto-redeploy membaca SUPABASE_SERVICE_ROLE_KEY yang baru ditambahkan; (2) setelah deploy, buka /admin → klik "SEED / REPAIR CONTENT" sekali untuk mengisi konten PDF + klaim produk + tabel Testimonial ke DB produksi; (3) upload foto testimoni via tab Testimoni.
