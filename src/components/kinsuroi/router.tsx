'use client'

// KINSUROI — routing helpers on top of the Next.js App Router.
// Every page is a real, separately addressable route:
//   /                          home
//   /products                  collection
//   /products?category=slug    collection filtered
//   /products/[slug]           product detail
//   /about                     brand
//   /journal                   journal
//   /journal/[slug]            article
//   /contact                   contact
//   /coming-soon?page=…        customer-care placeholder
//   /admin                     CMS

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type NextRouter = ReturnType<typeof useRouter>

// Module-level bridge so plain functions (used by class-free helpers) can
// trigger client-side navigation without prop-drilling the router.
let routerRef: NextRouter | null = null

/** Register the app router instance — called by <RouterBridge/> in SiteShell */
export function setAppRouter(r: NextRouter | null) {
  routerRef = r
}

/** Programmatic navigation with guaranteed scroll-to-top */
export function navigate(to: string, opts?: { keepScroll?: boolean }) {
  if (routerRef) {
    routerRef.push(to)
  } else {
    window.location.assign(to)
  }
  if (!opts?.keepScroll) {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }
}

/** Internal link that keeps a single simple API across the whole site */
export function HashLink({
  to,
  children,
  className,
  onClick,
  ariaLabel,
}: {
  to: string
  children: React.ReactNode
  className?: string
  onClick?: () => void
  ariaLabel?: string
}) {
  const href = to.startsWith('/admin') ? to : to.startsWith('#') ? to.slice(1) || '/' : to
  return (
    <Link href={href} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </Link>
  )
}

/** Scroll to top whenever the given key changes (route/slug change) */
export function useScrollTopOnRouteChange(key: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [key])
}
