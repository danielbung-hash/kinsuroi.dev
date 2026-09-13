'use client'

// KINSUROI — shared site shell for every real route.
// Server-fetched data flows through BootstrapContext so the SSR markup is
// complete and deterministic; Navbar + page + Footer wrap every page.

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { setAppRouter } from './router'
import { BootstrapContext } from './store'
import type { BootstrapData } from '@/lib/types'

export function SiteShell({ initial, children }: { initial: BootstrapData; children: React.ReactNode }) {
  const router = useRouter()

  // Bridge the app router for programmatic navigation helpers
  useEffect(() => {
    setAppRouter(router)
    return () => setAppRouter(null)
  }, [router])

  return (
    <BootstrapContext.Provider value={initial}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col">{children}</div>
        <Footer />
      </div>
    </BootstrapContext.Provider>
  )
}
