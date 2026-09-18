'use client'

import Image from 'next/image'
import { HashLink } from '../router'
import { Reveal, RevealImage } from '../Reveal'
import { useK, s } from '../store'
import { whatsappLink } from '@/lib/types'

/**
 * Tentang / Company Profile — single page (merged former /about + /company),
 * structured after the owner's official "PT Dani Era Mardika — Company
 * Profile" document. Every long-form section is CMS-editable via the
 * settings group "company". Sections whose content is empty show a discreet
 * placeholder until filled.
 */

function Paragraphs({ raw }: { raw: string }) {
  return (
    <div className="space-y-4">
      {raw.split('\n').filter(Boolean).map((p, i) => (
        <p key={i} className="text-muted-foreground font-light leading-relaxed text-base md:text-lg">
          {p}
        </p>
      ))}
    </div>
  )
}

function EmptyNote() {
  return (
    <p className="text-sm text-muted-foreground/60 italic font-light border-l border-line pl-4">
      Konten akan diperbarui oleh tim KINSUROI.
    </p>
  )
}

function Section({
  index,
  title,
  children,
}: {
  index: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 border-b border-line last:border-b-0">
      <div className="md:col-span-3">
        <p className="font-display text-3xl text-bronze/70">{index}</p>
        <h2 className="kicker !text-[11px] mt-2">{title}</h2>
      </div>
      <div className="md:col-span-8 md:col-start-5">{children}</div>
    </section>
  )
}

/** "Label: Value" per line — compact fact sheet, e.g. Badan Hukum / Fasilitas */
function Facts({ raw }: { raw: string }) {
  const rows = raw
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf(':')
      return idx > 0 ? { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() } : { label: '', value: line }
    })
    .filter((r) => r.value)

  if (rows.length === 0) return null
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
      {rows.map((r, i) => (
        <div key={i} className="bg-white px-5 py-4">
          {r.label && <p className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground mb-1">{r.label}</p>}
          <p className="text-sm text-ink/85 font-light">{r.value}</p>
        </div>
      ))}
    </div>
  )
}

export function AboutView() {
  const settings = useK((st) => st.settings)

  const about = s(settings, 'company_about', '').trim()
  const facts = s(settings, 'company_facts', '').trim()
  const founder = s(settings, 'company_founder', '').trim()
  const founderImage = s(settings, 'company_founder_image', '/images/company/company-founder.jpg').trim()
  const factory = s(settings, 'company_factory', '').trim()
  const factoryImage = s(settings, 'company_factory_image', '/images/company/company-facility.jpg').trim()
  const quality = s(settings, 'company_quality', '').trim()
  const responsibility = s(settings, 'company_responsibility', '').trim()
  const quote = s(settings, 'company_quote', '').trim()
  const production = s(settings, 'company_production', '').trim()
  const lab = s(settings, 'company_lab', '').trim()
  const labImage = s(settings, 'company_lab_image', '/images/company/company-founder-lab.jpg').trim()
  const encapsulation = s(settings, 'company_encapsulation', '').trim()
  const natural = s(settings, 'company_natural', '').trim()
  const brandStory = s(settings, 'company_brand_story', '').trim()
  const kintsukuroi = s(settings, 'company_kintsukuroi', '').trim()
  const vision = s(settings, 'company_vision', '').trim()
  const mission = s(settings, 'company_mission', '').trim()
  const values = s(settings, 'company_values', '').trim()

  const address = s(settings, 'contact_address', '').trim()
  const phone1 = s(settings, 'contact_phone_1', '').trim()
  const phone2 = s(settings, 'contact_phone_2', '').trim()
  const email = s(settings, 'contact_email', '').trim()
  const wa = s(settings, 'contact_whatsapp', '').trim()

  const infoRows = [
    { label: 'Alamat', value: address },
    { label: 'Telepon', value: [phone1, phone2].filter(Boolean).join(' · ') },
    { label: 'Email', value: email },
  ].filter((r) => r.value)

  let sectionNumber = 0
  const num = () => String(++sectionNumber).padStart(2, '0')

  return (
    <main className="bg-white pt-28 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <Reveal className="text-center mb-16 md:mb-20">
          <p className="kicker mb-5">Company Profile</p>
          <h1 className="font-display text-4xl md:text-6xl text-ink">TENTANG KINSUROI</h1>
          <p className="mt-6 text-muted-foreground font-light max-w-xl mx-auto">
            Mengenal lebih dekat perusahaan dan brand di balik ritual kecantikan yang sederhana dan elegan.
          </p>
        </Reveal>

        <div className="max-w-5xl mx-auto border-t border-line">
          {/* 01 — Siapa Kami */}
          <Section index={num()} title="Siapa Kami">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start">
              <RevealImage className="sm:col-span-5">
                <div className="relative aspect-[4/5] w-full bg-sand overflow-hidden">
                  {founderImage && (
                    <Image
                      src={founderImage}
                      alt={founder || 'Founder PT Dani Era Mardika'}
                      fill
                      sizes="(max-width: 640px) 100vw, 260px"
                      className="object-cover"
                    />
                  )}
                </div>
                {founder && (
                  <p className="mt-3 text-[10px] tracking-[0.2em] uppercase text-muted-foreground leading-relaxed">{founder}</p>
                )}
              </RevealImage>
              <div className="sm:col-span-7">
                {about ? <Paragraphs raw={about} /> : <EmptyNote />}
                {facts && <Facts raw={facts} />}
              </div>
            </div>
          </Section>

          {/* 02 — Kenapa Pabrik Sendiri */}
          <Section index={num()} title="Kenapa Kami Membangun Pabrik Sendiri">
            {factoryImage && (
              <RevealImage className="mb-8">
                <div className="relative aspect-[16/9] w-full bg-sand overflow-hidden">
                  <Image
                    src={factoryImage}
                    alt="Fasilitas Lab & Produksi"
                    fill
                    sizes="(max-width: 1024px) 100vw, 640px"
                    className="object-cover"
                  />
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground/70 text-center">Fasilitas Lab &amp; Produksi</p>
              </RevealImage>
            )}
            {factory ? <Paragraphs raw={factory} /> : <EmptyNote />}
            {(quality || responsibility) && (
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {quality && (
                  <div className="border-l-2 border-bronze/60 pl-5">
                    <p className="font-display text-xl text-ink mb-2">Kontrol Kualitas</p>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{quality}</p>
                  </div>
                )}
                {responsibility && (
                  <div className="border-l-2 border-bronze/60 pl-5">
                    <p className="font-display text-xl text-ink mb-2">Tanggung Jawab Penuh</p>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">{responsibility}</p>
                  </div>
                )}
              </div>
            )}
          </Section>

          {/* Quote */}
          {quote && (
            <Reveal className="max-w-3xl mx-auto py-10 md:py-14 text-center">
              <p className="font-display text-2xl md:text-3xl text-ink/85 italic leading-relaxed">&ldquo;{quote}&rdquo;</p>
            </Reveal>
          )}

          {/* 03 — Formulasi & Produksi In-House */}
          <Section index={num()} title="Formulasi & Produksi In-House">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-8 items-start mb-8">
              {labImage && (
                <RevealImage className="sm:col-span-4 order-2 sm:order-1">
                  <div className="relative aspect-[4/5] w-full bg-sand overflow-hidden">
                    <Image
                      src={labImage}
                      alt="Formulasi in-house"
                      fill
                      sizes="(max-width: 640px) 100vw, 220px"
                      className="object-cover"
                    />
                  </div>
                </RevealImage>
              )}
              <div className="sm:col-span-8 order-1 sm:order-2">
                {production ? <Paragraphs raw={production} /> : <EmptyNote />}
              </div>
            </div>
            {lab && (
              <div className="py-6 border-t border-line">
                <p className="font-display text-2xl text-ink mb-3">Lab &amp; Produksi</p>
                <Paragraphs raw={lab} />
              </div>
            )}
            {encapsulation && (
              <div className="py-6 border-t border-line">
                <p className="font-display text-2xl text-ink mb-3">Bahan Baku Encapsulation</p>
                <Paragraphs raw={encapsulation} />
              </div>
            )}
            {natural && (
              <div className="py-6 border-t border-line">
                <p className="font-display text-2xl text-ink mb-3">Ekstrak Alami Indonesia</p>
                <Paragraphs raw={natural} />
              </div>
            )}
          </Section>

          {/* 04 — Brand KINSUROI */}
          <Section index={num()} title="Brand KINSUROI">
            {brandStory ? <Paragraphs raw={brandStory} /> : <EmptyNote />}
            {kintsukuroi && (
              <Reveal className="mt-8 bg-sand px-8 py-10">
                <p className="kicker !text-[10px] mb-4">Terinspirasi Seni Jepang Kintsukuroi</p>
                <Paragraphs raw={kintsukuroi} />
                <p className="mt-6 font-display text-lg text-bronze italic">KINSUROI — The Beauty of Simplicity.</p>
              </Reveal>
            )}
          </Section>

          {/* 05 — Visi & Misi (optional) */}
          {(vision || mission) && (
            <Section index={num()} title="Visi & Misi">
              <div className="space-y-8">
                {vision && (
                  <div>
                    <p className="font-display text-2xl text-ink mb-3">Visi</p>
                    <Paragraphs raw={vision} />
                  </div>
                )}
                {mission && (
                  <div>
                    <p className="font-display text-2xl text-ink mb-3">Misi</p>
                    <Paragraphs raw={mission} />
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* 06 — Nilai Kami (optional) */}
          {values && (
            <Section index={num()} title="Nilai Kami">
              <Paragraphs raw={values} />
            </Section>
          )}

          {/* Company Information */}
          <Section index={num()} title="Company Information">
            {infoRows.length > 0 || wa ? (
              <div className="divide-y divide-line border border-line">
                {infoRows.map((r) => (
                  <div key={r.label} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-6 px-6 py-5">
                    <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground pt-0.5">{r.label}</p>
                    <p className="sm:col-span-2 text-sm text-ink/85 font-light leading-relaxed">{r.value}</p>
                  </div>
                ))}
                {wa && (
                  <div className="px-6 py-5">
                    <a
                      href={whatsappLink(wa)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-outline !py-2.5 !px-6 text-[10px] tracking-[0.25em] uppercase"
                    >
                      Hubungi Kami via WhatsApp
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <EmptyNote />
            )}
          </Section>
        </div>

        {/* CTA */}
        <Reveal className="max-w-5xl mx-auto mt-16 md:mt-20 text-center bg-sand px-8 py-16 md:py-20">
          <h2 className="font-display text-3xl md:text-4xl text-ink">MULAI RITUALMU</h2>
          <p className="mt-4 text-muted-foreground font-light max-w-md mx-auto">
            Jelajahi koleksi KINSUROI dan temukan produk yang menemani harianmu.
          </p>
          <div className="mt-8">
            <HashLink to="/products" className="btn-primary">
              LIHAT PRODUK
            </HashLink>
          </div>
        </Reveal>
      </div>
    </main>
  )
}
