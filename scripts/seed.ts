/**
 * KINSUROI — Database seed (Bahasa Indonesia)
 * Run: bun scripts/seed.ts
 *
 * Thin CLI wrapper around the shared seed in src/lib/seed.ts (single source
 * of truth — the same data also powers the runtime auto-provision on deploy).
 * Idempotent: upserts by slug/key, never overwrites owner-entered CMS content.
 */
import { PrismaClient } from '@prisma/client'
import { seedDatabase } from '../src/lib/seed'

const db = new PrismaClient()

seedDatabase(db)
  .then(() => console.log('Seed complete.'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
