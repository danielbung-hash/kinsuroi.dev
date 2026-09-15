'use client'

import { HashLink } from '../router'
import { Reveal } from '../Reveal'
import { useK, s } from '../store'

/**
 * Company page — every long-form section is CMS-editable (settings group
 * "company"). Nothing factual is invented here: sections whose content has
 * not been filled show a discreet placeholder until the owner completes it.
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

export function CompanyView() {
  const settings = useK((st) => st.settings)

  const about = s(settings, 'company_about', '').trim()
  const vision = s(settings, 'company_vision', '').trim()
  const mission = s(settings, 'company_mission', '').trim()
  const values = s(settings, 'company_values', '').trim()
  const quality = s(settings, 'company_quality', '').trim()

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

  return (
    <main className="bg-white pt-28 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        {/* Header */}
        <Reveal className="text-center mb-16 md:mb-20">
          <p className="kicker mb-5">Perusahaan</p>
          <h1 className="font-display text-4xl md:text-6xl text-ink">TENTANG KINSUROI</h1>
          <p className="mt-6 text-muted-foreground font-light max-w-xl mx-auto">
            Mengenal lebih dekat perusahaan di balik ritual kecantikan yang sederhana dan elegan.
          </p>
        </Reveal>

        {/* Sections */}
        <div className="max-w-5xl mx-auto border-t border-line">
          <Section index="01" title="About the Company">
            {about ? <Paragraphs raw={about} /> : <EmptyNote />}
          </Section>

          <Section index="02" title="Vision & Mission">
            {vision || mission ? (
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
            ) : (
              <EmptyNote />
            )}
          </Section>

          <Section index="03" title="Our Values">
            {values ? <Paragraphs raw={values} /> : <EmptyNote />}
          </Section>

          <Section index="04" title="Quality & Commitment">
            {quality ? <Paragraphs raw={quality} /> : <EmptyNote />}
          </Section>

          <Section index="05" title="Company Information">
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
                      href={`https://wa.me/${wa.replace(/[^0-9]/g, '').replace(/^0/, '62')}`}
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
