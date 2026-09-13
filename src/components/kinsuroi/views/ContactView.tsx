'use client'

import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Reveal } from '../Reveal'
import { useKinsuroi, s } from '../store'
import { extractSocial, SocialRow, WhatsAppIcon } from '../SocialIcons'

export function ContactView() {
  const settings = useKinsuroi((st) => st.settings)
  const address = s(settings, 'contact_address', '')
  const phones = [s(settings, 'contact_phone_1', ''), s(settings, 'contact_phone_2', '')].filter(Boolean)
  const email = s(settings, 'contact_email', '')
  const whatsapp = s(settings, 'contact_whatsapp', '')
  const social = extractSocial(settings)

  return (
    <main className="bg-white pt-28 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="kicker mb-5">Contact</p>
          <h1 className="font-display text-4xl md:text-6xl text-ink">GET IN TOUCH</h1>
          <p className="mt-5 text-muted-foreground font-light max-w-md mx-auto">
            We would love to hear from you. Reach us through any of our official channels.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-line border border-line">
          {/* Address */}
          <Reveal className="bg-white">
            <div className="px-8 py-10 h-full">
              <MapPin size={20} strokeWidth={1.5} className="text-bronze mb-5" aria-hidden="true" />
              <h2 className="kicker !text-[10px] mb-3">Address</h2>
              <p className="text-sm leading-relaxed text-ink/80">{address || 'Address will be available soon.'}</p>
            </div>
          </Reveal>

          {/* Phones */}
          <Reveal delay={0.08} className="bg-white">
            <div className="px-8 py-10 h-full">
              <Phone size={20} strokeWidth={1.5} className="text-bronze mb-5" aria-hidden="true" />
              <h2 className="kicker !text-[10px] mb-3">Telephone</h2>
              {phones.length ? (
                <ul className="space-y-2">
                  {phones.map((p) => (
                    <li key={p}>
                      <a
                        href={`tel:${p.replace(/[^+\d]/g, '')}`}
                        className="text-sm text-ink/80 hover:text-ink transition-colors"
                      >
                        {p}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground/70 italic font-light">Phone numbers coming soon.</p>
              )}
            </div>
          </Reveal>

          {/* Email */}
          <Reveal delay={0.12} className="bg-white">
            <div className="px-8 py-10 h-full">
              <Mail size={20} strokeWidth={1.5} className="text-bronze mb-5" aria-hidden="true" />
              <h2 className="kicker !text-[10px] mb-3">Email</h2>
              {email ? (
                <a href={`mailto:${email}`} className="text-sm text-ink/80 hover:text-ink transition-colors">
                  {email}
                </a>
              ) : (
                <p className="text-sm text-muted-foreground/70 italic font-light">Email will be available soon.</p>
              )}
            </div>
          </Reveal>

          {/* Hours / WhatsApp / Social */}
          <Reveal delay={0.16} className="bg-white">
            <div className="px-8 py-10 h-full">
              <Clock size={20} strokeWidth={1.5} className="text-bronze mb-5" aria-hidden="true" />
              <h2 className="kicker !text-[10px] mb-3">Official Channels</h2>
              {whatsapp ? (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-ink/80 hover:text-ink transition-colors mb-5"
                >
                  <WhatsAppIcon size={15} />
                  Chat via WhatsApp
                </a>
              ) : (
                <p className="text-sm text-muted-foreground/70 italic font-light mb-5">WhatsApp will be available soon.</p>
              )}
              <div className="mt-2">
                <SocialRow social={social} className="text-ink/60" size={18} />
              </div>
            </div>
          </Reveal>
        </div>

        {/* Map hint */}
        <Reveal delay={0.2} className="mt-10 text-center">
          <p className="text-xs text-muted-foreground/70 font-light tracking-wide">
            Komp. Sentra Niaga Surya Kadu, Kec. Curug, Kota Tangerang, Banten — Indonesia
          </p>
        </Reveal>
      </div>
    </main>
  )
}

/** Quiet placeholder for customer-care pages that will be written later (FAQ, Shipping, …) */
export function ComingSoonView({ page }: { page?: string }) {
  const title = (page || '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <main className="bg-white pt-40 pb-40 text-center px-6">
      <p className="kicker mb-4">Coming Soon</p>
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-6">{title || 'This Page'}</h1>
      <p className="text-muted-foreground font-light max-w-md mx-auto mb-10">
        We are preparing this page with care. In the meantime, our team is happy to help through the contact page.
      </p>
      <a href="#/contact" className="btn-primary">
        CONTACT US
      </a>
    </main>
  )
}
