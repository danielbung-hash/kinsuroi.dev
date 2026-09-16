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

async function provision(): Promise<void> {
  const { client, ephemeral } = schemaClient()
  try {
    // DDL is idempotent (CREATE TABLE IF NOT EXISTS) and cheap — always run it
    // so tables added in newer releases (e.g. "Testimonial") are created even
    // on databases that were provisioned by an older version of the site.
    for (const stmt of DDL) {
      await client.$executeRawUnsafe(stmt)
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
