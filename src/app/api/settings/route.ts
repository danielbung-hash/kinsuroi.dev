import { db } from '@/lib/db'
import { isAdmin, unauthorized } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** GET /api/settings — admin only, returns all settings including admin section */
export async function GET() {
  if (!(await isAdmin())) return unauthorized()
  const settings = await db.siteSetting.findMany()
  return Response.json(Object.fromEntries(settings.map((s) => [s.key, s.value])))
}

/** PUT /api/settings — bulk upsert { key: value, ... } */
export async function PUT(req: Request) {
  if (!(await isAdmin())) return unauthorized()
  try {
    const body = (await req.json()) as Record<string, string>
    const entries = Object.entries(body).filter(([k]) => k && typeof k === 'string')
    for (const [key, value] of entries) {
      await db.siteSetting.upsert({
        where: { key },
        update: { value: String(value ?? '') },
        create: { key, value: String(value ?? ''), group: 'general' },
      })
    }
    const settings = await db.siteSetting.findMany()
    return Response.json(Object.fromEntries(settings.map((s) => [s.key, s.value])))
  } catch (e) {
    console.error('settings update error', e)
    return Response.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
