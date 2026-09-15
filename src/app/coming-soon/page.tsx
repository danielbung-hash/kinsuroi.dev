import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { ComingSoonView } from '@/components/kinsuroi/views/ContactView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Segera Hadir',
  robots: { index: false, follow: true },
}

export default async function ComingSoonPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const [initial, params] = await Promise.all([getBootstrapData(), searchParams])
  return (
    <SiteShell initial={initial}>
      <ComingSoonView page={params.page} />
    </SiteShell>
  )
}
