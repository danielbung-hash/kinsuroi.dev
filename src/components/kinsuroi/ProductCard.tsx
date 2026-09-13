'use client'

import Image from 'next/image'
import { HashLink } from './router'
import { Reveal } from './Reveal'
import type { Product } from '@/lib/types'

/** Clean luxury product card — image first, quiet typography, clear CTA */
export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const categoryName = product.category?.name ?? ''
  const src = product.image || '/images/brand.jpg'
  const alt = product.seoDescription || `${product.name} — ${categoryName || 'KINSUROI'}`

  return (
    <Reveal delay={(index % 4) * 0.08}>
      <article className="group">
        <HashLink to={`/products/${product.slug}`} ariaLabel={`Lihat ${product.name}`} className="block">
          <div className="relative aspect-[4/5] bg-sand overflow-hidden">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
            />
            {/* quiet hover veil */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-700" aria-hidden="true" />
          </div>

          <div className="pt-5 pb-1 text-center md:text-left">
            {categoryName && (
              <p className="kicker !text-[10px] mb-2">{categoryName}</p>
            )}
            <h3 className="font-display text-lg md:text-xl text-ink leading-snug">{product.name}</h3>
            {product.shortDesc && <p className="text-sm text-muted-foreground mt-1">{product.shortDesc}</p>}
            <p className="mt-3 text-[10px] tracking-[0.28em] uppercase text-ink/70 group-hover:text-ink transition-colors duration-300 link-underline">
              Lihat Produk
            </p>
          </div>
        </HashLink>
      </article>
    </Reveal>
  )
}
