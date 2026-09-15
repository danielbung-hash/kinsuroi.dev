import { db } from '@/lib/db'
import type { BootstrapData } from '@/lib/types'

export const dynamic = 'force-dynamic'

/** Public bootstrap payload — everything the storefront needs. Excludes admin secrets. */
export async function GET() {
  try {
    const [settings, categories, products, articles] = await Promise.all([
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
    ])

    const payload: BootstrapData & { settings: Record<string, string> } = {
      settings: Object.fromEntries(settings.filter((s) => s.key !== 'admin_password').map((s) => [s.key, s.value])),
      categories,
      products,
      articles,
    }

    return Response.json(payload, { headers: { 'Cache-Control': 'no-store' } })
  } catch (e) {
    console.error('bootstrap error', e)
    return Response.json({ settings: {}, categories: [], products: [], articles: [] }, { status: 200 })
  }
}
