// KINSUROI — server-side image storage.
//
// Primary target: Supabase Storage bucket `product-images`
// (activated when NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set).
// The database only ever stores the returned public URL/path — never binaries.
//
// Fallback: when Supabase env vars are absent (e.g. local preview), files are
// written to public/uploads so the CMS flow keeps working unchanged.
//
// SECURITY: the service-role key never leaves the server; it is only read here
// via process.env. Delete/management operations are server-side only.

import { mkdir, writeFile, unlink } from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'

export const SUPABASE_BUCKET = 'product-images'
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5 MB

const ALLOWED_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export type SaveResult = {
  url: string // public URL stored in the DB (image_path reference)
  path: string // storage-internal path, e.g. "products/12/ab12cd.jpg"
  storage: 'supabase' | 'local'
}

function supabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) return null
  return { url, serviceKey }
}

export function storageMode(): 'supabase' | 'local' {
  return supabaseConfig() ? 'supabase' : 'local'
}

/** Validate + persist an uploaded image. Throws Error with a clear message on failure. */
export async function saveImage(file: File, folder = 'products'): Promise<SaveResult> {
  // ── validation ───────────────────────────────────────────────
  if (!file || typeof file === 'string') throw new Error('No file received')
  const ext = ALLOWED_MIME[file.type]
  if (!ext) throw new Error('Format file tidak didukung. Gunakan JPG, PNG, WebP, atau AVIF.')
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Ukuran file melebihi 5 MB.')
  if (file.size === 0) throw new Error('File kosong.')

  // ── safe path: never trust the raw client filename as the identifier ──
  const key = `${Date.now().toString(36)}${randomBytes(6).toString('hex')}`
  const objectPath = `${folder}/${key}.${ext}`
  const buffer = Buffer.from(await file.arrayBuffer())

  const cfg = supabaseConfig()
  if (cfg) {
    // ── Supabase Storage (REST, service-role, server-side only) ──
    const res = await fetch(`${cfg.url}/storage/v1/object/${SUPABASE_BUCKET}/${objectPath}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.serviceKey}`,
        'Content-Type': file.type,
        'x-upsert': 'false',
      },
      body: new Uint8Array(buffer),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      // Never echo credentials or raw provider errors that may include config
      console.error('supabase storage upload failed', res.status, detail.slice(0, 300))
      throw new Error('Gagal mengunggah ke Supabase Storage. Periksa konfigurasi bucket.')
    }
    return {
      url: `${cfg.url}/storage/v1/object/public/${SUPABASE_BUCKET}/${objectPath}`,
      path: objectPath,
      storage: 'supabase',
    }
  }

  // ── Local fallback (preview / self-host without Supabase) ────
  const dir = path.join(process.cwd(), 'public', 'uploads', folder)
  await mkdir(dir, { recursive: true })
  await writeFile(path.join(dir, `${key}.${ext}`), buffer)
  return { url: `/uploads/${objectPath}`, path: objectPath, storage: 'local' }
}

/** Remove an image from storage (CMS delete). Best-effort, never throws. */
export async function deleteImage(imagePathOrUrl: string): Promise<void> {
  if (!imagePathOrUrl) return
  const cfg = supabaseConfig()

  let objectPath: string | null = null
  if (cfg) {
    const marker = `/storage/v1/object/public/${SUPABASE_BUCKET}/`
    const idx = imagePathOrUrl.indexOf(marker)
    if (idx !== -1) objectPath = imagePathOrUrl.slice(idx + marker.length)
  } else if (imagePathOrUrl.startsWith('/uploads/')) {
    objectPath = imagePathOrUrl.slice('/uploads/'.length)
  }
  if (!objectPath || objectPath.includes('..')) return

  try {
    if (cfg) {
      await fetch(`${cfg.url}/storage/v1/object/${SUPABASE_BUCKET}/${objectPath}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${cfg.serviceKey}` },
      })
    } else {
      await unlink(path.join(process.cwd(), 'public', 'uploads', objectPath)).catch(() => {})
    }
  } catch (e) {
    console.error('storage delete failed', e)
  }
}
