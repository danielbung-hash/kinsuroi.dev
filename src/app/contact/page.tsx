import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { ContactView } from '@/components/kinsuroi/views/ContactView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Kontak',
  description:
    'Hubungi tim KINSUROI melalui alamat, telepon, dan kanal resmi kami. Kami siap membantu pertanyaan seputar produk dan pesananmu.',
  alternates: { canonical: '/contact' },
}

export default async function ContactPage() {
  const initial = await getBootstrapData()
  return (
    <SiteShell initial={initial}>
      <ContactView />
    </SiteShell>
  )
}
