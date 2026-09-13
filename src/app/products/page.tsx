import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { ProductsView } from '@/components/kinsuroi/views/ProductsView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Produk Kami',
  description:
    'Jelajahi koleksi lengkap KINSUROI — pembersih wajah, serum, perawatan bibir, dan perawatan tubuh dalam satu tempat yang tenang.',
  alternates: { canonical: '/products' },
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const [initial, params] = await Promise.all([getBootstrapData(), searchParams])
  return (
    <SiteShell initial={initial}>
      <ProductsView categorySlug={params.category} />
    </SiteShell>
  )
}
