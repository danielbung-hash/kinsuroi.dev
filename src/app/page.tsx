import { db } from '@/lib/db'
import { KinsuroiApp } from '@/components/kinsuroi/KinsuroiApp'
import type { BootstrapData } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getInitialData(): Promise<BootstrapData> {
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

    return {
      settings: Object.fromEntries(
        settings.filter((s) => s.key !== 'admin_password').map((s) => [s.key, s.value]),
      ),
      categories,
      products,
      articles,
    }
  } catch (e) {
    console.error('initial data error', e)
    return { settings: {}, categories: [], products: [], articles: [] }
  }
}

export default async function Page() {
  const initial = await getInitialData()
  return <KinsuroiApp initial={initial} />
}
