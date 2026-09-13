// KINSUROI — shared types (mirrors prisma/schema.prisma & supabase/schema.sql)

export type Category = {
  id: string
  name: string
  slug: string
  description?: string | null
  order: number
}

export type Product = {
  id: string
  name: string
  slug: string
  categoryId?: string | null
  category?: Category | null
  shortDesc?: string | null
  description?: string | null
  benefits?: string | null // newline-separated
  ingredients?: string | null
  howToUse?: string | null
  suitableFor?: string | null
  image?: string | null
  gallery?: string | null // JSON array
  faq?: string | null // JSON [{question, answer}]
  status: string // "draft" | "published"
  featured: boolean
  order: number
  marketplaceUrl?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
}

export type Article = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  thumbnail?: string | null
  author: string
  topic?: string | null
  publishedAt?: string | null
  seoTitle?: string | null
  seoDescription?: string | null
  status: string
}

export type SiteSettings = Record<string, string>

export type BootstrapData = {
  settings: SiteSettings
  categories: Category[]
  products: Product[]
  articles: Article[]
}

export type FaqItem = { question: string; answer: string }

export function parseJsonArray<T>(raw?: string | null): T[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? (v as T[]) : []
  } catch {
    return []
  }
}

export function parseLines(raw?: string | null): string[] {
  if (!raw) return []
  return raw
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}
