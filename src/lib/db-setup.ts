// KINSUROI — Runtime database auto-provision.
//
// Makes a fresh deployment self-provisioning: on the first request, if the
// database is unreachable-empty (no tables), the PostgreSQL schema is created
// and the catalog is seeded. This mirrors `prisma db push` + `scripts/seed.ts`
// so the owner never has to run migration commands by hand.
//
// Safety properties:
//   • Never throws — a failed provision only logs a warning; every caller
//     keeps its existing error handling (site renders, CMS shows an error).
//   • Idempotent — DDL uses IF NOT EXISTS; seeding upserts by slug/key and
//     never overwrites owner-entered CMS content with empty values.
//   • Runs at most once per server instance (ready flag + in-flight lock).
import { db } from '@/lib/db'
import { seedDatabase } from '@/lib/seed'
import { PrismaClient } from '@prisma/client'

// Matches prisma/schema.prisma (PostgreSQL) — the 4 CMS tables only.
const DDL: string[] = [
  `CREATE TABLE IF NOT EXISTS "Category" (
     "id" TEXT PRIMARY KEY,
     "name" TEXT NOT NULL,
     "slug" TEXT NOT NULL UNIQUE,
     "description" TEXT,
     "order" INTEGER NOT NULL DEFAULT 0,
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "updatedAt" TIMESTAMP(3) NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS "Product" (
     "id" TEXT PRIMARY KEY,
     "name" TEXT NOT NULL,
     "slug" TEXT NOT NULL UNIQUE,
     "categoryId" TEXT,
     "shortDesc" TEXT,
     "description" TEXT,
     "problem" TEXT,
     "price" TEXT,
     "benefits" TEXT,
     "ingredients" TEXT,
     "howToUse" TEXT,
     "suitableFor" TEXT,
     "image" TEXT,
     "gallery" TEXT,
     "faq" TEXT,
     "status" TEXT NOT NULL DEFAULT 'published',
     "featured" BOOLEAN NOT NULL DEFAULT false,
     "order" INTEGER NOT NULL DEFAULT 0,
     "purchaseUrl" TEXT,
     "marketplaceUrl" TEXT,
     "seoTitle" TEXT,
     "seoDescription" TEXT,
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "updatedAt" TIMESTAMP(3) NOT NULL,
     CONSTRAINT "Product_categoryId_fkey"
       FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
       ON DELETE SET NULL ON UPDATE CASCADE
   )`,
  `CREATE TABLE IF NOT EXISTS "Article" (
     "id" TEXT PRIMARY KEY,
     "title" TEXT NOT NULL,
     "slug" TEXT NOT NULL UNIQUE,
     "excerpt" TEXT,
     "content" TEXT,
     "thumbnail" TEXT,
     "author" TEXT NOT NULL DEFAULT 'KINSUROI Editorial',
     "topic" TEXT,
     "publishedAt" TIMESTAMP(3),
     "seoTitle" TEXT,
     "seoDescription" TEXT,
     "status" TEXT NOT NULL DEFAULT 'draft',
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "updatedAt" TIMESTAMP(3) NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS "SiteSetting" (
     "key" TEXT PRIMARY KEY,
     "value" TEXT NOT NULL,
     "group" TEXT NOT NULL DEFAULT 'general',
     "updatedAt" TIMESTAMP(3) NOT NULL
   )`,
  `CREATE TABLE IF NOT EXISTS "Testimonial" (
     "id" TEXT PRIMARY KEY,
     "image" TEXT NOT NULL,
     "name" TEXT,
     "caption" TEXT,
     "source" TEXT,
     "status" TEXT NOT NULL DEFAULT 'published',
     "order" INTEGER NOT NULL DEFAULT 0,
     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
     "updatedAt" TIMESTAMP(3) NOT NULL
   )`,
]

// Column healing — heals databases provisioned by OLDER builds. CREATE TABLE
// IF NOT EXISTS never touches a table that already exists, so tables created
// before newer columns were introduced (e.g. "Product" missing "problem",
// "purchaseUrl", …) must be widened with ADD COLUMN IF NOT EXISTS. Every
// statement is idempotent; run only against PostgreSQL (SQLite local mirrors
// are managed by `prisma db push` and lack this syntax).
const ALTERS: string[] = [
  // ── Category ──
  `ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "description" TEXT`,
  `ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  // ── Product ──
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "categoryId" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "shortDesc" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "description" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "problem" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "price" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "benefits" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "ingredients" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "howToUse" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "suitableFor" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "image" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "gallery" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "faq" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'published'`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "purchaseUrl" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "marketplaceUrl" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  // ── Article ──
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "excerpt" TEXT`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "content" TEXT`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "thumbnail" TEXT`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "author" TEXT NOT NULL DEFAULT 'KINSUROI Editorial'`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "topic" TEXT`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "publishedAt" TIMESTAMP(3)`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'draft'`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  // ── SiteSetting ──
  `ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "value" TEXT NOT NULL DEFAULT ''`,
  `ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "group" TEXT NOT NULL DEFAULT 'general'`,
  `ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  // ── Testimonial ──
  `ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "image" TEXT`,
  `ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "name" TEXT`,
  `ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "caption" TEXT`,
  `ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "source" TEXT`,
  `ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'published'`,
  `ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "order" INTEGER NOT NULL DEFAULT 0`,
  `ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
  `ALTER TABLE "Testimonial" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP`,
]

// FK heal — older tables may pre-date the Product → Category constraint.
const FK_HEAL = `DO $$ BEGIN
  ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$`

let ready = false
let inflight: Promise<void> | null = null

/**
 * Schema-creation client. On serverless hosts DATABASE_URL points at the
 * transaction-pooler (port 6543, PgBouncer) where DDL is unreliable or
 * blocked — schema creation and seeding therefore run over DIRECT_URL
 * (port 5432) when available. Falls back to the main client locally.
 */
function schemaClient(): { client: PrismaClient; ephemeral: boolean } {
  const direct = process.env.DIRECT_URL?.trim()
  if (direct) {
    try {
      return { client: new PrismaClient({ datasourceUrl: direct, log: ['error'] }), ephemeral: true }
    } catch (e) {
      console.warn('kinsuroi: DIRECT_URL client could not be created —', e instanceof Error ? e.message : e)
    }
  }
  return { client: db, ephemeral: false }
}

// Single sentinel query — if every condition below is true, the database is
// already at the current schema and ALL DDL/ALTER statements can be skipped.
// This keeps cold starts fast (1 round-trip instead of 50+) while still
// self-healing databases provisioned by older builds.
const SCHEMA_UP_TO_DATE_SQL = `SELECT (
  to_regclass('"Category"') IS NOT NULL
  AND to_regclass('"Product"') IS NOT NULL
  AND to_regclass('"Article"') IS NOT NULL
  AND to_regclass('"SiteSetting"') IS NOT NULL
  AND to_regclass('"Testimonial"') IS NOT NULL
  AND EXISTS (SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public' AND table_name = 'Product' AND column_name = 'problem')
  AND EXISTS (SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public' AND table_name = 'Product' AND column_name = 'purchaseUrl')
  AND EXISTS (SELECT 1 FROM information_schema.columns
              WHERE table_schema = 'public' AND table_name = 'Article' AND column_name = 'publishedAt')
) AS up_to_date`

async function provision(): Promise<void> {
  const { client, ephemeral } = schemaClient()
  // Column/constraint healing is PostgreSQL-only: production always hits
  // Postgres (DIRECT_URL or a postgres DATABASE_URL); the SQLite local mirror
  // is managed by `prisma db push` and does not support this syntax.
  const runtimeUrl = (process.env.DATABASE_URL ?? '').trim().toLowerCase()
  const isPostgres = ephemeral || runtimeUrl.startsWith('postgres')
  try {
    // Fast path — schema already current → straight to the seed check.
    // (Huge cold-start win on serverless: one SELECT vs 50+ DDL round-trips.)
    let upToDate = false
    if (isPostgres) {
      try {
        const rows = (await client.$queryRawUnsafe<{ up_to_date: boolean }>(SCHEMA_UP_TO_DATE_SQL)) as unknown as {
          up_to_date: boolean
        }[]
        upToDate = Array.isArray(rows) && rows[0]?.up_to_date === true
      } catch {
        upToDate = false // tables missing / legacy shape → full heal below
      }
    }

    if (!upToDate) {
      // DDL is idempotent (CREATE TABLE IF NOT EXISTS) and cheap — always run it
      // so tables added in newer releases (e.g. "Testimonial") are created even
      // on databases that were provisioned by an older version of the site.
      for (const stmt of DDL) {
        await client.$executeRawUnsafe(stmt)
      }

      // Widen tables provisioned by older builds so every column the current
      // Prisma client expects exists (fixes "column … does not exist" 500s).
      // Each statement is independent — one failure never blocks the rest.
      if (isPostgres) {
        for (const stmt of ALTERS) {
          try {
            await client.$executeRawUnsafe(stmt)
          } catch (e) {
            console.warn('kinsuroi: column heal skipped —', e instanceof Error ? e.message.split('\n')[0] : e)
          }
        }
        try {
          await client.$executeRawUnsafe(FK_HEAL)
        } catch (e) {
          console.warn('kinsuroi: FK heal skipped —', e instanceof Error ? e.message.split('\n')[0] : e)
        }
      }
    }

    // Seed only a truly empty catalog — never touch an owner-populated one.
    const count = await client.category.count()
    if (count === 0) {
      await seedDatabase(client)
      console.log('kinsuroi: database seeded (12 products, 3 articles, site settings)')
    }
  } finally {
    if (ephemeral) await client.$disconnect().catch(() => {})
  }
}

/**
 * Call before the first DB read of a server instance. Resolves immediately
 * once provisioning has succeeded; failures are retried on the next call.
 */
export function ensureDatabase(): Promise<void> {
  if (ready) return Promise.resolve()
  if (!inflight) {
    inflight = provision()
      .then(() => {
        ready = true
      })
      .catch((e) => {
        console.warn(
          'kinsuroi: auto-provision skipped —',
          e instanceof Error ? e.message : e,
          '(the site keeps rendering; run `prisma db push` + `bun scripts/seed.ts` as a fallback)'
        )
      })
      .finally(() => {
        inflight = null
      })
  }
  return inflight
}
