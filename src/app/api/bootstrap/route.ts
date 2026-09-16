import { db } from '@/lib/db'
import { ensureDatabase } from '@/lib/db-setup'
import type { BootstrapData } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** Public bootstrap payload — everything the storefront needs. Excludes admin secrets. */
export async function GET() {
  try {
    await ensureDatabase()
    const [settings, categories, products, articles, testimonials] = await Promise.all([
      db.siteSetting.findMany(),
      db.category.findMany({ orderBy: { order: 'asc' } }),
      db.product.findMany({
        where: { status: 'published' },
        orderBy: { order: 'asc' },
        include: { category: true },
      }),
      db.article.findMany({
        where: { status: 'published' },
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      }),
      // Optional table — deployments provisioned before it keep working
      db.testimonial
        .findMany({ where: { status: 'published' }, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
        .catch(() => []),
    ])

    const payload: BootstrapData & { settings: Record<string, string> } = {
      settings: Object.fromEntries(settings.filter((s) => s.key !== 'admin_password').map((s) => [s.key, s.value])),
      categories,
      products,
      articles,
      testimonials,
    }

    return Response.json(payload, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    console.error('bootstrap error', e)
    return Response.json({ settings: {}, categories: [], products: [], articles: [], testimonials: [] }, { status: 200 })
  }
}
