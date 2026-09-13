import { createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'

/**
 * Lightweight demo-grade admin auth for the CMS.
 *
 * In production (Supabase deployment) this is replaced by Supabase Auth +
 * Row Level Security — see supabase/schema.sql and supabase/README.md.
 */

const SECRET = process.env.ADMIN_SECRET || 'kinsuroi-demo-secret-change-me'
export const ADMIN_COOKIE = 'kinsuroi_admin'
const MAX_AGE = 60 * 60 * 12 // 12h

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('hex')
}

export function makeToken(): string {
  const payload = `admin.${Date.now()}`
  return `${payload}.${sign(payload)}`
}

export function verifyToken(token?: string | null): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [scope, ts, sig] = parts
  if (scope !== 'admin' || !ts || !sig) return false
  const expected = sign(`${scope}.${ts}`)
  try {
    return timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(expected, 'hex'))
  } catch {
    return false
  }
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifyToken(store.get(ADMIN_COOKIE)?.value)
}

export function unauthorized() {
  return Response.json({ error: 'Unauthorized' }, { status: 401 })
}
