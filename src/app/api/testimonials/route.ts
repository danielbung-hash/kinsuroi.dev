// KINSUROI — /api/testimonials
// Homepage testimonial photo cards, managed via the admin CMS.
//
// GET    → list (admin: all rows; public: published only)
// POST   → create (admin)  { image, name?, caption?, source?, status?, order? }

import { db } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/auth'
import { ensureDatabase } from '@/lib/db-setup'

export const dynamic = 'force-dynamic'

export async function GET() {
  const admin = await isAdmin()
  try {
    await ensureDatabase()
    const rows = await db.testimonial
      .findMany({
        where: admin ? {} : { status: 'published' },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      })
      .catch(() => [])
    return Response.json(rows)
  } catch (e) {
    console.error('testimonial list error', e)
    return Response.json([], { status: 200 })
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const b = await req.json()
    if (!b.image || typeof b.image !== 'string') {
      return Response.json({ error: 'Foto testimoni wajib diunggah.' }, { status: 400 })
    }
    const created = await db.testimonial.create({
      data: {
        image: b.image,
        name: typeof b.name === 'string' && b.name.trim() ? b.name.trim() : null,
        caption: typeof b.caption === 'string' && b.caption.trim() ? b.caption.trim() : null,
        source: typeof b.source === 'string' && b.source.trim() ? b.source.trim() : null,
        status: b.status === 'draft' ? 'draft' : 'published',
        order: typeof b.order === 'number' ? b.order : 99,
      },
    })
    return Response.json(created, { status: 201 })
  } catch (e) {
    console.error('testimonial create error', e)
    return Response.json({ error: 'Failed to create testimonial' }, { status: 500 })
  }
}
