import type { MetadataRoute } from 'next'
import { getBootstrapData } from '@/lib/data'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kinsuroi.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, articles } = await getBootstrapData()

  const staticPages: MetadataRoute.Sitemap = [
    { path: '', priority: 1 },
    { path: '/products', priority: 0.9 },
    { path: '/about', priority: 0.7 },
    { path: '/journal', priority: 0.7 },
    { path: '/contact', priority: 0.6 },
  ].map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: p.priority,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/products/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/journal/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticPages, ...productPages, ...articlePages]
}
