import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { JournalView } from '@/components/kinsuroi/views/JournalView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'KINSUROI Journal',
  description:
    'Rutinitas skincare, edukasi bahan, tips kecantikan, dan catatan gaya hidup — dari KINSUROI Journal.',
  alternates: { canonical: '/journal' },
}

export default async function JournalPage() {
  const initial = await getBootstrapData()
  return (
    <SiteShell initial={initial}>
      <JournalView />
    </SiteShell>
  )
}
