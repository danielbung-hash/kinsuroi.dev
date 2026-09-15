import type { Metadata } from 'next'
import { AdminView } from '@/components/kinsuroi/AdminView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Admin CMS',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminView />
}
