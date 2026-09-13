'use client'

// KINSUROI — tiny hash router (SPA-safe for the sandbox preview, deep-linkable)
// Routes:
//   #/                        home
//   #/products                collection
//   #/products?category=slug  collection filtered
//   #/products/{slug}         product detail
//   #/about                   brand
//   #/journal                 journal
//   #/journal/{slug}          article
//   #/contact                 contact
//   #/admin                   CMS

import { useEffect, useState, useCallback } from 'react'

export type Route = {
  segments: string[]
  query: URLSearchParams
  raw: string
}

function parseHash(): Route {
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  const [pathPart, queryPart] = raw.split('?')
  const segments = pathPart.split('/').filter(Boolean)
  return { segments, query: new URLSearchParams(queryPart || ''), raw }
}

export function useHashRoute(): Route {
  // SSR-safe: start from the home route so server and client render match,
  // then sync with the real hash after hydration.
  const [route, setRoute] = useState<Route>(() => ({ segments: [], query: new URLSearchParams(), raw: '' }))

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    onChange()
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function navigate(to: string, opts?: { keepScroll?: boolean }) {
  const target = to.startsWith('#') ? to : `#${to.startsWith('/') ? to : `/${to}`}`
  if (window.location.hash === target) {
    // force refresh of the same route
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  } else {
    window.location.hash = target
  }
  if (!opts?.keepScroll) {
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }
}

export function useScrollTopOnRouteChange(key: string) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [key])
}

/** Anchor that keeps default hash behaviour but guarantees scroll-to-top */
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
  const handle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onClick?.()
      navigate(to)
    },
    [to, onClick],
  )
  return (
    <a href={`#${to}`} onClick={handle} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
