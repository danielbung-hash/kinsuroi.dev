import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { CompanyView } from '@/components/kinsuroi/views/CompanyView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Perusahaan',
  description:
    'Mengenal lebih dekat KINSUROI — profil perusahaan, visi & misi, nilai, serta komitmen kami terhadap kualitas produk dan pelayanan.',
  alternates: { canonical: '/company' },
  openGraph: {
    title: 'Perusahaan | KINSUROI',
    description:
      'Profil perusahaan, visi & misi, nilai, dan komitmen kualitas KINSUROI — brand kecantikan yang sederhana dan elegan.',
    url: '/company',
    type: 'website',
  },
}

export default async function CompanyPage() {
  const initial = await getBootstrapData()
  return (
    <SiteShell initial={initial}>
      <CompanyView />
    </SiteShell>
  )
}
