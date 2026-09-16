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
]

let ready = false
let inflight: Promise<void> | null = null

/** True when the CMS tables already exist and are queryable. */
async function tablesExist(): Promise<boolean> {
  try {
    await db.$queryRawUnsafe('SELECT 1 FROM "Category" LIMIT 1')
    return true
  } catch {
    return false
  }
}

async function provision(): Promise<void> {
  if (!(await tablesExist())) {
    for (const stmt of DDL) {
      await db.$executeRawUnsafe(stmt)
    }
    console.log('kinsuroi: database schema created')
  }

  // Seed only a truly empty catalog — never touch an owner-populated one.
  const count = await db.category.count()
  if (count === 0) {
    await seedDatabase(db)
    console.log('kinsuroi: database seeded (12 products, 3 articles, site settings)')
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
