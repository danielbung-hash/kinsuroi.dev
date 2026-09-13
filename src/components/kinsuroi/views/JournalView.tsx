'use client'

import { useMemo } from 'react'
import { Reveal } from '../Reveal'
import { JournalCard } from './HomeView'
import { ArticleView } from './ArticleView'
import { useKinsuroi } from '../store'

export function JournalView() {
  const articles = useKinsuroi((st) => st.articles)

  const published = useMemo(() => articles, [articles])

  return (
    <main className="bg-white pt-28 md:pt-40 pb-20 md:pb-28">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <Reveal className="text-center mb-14 md:mb-20">
          <p className="kicker mb-5">Journal</p>
          <h1 className="font-display text-4xl md:text-6xl text-ink">KINSUROI JOURNAL</h1>
          <p className="mt-5 text-muted-foreground font-light max-w-lg mx-auto">
            Skincare routines, ingredient education, beauty tips and quiet lifestyle notes.
          </p>
        </Reveal>

        {published.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">Stories are coming soon.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-8">
            {published.map((a, i) => (
              <JournalCard key={a.id} article={a} index={i} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export { ArticleView }
