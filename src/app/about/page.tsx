import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { AboutView } from '@/components/kinsuroi/views/AboutView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tentang KINSUROI — Company Profile',
  description:
    'Profil PT Dani Era Mardika, manufaktur skincare kosmetik standar Jerman di balik KINSUROI — formulasi & produksi in-house bersertifikat CPKB (GMP) dan Halal.',
  alternates: { canonical: '/about' },
}

export default async function AboutPage() {
  const initial = await getBootstrapData()
  return (
    <SiteShell initial={initial}>
      <AboutView />
    </SiteShell>
  )
}
