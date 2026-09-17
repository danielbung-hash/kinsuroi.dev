'use client'

import Image from 'next/image'
import { HashLink } from './router'
import { Reveal } from './Reveal'
import { buyCta, type Product, type SiteSettings } from '@/lib/types'

/** First line only — the card stays quiet, full text lives on the detail page */
function firstLine(raw?: string | null): string {
  return raw?.split('\n').map((s) => s.trim()).filter(Boolean)[0] ?? ''
}

/** Clean luxury product card — image first, Problem → Solve → Price → CTA */
export function ProductCard({
  product,
  index = 0,
  settings = {},
}: {
  product: Product
  index?: number
  settings?: SiteSettings
}) {
  const categoryName = product.category?.name ?? ''
  const src = product.image || '/images/brand.jpg'
  const alt = product.seoDescription || `${product.name} — ${categoryName || 'KINSUROI'}`
  const problem = firstLine(product.problem)
  const solve = firstLine(product.benefits)
  const price = product.price?.trim()
  const cta = buyCta(product, settings)
  const isPlaceholder = product.slug === 'kinsuroi-lip-segera-hadir' && product.name === 'Segera Hadir'

  return (
    <Reveal delay={(index % 4) * 0.08}>
      <article className="group flex h-full flex-col">
        <HashLink to={`/products/${product.slug}`} ariaLabel={`Lihat ${product.name}`} className="block">
          <div className="relative aspect-[4/5] bg-white overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain p-5 md:p-6 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
            {/* quiet hover veil */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-700" aria-hidden="true" />
          </div>
        </HashLink>

        <div className="flex flex-1 flex-col pt-5 pb-1 text-left">
          {categoryName && <p className="kicker !text-[10px] mb-2">{categoryName}</p>}
          <HashLink to={`/products/${product.slug}`} ariaLabel={`Lihat ${product.name}`}>
            <h3 className="font-display text-lg md:text-xl text-ink leading-snug">{product.name}</h3>
          </HashLink>

          {/* Problem → Solve, one short line each */}
          {problem && (
            <p className="mt-2 text-sm text-muted-foreground font-light leading-snug line-clamp-1" title={problem}>
              {problem}
            </p>
          )}
          {solve && (
            <p className="mt-1 text-sm text-ink/80 leading-snug line-clamp-1" title={solve}>
              {solve}
            </p>
          )}

          {price && <p className="mt-3 font-display text-lg text-ink">{price}</p>}

          {/* CTA — always last, easy to find, never crowded */}
          <div className="mt-4 pt-1 mt-auto">
            {isPlaceholder ? (
              <span className="inline-block w-full border border-line bg-sand/60 py-2.5 text-center text-[10px] tracking-[0.25em] uppercase text-muted-foreground">
                Segera Hadir
              </span>
            ) : cta.url ? (
              <a
                href={cta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full justify-center !py-2.5 text-[10px] tracking-[0.25em] uppercase"
              >
                Beli Sekarang
              </a>
            ) : (
              <HashLink
                to={`/products/${product.slug}`}
                className="btn-outline w-full justify-center !py-2.5 text-[10px] tracking-[0.25em] uppercase"
              >
                Lihat Produk
              </HashLink>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  )
}
