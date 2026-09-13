'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { HashLink } from './router'
import { useK, s } from './store'
import { extractSocial, SocialRow } from './SocialIcons'

const NAV = [
  { label: 'Beranda', to: '/' },
  { label: 'Produk', to: '/products' },
  { label: 'Tentang', to: '/about' },
  { label: 'Journal', to: '/journal' },
  { label: 'Kontak', to: '/contact' },
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
  const pathname = usePathname()
  const settings = useK((st) => st.settings)

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

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

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
            aria-label="Buka menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center" aria-label="KINSUROI — beranda">
            <Wordmark className="text-base md:text-xl" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10" aria-label="Navigasi utama">
            {NAV.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                aria-current={isActive(n.to) ? 'page' : undefined}
                className={`text-[11px] tracking-[0.28em] uppercase transition-colors link-underline ${
                  isActive(n.to) ? 'text-ink' : 'text-ink/80 hover:text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <Link href="/products" className="!hidden lg:!inline-flex btn-primary !py-3 !px-7">
            BELI SEKARANG
          </Link>

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
              <button className="p-2 text-ink" onClick={() => setOpen(false)} aria-label="Tutup menu">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-10 gap-2" aria-label="Navigasi seluler">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={n.to}
                    onClick={() => setOpen(false)}
                    className={`block text-left font-display text-4xl py-3 transition-colors ${
                      isActive(n.to) ? 'text-bronze' : 'text-ink hover:text-bronze'
                    }`}
                  >
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="px-10 pb-12 flex flex-col gap-8"
            >
              <Link href={s(settings, 'cta_button_url', '/products')} onClick={() => setOpen(false)} className="btn-primary w-full">
                BELI SEKARANG
              </Link>
              <SocialRow social={extractSocial(settings)} className="justify-center text-ink/60" size={18} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
