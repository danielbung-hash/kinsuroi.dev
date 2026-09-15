import { db } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** PATCH /api/articles/[id] */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized()
  const { id } = await params
  try {
    const b = await req.json()
    const data: Record<string, unknown> = {}
    for (const f of ['title', 'slug', 'excerpt', 'content', 'thumbnail', 'author', 'topic', 'seoTitle', 'seoDescription', 'status'] as const) {
      if (f in b) data[f] = b[f] === '' ? null : b[f]
    }
    if ('publishedAt' in b) {
      data.publishedAt = b.publishedAt ? new Date(b.publishedAt) : null
    }
    if ('status' in b && b.status === 'published' && !data.publishedAt) {
      const current = await db.article.findUnique({ where: { id } })
      if (!current?.publishedAt) data.publishedAt = new Date()
    }
    const article = await db.article.update({ where: { id }, data })
    return Response.json(article)
  } catch (e) {
    console.error('article update error', e)
    return Response.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

/** DELETE /api/articles/[id] */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized()
  const { id } = await params
  try {
    await db.article.delete({ where: { id } })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('article delete error', e)
    return Response.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
