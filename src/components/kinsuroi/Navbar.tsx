'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { HashLink, navigate } from './router'
import { useKinsuroi, s } from './store'
import { extractSocial, SocialRow } from './SocialIcons'

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'About', to: '/about' },
  { label: 'Journal', to: '/journal' },
  { label: 'Contact', to: '/contact' },
]

export function Wordmark({ className = '', tone = 'dark' }: { className?: string; tone?: 'dark' | 'light' }) {
  return (
    <span
      className={`font-display font-medium tracking-[0.35em] uppercase select-none ${
        tone === 'light' ? 'text-white' : 'text-ink'
      } ${className}`}
    >
      KINSUROI
    </span>
  )
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const settings = useKinsuroi((st) => st.settings)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const go = (to: string) => {
    setOpen(false)
    navigate(to)
  }

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/95 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 h-16 md:h-20 flex items-center justify-between">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden -ml-2 p-2 text-ink"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <HashLink to="/" className="flex items-center" ariaLabel="KINSUROI home">
            <Wordmark className="text-base md:text-xl" />
          </HashLink>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10" aria-label="Primary">
            {NAV.map((n) => (
              <HashLink
                key={n.to}
                to={n.to}
                className="text-[11px] tracking-[0.28em] uppercase text-ink/80 hover:text-ink transition-colors link-underline"
              >
                {n.label}
              </HashLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <HashLink to="/products" className="!hidden lg:!inline-flex btn-primary !py-3 !px-7">
            SHOP NOW
          </HashLink>

          {/* spacer to balance mobile layout */}
          <span className="lg:hidden w-8" aria-hidden="true" />
        </div>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-line">
              <Wordmark className="text-base" />
              <button className="p-2 text-ink" onClick={() => setOpen(false)} aria-label="Close menu">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-10 gap-2" aria-label="Mobile">
              {NAV.map((n, i) => (
                <motion.button
                  key={n.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => go(n.to)}
                  className="text-left font-display text-4xl py-3 text-ink hover:text-bronze transition-colors"
                >
                  {n.label}
                </motion.button>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="px-10 pb-12 flex flex-col gap-8"
            >
              <button onClick={() => go(s(settings, 'cta_button_url', '#/products'))} className="btn-primary w-full">
                SHOP NOW
              </button>
              <SocialRow social={extractSocial(settings)} className="justify-center text-ink/60" size={18} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
