'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPin, Phone } from 'lucide-react'
import { HashLink } from '../router'
import { Reveal, RevealImage } from '../Reveal'
import { ProductCard } from '../ProductCard'
import { useKinsuroi, s } from '../store'
import { extractSocial, SocialRow } from '../SocialIcons'
import type { Article } from '@/lib/types'

/* ─────────────────────────── HERO ─────────────────────────── */

function Hero() {
  const settings = useKinsuroi((st) => st.settings)
  const reduce = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1] as const

  return (
    <section className="relative bg-white pt-28 md:pt-40 pb-16 md:pb-24 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Copy */}
        <div className="lg:col-span-6 xl:col-span-5 order-2 lg:order-1">
          <motion.p
            className="kicker mb-6"
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease }}
          >
            Kinsuroi — Clean Beauty
          </motion.p>

          <motion.h1
            className="font-display text-[2.75rem] leading-[1.05] md:text-6xl xl:text-7xl text-ink"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.22, ease }}
          >
            {s(settings, 'hero_title', 'YOUR BEAUTY, YOUR RITUAL.')}
          </motion.h1>

          <motion.p
            className="mt-6 md:mt-8 text-base md:text-lg text-muted-foreground font-light max-w-md leading-relaxed"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.34, ease }}
          >
            {s(settings, 'hero_subtitle', 'Discover a simple and elegant beauty ritual with KINSUROI.')}
          </motion.p>

          <motion.div
            className="mt-10 md:mt-12 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: reduce ? 0 : 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.46, ease }}
          >
            <HashLink to={s(settings, 'hero_cta_url', '#/products')} className="btn-primary">
              {s(settings, 'hero_cta_text', 'SHOP PRODUCTS')}
            </HashLink>
            <HashLink to={s(settings, 'hero_cta2_url', '#/about')} className="btn-outline">
              {s(settings, 'hero_cta2_text', 'EXPLORE KINSUROI')}
            </HashLink>
          </motion.div>
        </div>

        {/* Image */}
        <div className="lg:col-span-6 xl:col-span-7 order-1 lg:order-2">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: reduce ? 1 : 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, delay: 0.15, ease }}
          >
            <div className="relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/4.4] w-full bg-sand overflow-hidden">
              <Image
                src={s(settings, 'hero_image', '/images/hero.jpg')}
                alt="KINSUROI — elegant beauty ritual products"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
            {/* quiet frame accent */}
            <div className="hidden lg:block absolute -bottom-5 -left-5 w-full h-full border border-line -z-10" aria-hidden="true" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────── BRAND INTRODUCTION ─────────────────── */

function BrandIntro() {
  const settings = useKinsuroi((st) => st.settings)
  const desc = s(
    settings,
    'brand_description',
    'KINSUROI is a beauty brand built on one quiet idea: that caring for yourself should feel simple, elegant and honest.',
  )
  return (
    <section className="bg-sand py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <RevealImage className="lg:col-span-5" delay={0.05}>
          <div className="relative aspect-[4/5] w-full bg-cream overflow-hidden">
            <Image
              src={s(settings, 'brand_image', '/images/brand.jpg')}
              alt="The KINSUROI brand — quiet, elegant beauty"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </RevealImage>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.15}>
            <p className="kicker mb-5">The Brand</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink">{s(settings, 'brand_title', 'Beauty, Simplified.')}</h2>
            <div className="mt-6 md:mt-8 space-y-4 max-w-xl">
              {desc.split('\n').filter(Boolean).map((p, i) => (
                <p key={i} className="text-muted-foreground font-light leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-10">
              <HashLink to="/about" className="link-underline text-[11px] tracking-[0.28em] uppercase text-ink">
                Discover KINSUROI
              </HashLink>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────── PRODUCT COLLECTION ───────────────────── */

function Collection() {
  const products = useKinsuroi((st) => st.products)
  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="kicker mb-5">The Collection</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink">EXPLORE OUR COLLECTION</h2>
          <p className="mt-5 text-muted-foreground font-light max-w-lg mx-auto">
            Essential skincare and body care, thoughtfully made for your daily ritual.
          </p>
        </Reveal>

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground">Products are coming soon.</p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-16">
            {products.slice(0, 8).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}

        {products.length > 8 && (
          <Reveal className="text-center mt-16 md:mt-20">
            <HashLink to="/products" className="btn-outline">
              VIEW ALL PRODUCTS
            </HashLink>
          </Reveal>
        )}
      </div>
    </section>
  )
}

/* ───────────────────────── CTA BANNER ───────────────────────── */

function CtaBanner() {
  const settings = useKinsuroi((st) => st.settings)
  return (
    <section className="bg-ink text-white">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 py-20 md:py-28 text-center">
        <Reveal>
          <h2 className="font-display text-3xl md:text-5xl tracking-wide">
            {s(settings, 'cta_title', 'DISCOVER YOUR BEAUTY ROUTINE')}
          </h2>
          <p className="mt-5 text-white/60 font-light max-w-xl mx-auto">
            {s(settings, 'cta_text', 'Explore the KINSUROI collection and find the ritual that suits you.')}
          </p>
          <div className="mt-10">
            <HashLink to={s(settings, 'cta_button_url', '#/products')} className="btn-light">
              {s(settings, 'cta_button_text', 'SHOP NOW')}
            </HashLink>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─────────────────────── JOURNAL PREVIEW ─────────────────────── */

export function JournalCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <Reveal delay={index * 0.1}>
      <article className="group">
        <HashLink to={`/journal/${article.slug}`} ariaLabel={`Read ${article.title}`}>
          <div className="relative aspect-[4/3] bg-sand overflow-hidden">
            {article.thumbnail ? (
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-sand">
                <span className="font-display text-3xl text-bronze">K</span>
              </div>
            )}
          </div>
          <div className="pt-5">
            {article.topic && <p className="kicker !text-[10px] mb-2">{article.topic}</p>}
            <h3 className="font-display text-xl md:text-2xl text-ink leading-snug group-hover:text-bronze transition-colors duration-300">
              {article.title}
            </h3>
            {article.excerpt && <p className="mt-2 text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">{article.excerpt}</p>}
            <p className="mt-3 text-[10px] tracking-[0.28em] uppercase text-ink/70">READ STORY</p>
          </div>
        </HashLink>
      </article>
    </Reveal>
  )
}

function JournalPreview() {
  const articles = useKinsuroi((st) => st.articles)
  return (
    <section className="bg-cream py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="kicker mb-5">Journal</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink">KINSUROI JOURNAL</h2>
          <p className="mt-5 text-muted-foreground font-light max-w-lg mx-auto">
            Notes on skincare, rituals and living beautifully.
          </p>
        </Reveal>

        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground">Stories are coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {articles.slice(0, 3).map((a, i) => (
              <JournalCard key={a.id} article={a} index={i} />
            ))}
          </div>
        )}

        <Reveal className="text-center mt-16 md:mt-20">
          <HashLink to="/journal" className="btn-outline">
            VIEW ALL STORIES
          </HashLink>
        </Reveal>
      </div>
    </section>
  )
}

/* ────────────────────────── CONTACT ────────────────────────── */

export function ContactBlock() {
  const settings = useKinsuroi((st) => st.settings)
  const address = s(settings, 'contact_address', '')
  const phones = [s(settings, 'contact_phone_1', ''), s(settings, 'contact_phone_2', '')].filter(Boolean)
  const email = s(settings, 'contact_email', '')
  const social = extractSocial(settings)

  return (
    <section className="bg-white py-20 md:py-32">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <Reveal className="lg:col-span-5">
          <p className="kicker mb-5">Contact</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
            We are here,
            <br />
            quietly.
          </h2>
          <p className="mt-6 text-muted-foreground font-light max-w-md leading-relaxed">
            Questions about our products or your order? Reach the KINSUROI team through our official channels below.
          </p>
          <div className="mt-10">
            <HashLink to="/contact" className="btn-primary">
              CONTACT US
            </HashLink>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="lg:col-span-6 lg:col-start-7">
          <div className="border-t border-line">
            {address && (
              <div className="py-6 border-b border-line flex gap-5">
                <MapPin size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-bronze" aria-hidden="true" />
                <div>
                  <p className="kicker !text-[10px] mb-2">Address</p>
                  <p className="text-sm leading-relaxed text-ink/80 max-w-md">{address}</p>
                </div>
              </div>
            )}
            {phones.length > 0 && (
              <div className="py-6 border-b border-line flex gap-5">
                <Phone size={18} strokeWidth={1.5} className="mt-1 shrink-0 text-bronze" aria-hidden="true" />
                <div>
                  <p className="kicker !text-[10px] mb-2">Telephone</p>
                  <ul className="space-y-1">
                    {phones.map((p) => (
                      <li key={p}>
                        <a href={`tel:${p.replace(/[^+\d]/g, '')}`} className="text-sm text-ink/80 hover:text-ink transition-colors">
                          {p}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {email && (
              <div className="py-6 border-b border-line flex gap-5">
                <span className="kicker !text-[10px] mt-1 shrink-0">Email</span>
                <a href={`mailto:${email}`} className="text-sm text-ink/80 hover:text-ink transition-colors">
                  {email}
                </a>
              </div>
            )}
            <div className="py-6 flex items-center justify-between flex-wrap gap-4">
              <p className="kicker !text-[10px]">Follow KINSUROI</p>
              <SocialRow social={social} className="text-ink/60" size={17} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ──────────────────────── HOME ASSEMBLY ──────────────────────── */

export function HomeView() {
  return (
    <main>
      <Hero />
      <BrandIntro />
      <Collection />
      <CtaBanner />
      <JournalPreview />
      <ContactBlock />
    </main>
  )
}
