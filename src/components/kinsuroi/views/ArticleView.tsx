'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { HashLink, navigate } from '../router'
import { Reveal, RevealImage } from '../Reveal'
import { JournalCard } from './HomeView'
import { useK } from '../store'

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch {
    return ''
  }
}

export function ArticleView({ slug }: { slug: string }) {
  const articles = useK((st) => st.articles)
  const article = useMemo(() => articles.find((a) => a.slug === slug), [articles, slug])
  const more = useMemo(() => articles.filter((a) => a.slug !== slug).slice(0, 3), [articles, slug])

  if (!article) {
    return (
      <main className="bg-white pt-40 pb-32 text-center px-6">
        <p className="kicker mb-4">404</p>
        <h1 className="font-display text-4xl text-ink mb-6">Cerita tidak ditemukan</h1>
        <p className="text-muted-foreground mb-10">Cerita journal ini tidak tersedia.</p>
        <button onClick={() => navigate('/journal')} className="btn-primary">
          KEMBALI KE JOURNAL
        </button>
      </main>
    )
  }

  const paragraphs = (article.content || '').split('\n').filter((p) => p.trim())
  const date = formatDate(article.publishedAt)

  return (
    <main className="bg-white pt-24 md:pt-32 pb-20 md:pb-28">
      <article className="mx-auto max-w-3xl px-6">
        {/* Back */}
        <HashLink
          to="/journal"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-muted-foreground hover:text-ink transition-colors mb-10"
        >
          <ArrowLeft size={14} strokeWidth={1.5} aria-hidden="true" />
          Journal
        </HashLink>

        {/* Header */}
        <Reveal className="text-center">
          {article.topic && <p className="kicker mb-4">{article.topic}</p>}
          <h1 className="font-display text-3xl md:text-5xl text-ink leading-tight">{article.title}</h1>
          <p className="mt-6 text-xs tracking-[0.2em] uppercase text-muted-foreground">
            {article.author}
            {date ? ` — ${date}` : ''}
          </p>
        </Reveal>

        {/* Hero thumbnail */}
        {article.thumbnail && (
          <RevealImage className="mt-12">
            <div className="relative aspect-[16/9] w-full bg-sand overflow-hidden">
              <Image
                src={article.thumbnail}
                alt={article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          </RevealImage>
        )}

        {/* Content */}
        <Reveal delay={0.1}>
          <div className="mt-12 space-y-6">
            {article.excerpt && (
              <p className="text-lg text-ink/80 font-light leading-relaxed italic font-display text-center">
                {article.excerpt}
              </p>
            )}
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base text-ink/75 font-light leading-[1.9]">
                {p}
              </p>
            ))}
          </div>
        </Reveal>
      </article>

      {/* More stories */}
      {more.length > 0 && (
        <div className="mx-auto max-w-[1440px] px-6 lg:px-12 mt-24 md:mt-32">
          <Reveal className="text-center mb-12">
            <p className="kicker mb-4">Lanjutkan membaca</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink">SELANJUTNYA DARI JOURNAL</h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {more.map((a, i) => (
              <JournalCard key={a.id} article={a} index={i} />
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
