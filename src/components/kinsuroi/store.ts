'use client'

import { create } from 'zustand'
import type { BootstrapData, Category, Product, Article, SiteSettings } from '@/lib/types'

type KinsuroiState = {
  settings: SiteSettings
  categories: Category[]
  products: Product[]
  articles: Article[]
  loaded: boolean
  hydrate: (d: BootstrapData) => void
  refresh: () => Promise<void>
  setSettings: (s: SiteSettings) => void
}

const empty: BootstrapData = { settings: {}, categories: [], products: [], articles: [] }

export const useKinsuroi = create<KinsuroiState>((set) => ({
  settings: empty.settings,
  categories: empty.categories,
  products: empty.products,
  articles: empty.articles,
  loaded: false,
  hydrate: (d) =>
    set((prev) =>
      prev.loaded
        ? prev // already refreshed with newer API data
        : {
            settings: d.settings ?? {},
            categories: d.categories ?? [],
            products: d.products ?? [],
            articles: d.articles ?? [],
          },
    ),
  refresh: async () => {
    try {
      const res = await fetch('/api/bootstrap', { cache: 'no-store' })
      if (!res.ok) throw new Error(`bootstrap ${res.status}`)
      const data = (await res.json()) as BootstrapData
      set({
        settings: data.settings ?? {},
        categories: data.categories ?? [],
        products: data.products ?? [],
        articles: data.articles ?? [],
        loaded: true,
      })
    } catch {
      set({ loaded: true })
    }
  },
  setSettings: (s) => set({ settings: s }),
}))

export const s = (settings: SiteSettings, key: string, fallback = ''): string => {
  const v = settings[key]
  return v === undefined || v === null ? fallback : v
}
