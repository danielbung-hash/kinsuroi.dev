'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HashLink, navigate } from '../router'
import { Reveal, RevealImage } from '../Reveal'
import { ProductCard } from '../ProductCard'
import { useK, s } from '../store'
import { buyCta, parseJsonArray, parseLines, type FaqItem, type Product } from '@/lib/types'

/** Elegant empty state for fields the admin has not filled yet */
function Pending({ label }: { label: string }) {
  return (
    <p className="text-sm text-muted-foreground/70 italic font-light">
      {label} akan segera tersedia.
    </p>
  )
}

export function ProductDetailView({ slug }: { slug: string }) {
  const products = useK((st) => st.products)
  const settings = useK((st) => st.settings)

  const product = useMemo(() => products.find((p) => p.slug === slug), [products, slug])

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
      .concat(products.filter((p) => p.id !== product.id && p.categoryId !== product.categoryId))
      .slice(0, 4)
  }, [products, product])

  if (!product) {
    return (
      <main className="bg-white pt-40 pb-32 text-center px-6">
        <p className="kicker mb-4">404</p>
        <h1 className="font-display text-4xl text-ink mb-6">Produk tidak ditemukan</h1>
        <p className="text-muted-foreground mb-10">Produk yang kamu cari tidak tersedia.</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          KEMBALI KE PRODUK
        </button>
      </main>
    )
  }

  const benefits = parseLines(product.benefits)
  const ingredients = parseLines(product.ingredients)
  const howToUse = parseLines(product.howToUse)
  const suitableFor = parseLines(product.suitableFor)
  const faq = parseJsonArray<FaqItem>(product.faq)
  const gallery = parseJsonArray<string>(product.gallery)
  const price = product.price?.trim()
  const cta = buyCta(product, settings)
  const isPlaceholder = product.slug === 'kinsuroi-lip-segera-hadir' && product.name === 'Segera Hadir'

  return (
    <main className="bg-white pt-24 md:pt-32 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 md:mb-12 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
          <HashLink to="/products" className="hover:text-ink transition-colors">
            Produk
          </HashLink>
          {product.category && (
            <>
              <span className="mx-3 text-line" aria-hidden="true">/</span>
              <HashLink to={`/products?category=${product.category.slug}`} className="hover:text-ink transition-colors">
                {product.category.name}
              </HashLink>
            </>
          )}
          <span className="mx-3 text-line" aria-hidden="true">/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>

        {/* Main split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image */}
          <RevealImage>
            <div className="relative aspect-[4/5] w-full bg-sand overflow-hidden">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.seoDescription || `${product.name} — KINSUROI`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-5xl text-bronze">K</span>
                </div>
              )}
            </div>
          </RevealImage>

          {/* Gallery thumbnails */}
          {gallery.length > 0 && (
            <div className="flex gap-4 mt-6 lg:hidden">
              {gallery.map((g, i) => (
                <div key={i} className="relative aspect-square w-20 bg-sand overflow-hidden">
                  <Image src={g} alt={`${product.name} ${i + 1}`} fill sizes="80px" className="object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Info — Name → Problem → Solve → Price → CTA */}
          <Reveal delay={0.12} className="lg:pt-4">
            {product.category && <p className="kicker mb-4">{product.category.name}</p>}
            <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">{product.name}</h1>
            {product.shortDesc && <p className="mt-4 text-lg text-muted-foreground font-light">{product.shortDesc}</p>}

            {/* Problem → Solve — the visitor understands the product in two lines */}
            {(product.problem || benefits.length > 0) && (
              <div className="mt-8 space-y-6">
                {product.problem && (
                  <div>
                    <p className="kicker !text-[10px] mb-2">Masalah</p>
                    <p className="text-ink/90 font-light leading-relaxed">{product.problem}</p>
                  </div>
                )}
                {benefits.length > 0 && (
                  <div>
                    <p className="kicker !text-[10px] mb-2">Manfaat</p>
                    <ul className="space-y-2">
                      {benefits.map((b, i) => (
                        <li key={i} className="flex gap-3 text-sm text-ink/80 leading-relaxed">
                          <span className="text-bronze mt-[2px]" aria-hidden="true">—</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {suitableFor.length > 0 && (
                  <p className="text-xs text-muted-foreground font-light">Cocok untuk: {suitableFor.join(' · ')}</p>
                )}
              </div>
            )}

            {/* Price */}
            {price && <p className="mt-8 font-display text-3xl md:text-4xl text-ink">{price}</p>}

            {/* Buy CTA — WhatsApp with prefilled product message, or direct URL */}
            <div className="mt-8 flex flex-wrap gap-4">
              {isPlaceholder ? (
                <span className="btn-primary pointer-events-none opacity-60">SEGERA HADIR</span>
              ) : cta.url ? (
                <a href={cta.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  BELI SEKARANG
                </a>
              ) : (
                <span className="btn-primary pointer-events-none opacity-40">BELI SEKARANG</span>
              )}
              {s(settings, 'social_shopee', '') && !isPlaceholder && (
                <a href={s(settings, 'social_shopee', '')} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  BELI DI SHOPEE
                </a>
              )}
            </div>
            {!cta.url && !isPlaceholder && (
              <p className="mt-3 text-xs text-muted-foreground/70 font-light">
                Link pembelian resmi akan segera tersedia.
              </p>
            )}

            {/* Long-form info — collapsible so the page stays clean, mobile-friendly */}
            <div className="mt-12 border-t border-line">
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="how-to-use" className="border-line">
                  <AccordionTrigger className="text-[11px] tracking-[0.22em] uppercase text-ink font-medium text-left hover:no-underline py-5 [&>svg]:text-muted-foreground">
                    Cara Pakai
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    {howToUse.length ? (
                      <ol className="space-y-2.5">
                        {howToUse.map((st, i) => (
                          <li key={i} className="flex gap-3 text-sm text-ink/80 leading-relaxed">
                            <span className="font-display text-bronze" aria-hidden="true">{i + 1}.</span>
                            {st}
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <Pending label="Panduan penggunaan" />
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="ingredients" className="border-line">
                  <AccordionTrigger className="text-[11px] tracking-[0.22em] uppercase text-ink font-medium text-left hover:no-underline py-5 [&>svg]:text-muted-foreground">
                    Ingredient Highlight
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    {ingredients.length ? (
                      <ul className="space-y-2 text-sm text-ink/80 leading-relaxed">
                        {ingredients.map((g, i) => (
                          <li key={i}>{g}</li>
                        ))}
                      </ul>
                    ) : (
                      <Pending label="Daftar komposisi lengkap" />
                    )}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="description" className="border-line">
                  <AccordionTrigger className="text-[11px] tracking-[0.22em] uppercase text-ink font-medium text-left hover:no-underline py-5 [&>svg]:text-muted-foreground">
                    Deskripsi Lengkap
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    {product.description ? (
                      <div className="space-y-3">
                        {product.description.split('\n').filter(Boolean).map((p, i) => (
                          <p key={i} className="text-sm text-muted-foreground font-light leading-relaxed">{p}</p>
                        ))}
                      </div>
                    ) : (
                      <Pending label="Deskripsi produk" />
                    )}
                  </AccordionContent>
                </AccordionItem>

                {faq.length > 0 && (
                  <AccordionItem value="faq" className="border-line">
                    <AccordionTrigger className="text-[11px] tracking-[0.22em] uppercase text-ink font-medium text-left hover:no-underline py-5 [&>svg]:text-muted-foreground">
                      FAQ
                    </AccordionTrigger>
                    <AccordionContent className="pb-6">
                      <Accordion type="single" collapsible className="w-full">
                        {faq.map((f, i) => (
                          <AccordionItem key={i} value={`faq-${i}`} className="border-line">
                            <AccordionTrigger className="text-sm text-ink font-normal text-left hover:no-underline py-4">
                              {f.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground font-light leading-relaxed">
                              {f.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
            </div>
          </Reveal>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24 md:mt-32">
            <Reveal className="text-center mb-12">
              <p className="kicker mb-4">Lanjutkan ritual</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink">PRODUK LAINNYA</h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8">
              {related.map((p: Product, i) => (
                <ProductCard key={p.id} product={p} index={i} settings={settings} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
