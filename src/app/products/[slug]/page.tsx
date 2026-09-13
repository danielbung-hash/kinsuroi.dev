import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { ProductDetailView } from '@/components/kinsuroi/views/ProductDetailView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinsuroi.com'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { products } = await getBootstrapData()
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return { title: 'Produk tidak ditemukan' }
  }

  const title = product.seoTitle || product.name
  const description = product.seoDescription || product.shortDesc || `${product.name} — KINSUROI official website.`

  return {
    title,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/products/${product.slug}`,
      type: 'website',
      images: product.image ? [{ url: product.image, alt: product.name }] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, initial] = await Promise.all([params, getBootstrapData()])
  return (
    <SiteShell initial={initial}>
      <ProductDetailView slug={slug} />
    </SiteShell>
  )
}
