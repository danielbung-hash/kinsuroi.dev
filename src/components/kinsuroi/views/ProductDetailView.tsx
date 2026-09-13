'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { HashLink, navigate } from '../router'
import { Reveal, RevealImage } from '../Reveal'
import { ProductCard } from '../ProductCard'
import { useKinsuroi, s } from '../store'
import { parseJsonArray, parseLines, type FaqItem, type Product } from '@/lib/types'

/** Elegant empty state for fields the admin has not filled yet */
function Pending({ label }: { label: string }) {
  return (
    <p className="text-sm text-muted-foreground/70 italic font-light">
      {label} will be available soon.
    </p>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-8 border-b border-line last:border-b-0">
      <h2 className="kicker !text-[10px] mb-4">{title}</h2>
      {children}
    </section>
  )
}

export function ProductDetailView({ slug }: { slug: string }) {
  const products = useKinsuroi((st) => st.products)
  const settings = useKinsuroi((st) => st.settings)

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
        <h1 className="font-display text-4xl text-ink mb-6">Product not found</h1>
        <p className="text-muted-foreground mb-10">The product you are looking for is not available.</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          BACK TO PRODUCTS
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
  const buyUrl = product.marketplaceUrl || s(settings, 'social_shopee', '')

  return (
    <main className="bg-white pt-24 md:pt-32 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 md:mb-12 text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
          <HashLink to="/products" className="hover:text-ink transition-colors">
            Products
          </HashLink>
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

          {/* Info */}
          <Reveal delay={0.12} className="lg:pt-4">
            {product.category && <p className="kicker mb-4">{product.category.name}</p>}
            <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight">{product.name}</h1>
            {product.shortDesc && <p className="mt-4 text-lg text-muted-foreground font-light">{product.shortDesc}</p>}

            {product.description && (
              <div className="mt-6 space-y-3">
                {product.description.split('\n').filter(Boolean).map((p, i) => (
                  <p key={i} className="text-muted-foreground font-light leading-relaxed">{p}</p>
                ))}
              </div>
            )}

            {/* Buy CTA — clear and elegant */}
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={buyUrl || '#'}
                target={buyUrl ? '_blank' : undefined}
                rel="noopener noreferrer"
                aria-disabled={!buyUrl}
                className={`btn-primary ${!buyUrl ? 'pointer-events-none opacity-40' : ''}`}
              >
                BUY NOW
              </a>
              {s(settings, 'social_shopee', '') && (
                <a href={s(settings, 'social_shopee', '')} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  BUY ON SHOPEE
                </a>
              )}
            </div>
            {!buyUrl && (
              <p className="mt-3 text-xs text-muted-foreground/70 font-light">
                Official purchase links will be available soon.
              </p>
            )}

            {/* Structured info */}
            <div className="mt-12 border-t border-line">
              <Section title="Benefits">
                {benefits.length ? (
                  <ul className="space-y-2.5">
                    {benefits.map((b, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink/80 leading-relaxed">
                        <span className="text-bronze mt-[2px]" aria-hidden="true">—</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Pending label="Detailed benefits" />
                )}
              </Section>

              <Section title="Ingredients">
                {ingredients.length ? (
                  <ul className="space-y-2 text-sm text-ink/80 leading-relaxed">
                    {ingredients.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                ) : (
                  <Pending label="Full ingredient list" />
                )}
              </Section>

              <Section title="How to use">
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
                  <Pending label="Usage directions" />
                )}
              </Section>

              <Section title="Suitable for">
                {suitableFor.length ? (
                  <p className="text-sm text-ink/80 leading-relaxed">{suitableFor.join(' · ')}</p>
                ) : (
                  <Pending label="Suitability information" />
                )}
              </Section>

              {faq.length > 0 && (
                <Section title="FAQ">
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
                </Section>
              )}
            </div>
          </Reveal>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24 md:mt-32">
            <Reveal className="text-center mb-12">
              <p className="kicker mb-4">Continue the ritual</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink">YOU MAY ALSO LIKE</h2>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8">
              {related.map((p: Product, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
