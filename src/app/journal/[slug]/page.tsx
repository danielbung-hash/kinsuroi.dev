import type { Metadata } from 'next'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { ArticleView } from '@/components/kinsuroi/views/ArticleView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinsuroi.com'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { articles } = await getBootstrapData()
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    return { title: 'Cerita tidak ditemukan' }
  }

  const title = article.seoTitle || article.title
  const description = article.seoDescription || article.excerpt || article.title

  return {
    title,
    description,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/journal/${article.slug}`,
      type: 'article',
      images: article.thumbnail ? [{ url: article.thumbnail, alt: article.title }] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [{ slug }, initial] = await Promise.all([params, getBootstrapData()])
  return (
    <SiteShell initial={initial}>
      <ArticleView slug={slug} />
    </SiteShell>
  )
}
