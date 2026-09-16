// KINSUROI — /api/testimonials/[id]
// PATCH  → update (admin)
// DELETE → remove (admin)

import { db } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/auth'
import { deleteImage } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized()
  const { id } = await params
  try {
    const b = await req.json()
    const data: Record<string, unknown> = {}

    if ('image' in b) {
      if (!b.image || typeof b.image !== 'string') {
        return Response.json({ error: 'Foto tidak boleh kosong.' }, { status: 400 })
      }
      data.image = b.image
    }
    for (const f of ['name', 'caption', 'source'] as const) {
      if (f in b) data[f] = typeof b[f] === 'string' && b[f].trim() ? b[f].trim() : null
    }
    if ('status' in b) data.status = b.status === 'draft' ? 'draft' : 'published'
    if ('order' in b) data.order = typeof b.order === 'number' ? b.order : 99

    const updated = await db.testimonial.update({ where: { id }, data })
    return Response.json(updated)
  } catch (e) {
    console.error('testimonial update error', e)
    return Response.json({ error: 'Failed to update testimonial' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return unauthorized()
  const { id } = await params
  try {
    // Remove the photo file from storage, then the row
    const row = await db.testimonial.findUnique({ where: { id } }).catch(() => null)
    if (row?.image) await deleteImage(row.image)
    await db.testimonial.delete({ where: { id } })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('testimonial delete error', e)
    return Response.json({ error: 'Failed to delete testimonial' }, { status: 500 })
  }
}
