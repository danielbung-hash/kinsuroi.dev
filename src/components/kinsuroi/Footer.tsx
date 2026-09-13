'use client'

import { HashLink } from './router'
import { useKinsuroi, s } from './store'
import { extractSocial, SocialRow } from './SocialIcons'
import { Wordmark } from './Navbar'

const EXPLORE = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Journal', to: '/journal' },
  { label: 'Contact', to: '/contact' },
]

const CUSTOMER = [
  { label: 'FAQ', to: '/coming-soon?page=faq' },
  { label: 'Shipping', to: '/coming-soon?page=shipping' },
  { label: 'Returns', to: '/coming-soon?page=returns' },
  { label: 'Privacy Policy', to: '/coming-soon?page=privacy-policy' },
  { label: 'Terms & Conditions', to: '/coming-soon?page=terms-conditions' },
]

export function Footer() {
  const settings = useKinsuroi((st) => st.settings)
  const social = extractSocial(settings)

  return (
    <footer className="mt-auto bg-ink-soft text-neutral-400">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12 pt-16 md:pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <Wordmark tone="light" className="text-xl" />
            <p className="text-sm leading-relaxed max-w-xs text-neutral-400">{s(settings, 'footer_text', 'Clean. Quiet. Elegant. Trustworthy.')}</p>
            <SocialRow social={social} className="text-neutral-400 [&_a:hover]:text-white" size={17} />
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h3 className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-6">Navigation</h3>
            <ul className="space-y-3.5">
              {EXPLORE.map((l) => (
                <li key={l.to}>
                  <HashLink to={l.to} className="text-sm hover:text-white transition-colors duration-300">
                    {l.label}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-6">Customer</h3>
            <ul className="space-y-3.5">
              {CUSTOMER.map((l) => (
                <li key={l.label}>
                  <HashLink to={l.to} className="text-sm hover:text-white transition-colors duration-300">
                    {l.label}
                  </HashLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop CTA */}
          <div className="lg:col-span-3">
            <h3 className="text-[11px] tracking-[0.3em] uppercase text-neutral-500 mb-6">Shop</h3>
            <p className="text-sm leading-relaxed mb-6 text-neutral-400">
              Explore the KINSUROI collection on our official channels.
            </p>
            <HashLink to="/products" className="btn-light !py-3 !px-7">
              SHOP KINSUROI
            </HashLink>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs tracking-wide text-neutral-500">{s(settings, 'footer_copyright', '© KINSUROI. All rights reserved.')}</p>
          <p className="text-[10px] tracking-[0.3em] uppercase text-neutral-600">Official Website</p>
        </div>
      </div>
    </footer>
  )
}
