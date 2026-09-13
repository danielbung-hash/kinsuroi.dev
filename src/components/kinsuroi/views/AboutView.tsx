'use client'

import Image from 'next/image'
import { HashLink } from '../router'
import { Reveal, RevealImage } from '../Reveal'
import { useKinsuroi, s } from '../store'

const VALUES = [
  {
    title: 'Clean',
    body: 'Thoughtful formulas and honest information. What you see on the label is what you get.',
  },
  {
    title: 'Elegant',
    body: 'Quiet design in everything — from the products themselves to the way you use them.',
  },
  {
    title: 'Simple',
    body: 'No ten-step pressure. Essential products that respect your time and your skin.',
  },
  {
    title: 'Trusted',
    body: 'Clear information, official channels, and a team that answers when you reach out.',
  },
]

export function AboutView() {
  const settings = useKinsuroi((st) => st.settings)
  const desc = s(
    settings,
    'brand_description',
    'KINSUROI is a beauty brand built on one quiet idea: that caring for yourself should feel simple, elegant and honest.',
  )

  return (
    <main className="bg-white pt-28 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <Reveal className="text-center mb-16 md:mb-24">
          <p className="kicker mb-5">About KINSUROI</p>
          <h1 className="font-display text-4xl md:text-6xl text-ink">{s(settings, 'brand_title', 'Beauty, Simplified.')}</h1>
        </Reveal>

        {/* Editorial split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-24 md:mb-32">
          <RevealImage className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full bg-sand overflow-hidden">
              <Image
                src={s(settings, 'brand_image', '/images/brand.jpg')}
                alt="The KINSUROI brand"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </RevealImage>
          <div className="lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.12}>
              <div className="space-y-5 max-w-xl">
                {desc.split('\n').filter(Boolean).map((p, i) => (
                  <p key={i} className="text-muted-foreground font-light leading-relaxed text-base md:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Values */}
        <Reveal className="text-center mb-14">
          <p className="kicker mb-5">What we stand for</p>
          <h2 className="font-display text-3xl md:text-5xl text-ink">QUIET, BY DESIGN</h2>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line mb-24 md:mb-32">
          {VALUES.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08} className="bg-white">
              <div className="px-8 py-10 text-center h-full">
                <h3 className="font-display text-2xl text-ink mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground font-light leading-relaxed">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal className="text-center bg-sand px-8 py-16 md:py-24">
          <h2 className="font-display text-3xl md:text-4xl text-ink">BEGIN YOUR RITUAL</h2>
          <p className="mt-4 text-muted-foreground font-light max-w-md mx-auto">
            Explore the collection and find the products that fit your everyday.
          </p>
          <div className="mt-8">
            <HashLink to="/products" className="btn-primary">
              SHOP NOW
            </HashLink>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
