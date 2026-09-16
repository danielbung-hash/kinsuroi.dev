import { db } from '@/lib/db'
import { ensureDatabase } from '@/lib/db-setup'
import { isAdmin, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Secret keys that must never leave the server (defence-in-depth: the
// credential also no longer exists in the DB at all — env-only auth).
const SECRET_KEYS = new Set(['admin_password', 'admin_secret'])

/** Group inferred from the key prefix (used only when creating a new row). */
const groupFor = (key: string): string => {
  if (key.startsWith('company_')) return 'company'
  if (key.startsWith('hero_')) return 'hero'
  if (key.startsWith('brand_')) return 'brand'
  if (key.startsWith('cta_')) return 'cta'
  if (key.startsWith('footer_')) return 'footer'
  if (key.startsWith('contact_')) return 'contact'
  if (key.startsWith('social_')) return 'social'
  return 'general'
}

const sanitize = (rows: { key: string; value: string }[]) =>
  Object.fromEntries(rows.filter((s) => !SECRET_KEYS.has(s.key)).map((s) => [s.key, s.value]))

/** GET /api/settings — admin only, secrets stripped */
export async function GET() {
  try {
    await ensureDatabase()
    if (!(await isAdmin())) return unauthorized()
    const settings = await db.siteSetting.findMany()
    return Response.json(sanitize(settings))
  } catch (e) {
    console.error('settings list error', e)
    return Response.json(
      { error: 'Gagal memuat settings', detail: e instanceof Error ? e.message.split('\n')[0] : 'unknown' },
      { status: 500 },
    )
  }
}

/** PUT /api/settings — bulk upsert { key: value, ... }; secret keys rejected */
export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const body = (await req.json()) as Record<string, string>
    const entries = Object.entries(body).filter(([k]) => k && typeof k === 'string' && !SECRET_KEYS.has(k))
    for (const [key, value] of entries) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value: String(value ?? '') },
        create: { key, value: String(value ?? ''), group: groupFor(key) },
      })
    }
    const settings = await db.siteSetting.findMany()
    return Response.json(sanitize(settings))
  } catch (e) {
    console.error('settings update error', e)
    return Response.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
