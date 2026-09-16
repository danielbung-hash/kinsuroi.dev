// KINSUROI — /api/seed
// Admin-only content repair endpoint. Adds the default catalog rows that are
// missing from the connected database (12 products, 3 categories, 3 journal
// stories, site settings). Rows that already exist are NEVER touched, so
// owner-entered CMS content stays intact.
//
// POST → { ok, categories, products, articles, settings }  (created counts)

import { db } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/auth'
import { ensureDatabase } from '@/lib/db-setup'
import { seedMissing } from '@/lib/seed'

export const dynamic = 'force-dynamic'

export async function POST() {
  if (!(await isAdmin())) return unauthorized()
  try {
    // Make sure the schema exists first (fresh Supabase project)
    await ensureDatabase()
    const report = await seedMissing(db)
    return Response.json({ ok: true, ...report })
  } catch (e) {
    console.error('seed error', e)
    return Response.json(
      {
        error:
          e instanceof Error
            ? e.message
            : 'Seed gagal — cek koneksi DATABASE_URL / DIRECT_URL di server.',
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  if (!(await isAdmin())) return unauthorized()
  try {
    await ensureDatabase()
    const [categories, products, articles, settings] = await Promise.all([
      db.category.count(),
      db.product.count(),
      db.article.count(),
      db.siteSetting.count(),
    ])
    return Response.json({ categories, products, articles, settings })
  } catch (e) {
    console.error('seed status error', e)
    return Response.json({ error: 'Database unreachable' }, { status: 500 })
  }
}
