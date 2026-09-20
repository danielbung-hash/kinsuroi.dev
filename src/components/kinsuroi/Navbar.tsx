'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, Search, ShoppingBag } from 'lucide-react'
import { HashLink } from './router'
import { useK, s } from './store'
import { extractSocial, SocialRow } from './SocialIcons'

/* Menu sesuai desain terbaru — Journal tetap bisa diakses dari footer & homepage */
const NAV = [
  { label: 'Beranda', to: '/' },
  { label: 'Produk', to: '/products' },
  { label: 'Tentang Kami', to: '/about' },
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

/** Official brand logo (owner-provided artwork) — use on light surfaces */
export function LogoImage({ className = 'h-7 md:h-8' }: { className?: string }) {
  return (
    <Image
      src="/images/kinsuroi-logo.png"
      alt="KINSUROI"
      width={584}
      height={158}
      priority
      className={`w-auto select-none ${className}`}
    />
  )
}

/* ────────────────────────── SEARCH OVERLAY ────────────────────────── */

function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const products = useK((st) => st.products)
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      window.requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const query = q.trim().toLowerCase()
  const results = useMemo(
    () => (query ? products.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 6) : []),
    [products, query],
  )

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] bg-white/97 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          role="dialog"
          aria-modal="true"
          aria-label="Cari produk"
        >
          <div className="mx-auto max-w-2xl px-6 pt-28 md:pt-36">
            <div className="flex items-center justify-between mb-8">
              <p className="kicker">Pencarian</p>
              <button
                onClick={onClose}
                className="p-2 -mr-2 text-ink/70 hover:text-ink transition-colors"
                aria-label="Tutup pencarian"
              >
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-4 border-b border-ink/20 pb-4 focus-within:border-bronze transition-colors">
              <Search size={20} strokeWidth={1.5} className="text-ink/40 shrink-0" aria-hidden="true" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari produk KINSUROI…"
                className="w-full bg-transparent font-display text-2xl md:text-3xl text-ink placeholder:text-ink/30 focus:outline-none"
              />
            </div>

            <div className="mt-8">
              {query && results.length === 0 && (
                <p className="text-sm text-muted-foreground font-light">
                  Tidak ada produk yang cocok dengan &ldquo;{q.trim()}&rdquo;.
                </p>
              )}
              <ul className="divide-y divide-line">
                {results.map((p) => (
                  <li key={p.id}>
                    <HashLink
                      to={`/products/${p.slug}`}
                      onClick={onClose}
                      className="group flex items-baseline justify-between gap-6 py-4"
                      ariaLabel={`Lihat ${p.name}`}
                    >
                      <span className="font-display text-xl md:text-2xl text-ink group-hover:text-bronze transition-colors duration-300">
                        {p.name}
                      </span>
                      {p.price && (
                        <span className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground shrink-0">
                          {p.price}
                        </span>
                      )}
                    </HashLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ────────────────────────────── NAVBAR ────────────────────────────── */

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const settings = useK((st) => st.settings)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // lock body scroll when any overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, searchOpen])

  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/95 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 h-20 md:h-24 flex items-center justify-between gap-8">
          {/* Mobile hamburger */}
          <button
            className="lg:hidden -ml-2 p-2 text-ink"
            onClick={() => setMenuOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={22} strokeWidth={1.5} />
          </button>

          {/* Logo — kiri, tanpa tagline (sesuai desain terbaru) */}
          <Link href="/" className="flex items-center shrink-0" aria-label="KINSUROI — beranda">
            <LogoImage className="h-10 md:h-12" />
          </Link>

          {/* Desktop nav — mengikuti logo di sebelah kiri */}
          <nav className="hidden lg:flex items-center gap-9 xl:gap-11 mr-auto ml-12 xl:ml-16" aria-label="Navigasi utama">
            {NAV.map((n) => (
              <Link
                key={n.to}
                href={n.to}
                aria-current={isActive(n.to) ? 'page' : undefined}
                className={`relative text-[11px] tracking-[0.26em] uppercase transition-colors ${
                  isActive(n.to) ? 'text-ink nav-active' : 'text-ink/70 hover:text-ink'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Desktop icons — search + tas belanja */}
          <div className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-1 text-ink/80 hover:text-ink transition-colors"
              aria-label="Cari produk"
            >
              <Search size={19} strokeWidth={1.5} />
            </button>
            <Link
              href="/products"
              className="p-1 text-ink/80 hover:text-ink transition-colors"
              aria-label="Lihat tas belanja"
            >
              <ShoppingBag size={19} strokeWidth={1.5} />
            </Link>
          </div>

          {/* spacer to balance mobile layout */}
          <span className="lg:hidden w-8" aria-hidden="true" />
        </div>
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-white flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <div className="flex items-center justify-between px-6 h-20 border-b border-line">
              <LogoImage className="h-9" />
              <button className="p-2 text-ink" onClick={() => setMenuOpen(false)} aria-label="Tutup menu">
                <X size={22} strokeWidth={1.5} />
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-10 gap-1" aria-label="Navigasi seluler">
              {NAV.map((n, i) => (
                <motion.div
                  key={n.to}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={n.to}
                    onClick={() => setMenuOpen(false)}
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
              <Link href={s(settings, 'cta_button_url', '/products')} onClick={() => setMenuOpen(false)} className="btn-primary w-full">
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
