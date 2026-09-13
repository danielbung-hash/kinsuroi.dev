import { isAdmin, unauthorized } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
const MAX_SIZE = 8 * 1024 * 1024 // 8MB

/** POST /api/upload — multipart form: file=<image> → { url } */
export async function POST(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
    if (!ALLOWED.includes(file.type)) {
      return Response.json({ error: 'Unsupported file type. Use JPG, PNG, WebP, AVIF or GIF.' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return Response.json({ error: 'File is too large (max 8MB).' }, { status: 400 })
    }

    const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1].replace('svg+xml', 'svg')
    const name = `${randomUUID()}.${ext}`
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(dir, name), buffer)

    return Response.json({ url: `/uploads/${name}` })
  } catch (e) {
    console.error('upload error', e)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
