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
  problem?: string | null // one-line problem statement (Problem → Solve order)
  price?: string | null // formatted label, e.g. "Rp 149.000"
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
  purchaseUrl?: string | null // direct checkout link; empty → WhatsApp CTA
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

/* ── WhatsApp BUY CTA helper ─────────────────────────────────── */

/** Normalize an Indonesian phone number to the 62… international form */
export function normalizeWa(number: string): string {
  const digits = number.replace(/[^0-9]/g, '')
  if (digits.startsWith('62')) return digits
  if (digits.startsWith('0')) return `62${digits.slice(1)}`
  return digits
}

/**
 * Build the BUY CTA target for a product.
 * Priority: per-product purchaseUrl → per-product marketplaceUrl → official
 * WhatsApp with a prefilled message ("Halo, saya ingin membeli [Produk].").
 * The raw number is never shown to the visitor when the CTA is enough.
 */
export function buyCta(
  product: Pick<Product, 'name' | 'purchaseUrl' | 'marketplaceUrl'>,
  settings: SiteSettings,
): { url: string; kind: 'url' | 'whatsapp' | 'none' } {
  const direct = product.purchaseUrl?.trim() || product.marketplaceUrl?.trim()
  if (direct) return { url: direct, kind: 'url' }

  const wa = settings['contact_whatsapp']?.trim()
  if (wa) {
    const text = encodeURIComponent(`Halo, saya ingin membeli ${product.name}.`)
    return { url: `https://wa.me/${normalizeWa(wa)}?text=${text}`, kind: 'whatsapp' }
  }
  return { url: '', kind: 'none' }
}
