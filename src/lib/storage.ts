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
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!raw || !serviceKey) return null
  try {
    // Validate before building request URLs from it — an invalid value
    // (blank/malformed env var) gracefully falls back to local storage
    // instead of crashing every upload at runtime.
    const parsed = new URL(raw)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return null
    return { url: parsed.origin, serviceKey }
  } catch {
    console.warn('[storage] NEXT_PUBLIC_SUPABASE_URL invalid — using local storage fallback.')
    return null
  }
}

export function storageMode(): 'supabase' | 'local' {
  return supabaseConfig() ? 'supabase' : 'local'
}

/* ── Bucket provisioning ──────────────────────────────────────────
 * The CMS works out-of-the-box: if the `product-images` bucket does not
 * exist yet, it is created (public read) on the first upload. The result
 * is cached per server instance to avoid a round-trip on every upload.
 */
let bucketReady: Promise<boolean> | null = null
// Last bucket-provisioning failure (diagnostics only — safe to surface:
// Supabase storage error bodies never contain credentials).
let lastBucketError: string | null = null

async function bucketExists(cfg: { url: string; serviceKey: string }): Promise<boolean> {
  const res = await fetch(`${cfg.url}/storage/v1/bucket/${SUPABASE_BUCKET}`, {
    headers: { Authorization: `Bearer ${cfg.serviceKey}` },
  })
  return res.ok
}

async function ensureBucket(cfg: { url: string; serviceKey: string }): Promise<boolean> {
  if (!bucketReady) {
    bucketReady = (async () => {
      if (await bucketExists(cfg)) return true
      const create = await fetch(`${cfg.url}/storage/v1/bucket`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.serviceKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: SUPABASE_BUCKET,
          public: true, // public read — uploads stay server-side via service key
          file_size_limit: MAX_IMAGE_BYTES,
        }),
      })
      if (create.ok) {
        console.log(`[storage] created public bucket "${SUPABASE_BUCKET}"`)
        return true
      }
      // Parallel requests may race — re-verify before giving up
      if (await bucketExists(cfg)) return true
      const detail = await create.text().catch(() => '')
      lastBucketError = `bucket "${SUPABASE_BUCKET}" tidak ada & gagal dibuat otomatis (HTTP ${create.status}: ${detail.slice(0, 160)})`
      console.error('[storage] bucket create failed', create.status, detail.slice(0, 200))
      return false
    })().catch(() => false)
  }
  return bucketReady
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
    await ensureBucket(cfg)

    const upload = () =>
      fetch(`${cfg.url}/storage/v1/object/${SUPABASE_BUCKET}/${objectPath}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${cfg.serviceKey}`,
          'Content-Type': file.type,
          'x-upsert': 'false',
        },
        body: new Uint8Array(buffer),
      })

    let res = await upload()
    if (res.status === 404) {
      // Bucket missing (or our cache is stale) — recreate once and retry
      bucketReady = null
      await ensureBucket(cfg)
      res = await upload()
    }
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      // Never echo credentials — but DO surface Supabase's own diagnostic
      // message (e.g. RLS violation, invalid key, bucket missing) so the
      // CMS shows the real cause instead of a generic failure.
      console.error('supabase storage upload failed', res.status, detail.slice(0, 300))
      const clean = detail.replace(/\s+/g, ' ').slice(0, 180)
      const hint =
        res.status === 404
          ? 'Bucket "product-images" tidak ada di Supabase Storage dan gagal dibuat otomatis. Buat manual: Supabase Dashboard → Storage → New bucket (nama: product-images, Public).'
          : res.status === 400 && /row level security|policy/i.test(detail)
            ? 'Upload ditolak RLS Supabase (kemungkinan SUPABASE_SERVICE_ROLE_KEY bukan service key asli — cek ulang di Supabase Dashboard → Settings → API).'
            : null
      throw new Error(
        `Gagal mengunggah ke Supabase Storage (HTTP ${res.status})${clean ? `: ${clean}` : ''}. ${hint ?? 'Cek konfigurasi bucket / SUPABASE_SERVICE_ROLE_KEY.'}${lastBucketError ? ` | ${lastBucketError}` : ''}`,
      )
    }
    return {
      url: `${cfg.url}/storage/v1/object/public/${SUPABASE_BUCKET}/${objectPath}`,
      path: objectPath,
      storage: 'supabase',
    }
  }

  // ── Local fallback (local preview / self-host without Supabase) ──
  // Serverless platforms (Vercel) have a READ-ONLY filesystem — writing
  // there always fails. Fail fast with an actionable message instead of
  // the cryptic "ENOENT: mkdir '/var/task/public'".
  if (process.env.VERCEL === '1') {
    throw new Error(
      'Upload tidak bisa diproses: Supabase Storage belum aktif di server ini. Set NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di Vercel (Settings → Environment Variables), lalu redeploy.'
    )
  }
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
      const res = await fetch(`${cfg.url}/storage/v1/object/${SUPABASE_BUCKET}/${objectPath}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${cfg.serviceKey}` },
      })
      if (!res.ok && res.status !== 404) {
        console.error('storage delete failed', res.status, (await res.text().catch(() => '')).slice(0, 200))
      }
    } else {
      await unlink(path.join(process.cwd(), 'public', 'uploads', objectPath)).catch(() => {})
    }
  } catch (e) {
    console.error('storage delete failed', e)
  }
}
