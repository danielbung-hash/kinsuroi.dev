'use client'

import { useMemo } from 'react'
import { HashLink } from '../router'
import { Reveal } from '../Reveal'
import { ProductCard } from '../ProductCard'
import { useK } from '../store'

export function ProductsView({ categorySlug }: { categorySlug?: string }) {
  const products = useK((st) => st.products)
  const categories = useK((st) => st.categories)

  const filtered = useMemo(() => {
    if (!categorySlug) return products
    const cat = categories.find((c) => c.slug === categorySlug)
    if (!cat) return products
    return products.filter((p) => p.categoryId === cat.id)
  }, [products, categories, categorySlug])

  const activeCategory = categories.find((c) => c.slug === categorySlug)

  return (
    <main className="bg-white pt-28 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <Reveal className="text-center mb-12 md:mb-16">
          <p className="kicker mb-5">Koleksi Kami</p>
          <h1 className="font-display text-4xl md:text-6xl text-ink">
            {activeCategory ? activeCategory.name.toUpperCase() : 'PRODUK KAMI'}
          </h1>
          <p className="mt-5 text-muted-foreground font-light max-w-lg mx-auto">
            {activeCategory?.description ||
              'Setiap produk KINSUROI — pembersih, serum, perawatan bibir dan tubuh — dalam satu tempat yang tenang.'}
          </p>
        </Reveal>

        {/* Category filter */}
        <Reveal delay={0.1} className="mb-14 md:mb-16">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-y border-line py-5">
            <HashLink
              to="/products"
              className={`text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                !categorySlug ? 'text-ink link-underline' : 'text-muted-foreground hover:text-ink'
              }`}
            >
              Semua
            </HashLink>
            {categories.map((c) => (
              <HashLink
                key={c.id}
                to={`/products?category=${c.slug}`}
                className={`text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                  categorySlug === c.slug ? 'text-ink link-underline' : 'text-muted-foreground hover:text-ink'
                }`}
              >
                {c.name}
              </HashLink>
            ))}
          </div>
        </Reveal>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">Belum ada produk di kategori ini.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-16">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
