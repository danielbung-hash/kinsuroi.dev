import { db } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Secret keys that must never leave the server (defence-in-depth: the
// credential also no longer exists in the DB at all — env-only auth).
const SECRET_KEYS = new Set(['admin_password', 'admin_secret'])

const sanitize = (rows: { key: string; value: string }[]) =>
  Object.fromEntries(rows.filter((s) => !SECRET_KEYS.has(s.key)).map((s) => [s.key, s.value]))

/** GET /api/settings — admin only, secrets stripped */
export async function GET() {
  if (!(await isAdmin())) return unauthorized()
  const settings = await db.siteSetting.findMany()
  return Response.json(sanitize(settings))
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
        create: { key, value: String(value ?? ''), group: 'general' },
      })
    }
    const settings = await db.siteSetting.findMany()
    return Response.json(sanitize(settings))
  } catch (e) {
    console.error('settings update error', e)
    return Response.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
