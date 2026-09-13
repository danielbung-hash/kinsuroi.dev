import { db } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** PATCH /api/products/[id] — update */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized()
  const { id } = await params
  try {
    const b = await req.json()
    const data: Record<string, unknown> = {}

    const stringFields = [
      'name', 'slug', 'categoryId', 'shortDesc', 'description', 'benefits', 'ingredients',
      'howToUse', 'suitableFor', 'image', 'gallery', 'faq', 'status', 'marketplaceUrl',
      'seoTitle', 'seoDescription',
    ] as const
    for (const f of stringFields) {
      if (f in b) data[f] = b[f] === '' ? null : b[f]
    }
    if ('featured' in b) data.featured = !!b.featured
    if ('order' in b) data.order = typeof b.order === 'number' ? b.order : 99
    if (data.status === 'draft' || data.status === 'published') { /* valid */ }
    else if ('status' in b) data.status = 'published'

    const product = await db.product.update({ where: { id }, data, include: { category: true } })
    return Response.json(product)
  } catch (e) {
    console.error('product update error', e)
    return Response.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

/** DELETE /api/products/[id] */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized()
  const { id } = await params
  try {
    await db.product.delete({ where: { id } })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('product delete error', e)
    return Response.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}
