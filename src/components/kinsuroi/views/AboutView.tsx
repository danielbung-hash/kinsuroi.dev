'use client'

import Image from 'next/image'
import { HashLink } from '../router'
import { Reveal, RevealImage } from '../Reveal'
import { useK, s } from '../store'

const VALUES = [
  {
    title: 'Bersih',
    body: 'Formula yang dipikirkan matang dan informasi yang jujur. Apa yang tertulis di label adalah yang kamu dapatkan.',
  },
  {
    title: 'Elegan',
    body: 'Desain yang tenang dalam segala hal — dari produknya sendiri hingga cara kamu menggunakannya.',
  },
  {
    title: 'Sederhana',
    body: 'Tanpa tekanan sepuluh langkah. Produk esensial yang menghormati waktumu dan kulitmu.',
  },
  {
    title: 'Terpercaya',
    body: 'Informasi yang jelas, kanal resmi, dan tim yang selalu merespons ketika kamu menghubungi.',
  },
]

export function AboutView() {
  const settings = useK((st) => st.settings)
  const desc = s(
    settings,
    'brand_description',
    'KINSUROI adalah brand kecantikan dengan satu ide sederhana: merawat diri harus terasa mudah, elegan, dan jujur.',
  )

  return (
    <main className="bg-white pt-28 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <Reveal className="text-center mb-16 md:mb-24">
          <p className="kicker mb-5">Tentang KINSUROI</p>
          <h1 className="font-display text-4xl md:text-6xl text-ink">{s(settings, 'brand_title', 'Kecantikan yang Sederhana.')}</h1>
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
          <p className="kicker mb-5">Nilai kami</p>
          <h2 className="font-display text-3xl md:text-5xl text-ink">TENANG, SEJAK AWAL</h2>
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
          <h2 className="font-display text-3xl md:text-4xl text-ink">MULAI RITUALMU</h2>
          <p className="mt-4 text-muted-foreground font-light max-w-md mx-auto">
            Jelajahi koleksi dan temukan produk yang menemani harianmu.
          </p>
          <div className="mt-8">
            <HashLink to="/products" className="btn-primary">
              BELI SEKARANG
            </HashLink>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
