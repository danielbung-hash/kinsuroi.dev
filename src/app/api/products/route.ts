import { db } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
}

/** GET /api/products — admin: all; public: published only */
export async function GET() {
  const admin = await isAdmin()
  const products = await db.product.findMany({
    where: admin ? {} : { status: 'published' },
    orderBy: { order: 'asc' },
    include: { category: true },
  })
  return Response.json(products)
}

/** POST /api/products — create */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const b = await req.json()
    if (!b.name) return Response.json({ error: 'Name is required' }, { status: 400 })
    const slug = b.slug ? slugify(b.slug) : slugify(b.name)

    const exists = await db.product.findUnique({ where: { slug } })
    const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug

    const product = await db.product.create({
      data: {
        name: b.name,
        slug: finalSlug,
        categoryId: b.categoryId || null,
        shortDesc: b.shortDesc || null,
        description: b.description || null,
        benefits: b.benefits || null,
        ingredients: b.ingredients || null,
        howToUse: b.howToUse || null,
        suitableFor: b.suitableFor || null,
        image: b.image || null,
        gallery: b.gallery || null,
        faq: b.faq || null,
        status: b.status === 'draft' ? 'draft' : 'published',
        featured: !!b.featured,
        order: typeof b.order === 'number' ? b.order : 99,
        marketplaceUrl: b.marketplaceUrl || null,
        seoTitle: b.seoTitle || null,
        seoDescription: b.seoDescription || null,
      },
      include: { category: true },
    })
    return Response.json(product, { status: 201 })
  } catch (e) {
    console.error('product create error', e)
    return Response.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
