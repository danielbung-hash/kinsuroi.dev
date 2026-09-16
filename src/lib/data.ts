// KINSUROI — server-side data helpers (Prisma → pages)
import { db } from '@/lib/db'
import { ensureDatabase } from '@/lib/db-setup'
import type { BootstrapData } from '@/lib/types'

export async function getBootstrapData(): Promise<BootstrapData> {
  // First request on a fresh deployment provisions schema + seed data.
  await ensureDatabase()
  try {
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
      // Optional table — older deployments without it keep rendering
      db.testimonial
        .findMany({ where: { status: 'published' }, orderBy: [{ order: 'asc' }, { createdAt: 'desc' }] })
        .catch(() => []),
    ])

    return {
      settings: Object.fromEntries(
        settings.filter((s) => s.key !== 'admin_password').map((s) => [s.key, s.value]),
      ),
      categories,
      products,
      articles,
      testimonials,
    }
  } catch (e) {
    console.error('kinsuroi: failed to load bootstrap data', e)
    return { settings: {}, categories: [], products: [], articles: [], testimonials: [] }
  }
}
