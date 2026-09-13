import { cookies } from 'next/headers'
import { db } from '@/lib/db'
import { ADMIN_COOKIE, makeToken, unauthorized, isAdmin } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/** POST /api/admin/login — { password } */
export async function POST(req: Request) {
  try {
    const { password } = (await req.json()) as { password?: string }
    if (!password) return Response.json({ error: 'Password required' }, { status: 400 })

    const setting = await db.siteSetting.findUnique({ where: { key: 'admin_password' } })
    const expected = setting?.value ?? 'kinsuroi-admin'

    if (password !== expected) {
      return Response.json({ error: 'Incorrect password' }, { status: 401 })
    }

    const store = await cookies()
    store.set(ADMIN_COOKIE, makeToken(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 12,
    })
    return Response.json({ ok: true })
  } catch (e) {
    console.error('login error', e)
    return Response.json({ error: 'Login failed' }, { status: 500 })
  }
}

/** GET /api/admin/login — check session */
export async function GET() {
  if (await isAdmin()) return Response.json({ ok: true })
  return unauthorized()
}

/** DELETE /api/admin/login — logout */
export async function DELETE() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  return Response.json({ ok: true })
}

export { unauthorized }
