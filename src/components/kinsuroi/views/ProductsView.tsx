'use client'

import { useMemo } from 'react'
import { HashLink } from '../router'
import { Reveal } from '../Reveal'
import { ProductCard } from '../ProductCard'
import { useK } from '../store'

export function ProductsView({ categorySlug }: { categorySlug?: string }) {
  const products = useK((st) => st.products)
  const categories = useK((st) => st.categories)
  const settings = useK((st) => st.settings)

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
        <Reveal className="text-center mb-10 md:mb-14">
          <p className="kicker mb-5">Koleksi Kami</p>
          <h1 className="font-display text-4xl md:text-6xl text-ink">
            {activeCategory ? activeCategory.name.toUpperCase() : 'PRODUK KAMI'}
          </h1>
          <p className="mt-5 text-muted-foreground font-light max-w-lg mx-auto">
            {activeCategory?.description ||
              'Setiap produk KINSUROI — Face Care, Lip Care, dan Body Care — dalam satu tempat yang tenang.'}
          </p>
        </Reveal>
      </div>

      {/* Sticky category filter — swipeable on mobile, always reachable */}
      <nav
        aria-label="Filter kategori"
        className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-y border-line"
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
          <div className="flex items-center gap-x-8 gap-y-0 py-4 overflow-x-auto thin-scroll -mx-6 px-6 lg:mx-0 lg:px-0">
            <HashLink
              to="/products"
              className={`shrink-0 text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                !categorySlug ? 'text-ink link-underline' : 'text-muted-foreground hover:text-ink'
              }`}
            >
              Semua
            </HashLink>
            {categories.map((c) => (
              <HashLink
                key={c.id}
                to={`/products?category=${c.slug}`}
                className={`shrink-0 text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 ${
                  categorySlug === c.slug ? 'text-ink link-underline' : 'text-muted-foreground hover:text-ink'
                }`}
              >
                {c.name}
              </HashLink>
            ))}
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">Belum ada produk di kategori ini.</p>
        ) : (
          <div className="pt-12 md:pt-16 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-16">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} settings={settings} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
