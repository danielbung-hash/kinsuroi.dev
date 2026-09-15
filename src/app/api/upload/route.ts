// KINSUROI — /api/upload
// Admin-only image upload → Supabase Storage (or local fallback in preview).
// The DB stores only the returned public URL; binaries never touch the database.
//
// POST   multipart/form-data { file, folder? } → { url, path, storage }
// DELETE ?path=…  → remove the file from storage (optional CMS cleanup)

import { isAdmin, unauthorized } from '@/lib/auth'
import { saveImage, deleteImage, storageMode, SUPABASE_BUCKET } from '@/lib/storage'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const form = await req.formData()
    const file = form.get('file')
    const folderRaw = form.get('folder')
    // Whitelist the target folder — never build paths from raw client input
    const folder = typeof folderRaw === 'string' && /^[a-z0-9-]{1,40}$/.test(folderRaw) ? folderRaw : 'products'

    if (!(file instanceof File)) {
      return Response.json({ error: 'No file received' }, { status: 400 })
    }

    const result = await saveImage(file, folder)
    return Response.json(result, { status: 201 })
  } catch (e) {
    console.error('upload error', e)
    return Response.json(
      { error: e instanceof Error ? e.message : 'Upload failed' },
      { status: 400 },
    )
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const { searchParams } = new URL(req.url)
    const target = searchParams.get('path') || searchParams.get('url') || ''
    await deleteImage(target)
    return Response.json({ ok: true, storage: storageMode(), bucket: SUPABASE_BUCKET })
  } catch (e) {
    console.error('upload delete error', e)
    return Response.json({ error: 'Delete failed' }, { status: 500 })
  }
}

export async function GET() {
  // Non-sensitive: lets the CMS show which storage backend is active
  return Response.json({ storage: storageMode(), bucket: SUPABASE_BUCKET })
}
