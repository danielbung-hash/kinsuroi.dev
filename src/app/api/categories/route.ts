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

/** GET /api/categories */
export async function GET() {
  const categories = await db.category.findMany({ orderBy: { order: 'asc' }, include: { _count: { select: { products: true } } } })
  return Response.json(categories)
}

/** POST /api/categories */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const b = await req.json()
    if (!b.name) return Response.json({ error: 'Name is required' }, { status: 400 })
    const slug = b.slug ? slugify(b.slug) : slugify(b.name)
    const exists = await db.category.findUnique({ where: { slug } })
    const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug
    const category = await db.category.create({
      data: {
        name: b.name,
        slug: finalSlug,
        description: b.description || null,
        order: typeof b.order === 'number' ? b.order : 99,
      },
    })
    return Response.json(category, { status: 201 })
  } catch (e) {
    console.error('category create error', e)
    return Response.json({ error: 'Failed to create category' }, { status: 500 })
  }
}

/** PATCH /api/categories?id=... */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return Response.json({ error: 'id required' }, { status: 400 })
    const b = await req.json()
    const data: Record<string, unknown> = {}
    if ('name' in b) data.name = b.name
    if ('description' in b) data.description = b.description || null
    if ('order' in b) data.order = typeof b.order === 'number' ? b.order : 99
    const category = await db.category.update({ where: { id }, data })
    return Response.json(category)
  } catch (e) {
    console.error('category update error', e)
    return Response.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

/** DELETE /api/categories?id=... */
export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return Response.json({ error: 'id required' }, { status: 400 })
    // Products keep existing but become uncategorised (onDelete: SetNull)
    await db.category.delete({ where: { id } })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('category delete error', e)
    return Response.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}
