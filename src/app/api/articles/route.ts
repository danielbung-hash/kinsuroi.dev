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

/** GET /api/articles — admin: all; public: published only */
export async function GET() {
  const admin = await isAdmin()
  const articles = await db.article.findMany({
    where: admin ? {} : { status: 'published' },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
  })
  return Response.json(articles)
}

/** POST /api/articles */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const b = await req.json()
    if (!b.title) return Response.json({ error: 'Title is required' }, { status: 400 })
    const slug = b.slug ? slugify(b.slug) : slugify(b.title)
    const exists = await db.article.findUnique({ where: { slug } })
    const finalSlug = exists ? `${slug}-${Date.now().toString(36)}` : slug

    const article = await db.article.create({
      data: {
        title: b.title,
        slug: finalSlug,
        excerpt: b.excerpt || null,
        content: b.content || null,
        thumbnail: b.thumbnail || null,
        author: b.author || 'KINSUROI Editorial',
        topic: b.topic || null,
        publishedAt: b.publishedAt ? new Date(b.publishedAt) : b.status === 'published' ? new Date() : null,
        seoTitle: b.seoTitle || null,
        seoDescription: b.seoDescription || null,
        status: b.status === 'draft' ? 'draft' : 'published',
      },
    })
    return Response.json(article, { status: 201 })
  } catch (e) {
    console.error('article create error', e)
    return Response.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
