'use client'

import { useEffect } from 'react'
import { useHashRoute } from './router'
import { useKinsuroi } from './store'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { HomeView } from './views/HomeView'
import { ProductsView } from './views/ProductsView'
import { ProductDetailView } from './views/ProductDetailView'
import { AboutView } from './views/AboutView'
import { JournalView, ArticleView } from './views/JournalView'
import { ContactView, ComingSoonView } from './views/ContactView'
import { AdminView } from './AdminView'
import type { BootstrapData } from '@/lib/types'

/**
 * KINSUROI storefront shell.
 *
 * The sandbox preview exposes a single route (`/`), so all pages are rendered
 * as views inside this shell with deep-linkable hash routes (#/products/…).
 * Components map 1:1 to real routes for a full Next.js deployment.
 */
export function KinsuroiApp({ initial }: { initial: BootstrapData }) {
  const route = useHashRoute()
  const { refresh, hydrate } = useKinsuroi()

  // Hydrate store with server-rendered data, then refresh in the background
  useEffect(() => {
    hydrate(initial)
    refresh()
  }, [initial, hydrate, refresh])

  const [seg0, seg1] = route.segments
  const key = route.raw

  // Keep document.title in sync with the active view
  useEffect(() => {
    const { products, articles } = useKinsuroi.getState()
    if (seg0 === 'products' && seg1) {
      const p = products.find((x) => x.slug === seg1)
      document.title = p ? `${p.name} | KINSUROI` : 'Products | KINSUROI'
    } else if (seg0 === 'journal' && seg1) {
      const a = articles.find((x) => x.slug === seg1)
      document.title = a ? `${a.title} | KINSUROI Journal` : 'Journal | KINSUROI'
    } else if (seg0 === 'products') document.title = 'Our Products | KINSUROI'
    else if (seg0 === 'about') document.title = 'About | KINSUROI'
    else if (seg0 === 'journal') document.title = 'KINSUROI Journal'
    else if (seg0 === 'contact') document.title = 'Contact | KINSUROI'
    else if (seg0 === 'admin') document.title = 'Admin CMS | KINSUROI'
    else document.title = 'KINSUROI — Your Beauty, Your Ritual. | Official Website'
  }, [key, seg0, seg1])

  if (seg0 === 'admin') {
    return <AdminView />
  }

  let view: React.ReactNode
  switch (seg0) {
    case 'products':
      view = seg1 ? <ProductDetailView slug={seg1} /> : <ProductsView categorySlug={route.query.get('category') || undefined} />
      break
    case 'about':
      view = <AboutView />
      break
    case 'journal':
      view = seg1 ? <ArticleView slug={seg1} /> : <JournalView />
      break
    case 'contact':
      view = <ContactView />
      break
    case 'coming-soon':
      view = <ComingSoonView page={route.query.get('page') || undefined} />
      break
    default:
      view = <HomeView />
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col">{view}</div>
      <Footer />
    </div>
  )
}
