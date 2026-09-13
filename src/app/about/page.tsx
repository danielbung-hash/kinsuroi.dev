import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { AboutView } from '@/components/kinsuroi/views/AboutView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tentang KINSUROI',
  description:
    'KINSUROI adalah brand kecantikan dengan satu ide sederhana: merawat diri harus terasa mudah, elegan, dan jujur. Bersih. Tenang. Elegan. Terpercaya.',
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
