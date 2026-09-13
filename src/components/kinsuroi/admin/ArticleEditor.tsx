'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Field, TextField, AreaField, ImageField } from './fields'
import type { Article } from '@/lib/types'

type Draft = {
  title: string
  slug: string
  topic: string
  excerpt: string
  content: string
  thumbnail: string
  author: string
  status: string
  seoTitle: string
  seoDescription: string
}

const TOPICS = ['Routine', 'Education', 'Tips', 'Lifestyle', 'Ingredients']

function toDraft(a?: Article | null): Draft {
  return {
    title: a?.title ?? '',
    slug: a?.slug ?? '',
    topic: a?.topic ?? '',
    excerpt: a?.excerpt ?? '',
    content: a?.content ?? '',
    thumbnail: a?.thumbnail ?? '',
    author: a?.author ?? 'KINSUROI Editorial',
    status: a?.status ?? 'draft',
    seoTitle: a?.seoTitle ?? '',
    seoDescription: a?.seoDescription ?? '',
  }
}

export function ArticleEditor({
  open,
  onOpenChange,
  article,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  article?: Article | null
  onSaved: () => void
}) {
  const [d, setD] = useState<Draft>(toDraft(article))
  const [saving, setSaving] = useState(false)

  useEffect(() => setD(toDraft(article)), [article, open])

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }))

  const save = async () => {
    if (!d.title.trim()) {
      toast({ title: 'Title is required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(article ? `/api/articles/${article.id}` : '/api/articles', {
        method: article ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast({ title: article ? 'Article updated' : 'Article created' })
      onSaved()
      onOpenChange(false)
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto thin-scroll bg-cream">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{article ? 'Edit story' : 'New story'}</DialogTitle>
          <DialogDescription>Journal articles support draft and published states.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <TextField label="Title" value={d.title} onChange={(v) => set('title', v)} />
          <TextField label="Slug" value={d.slug} onChange={(v) => set('slug', v)} hint="Leave as generated unless needed" />

          <Field label="Topic">
            <Select value={d.topic || 'none'} onValueChange={(v) => set('topic', v === 'none' ? '' : v)}>
              <SelectTrigger className="bg-white w-full"><SelectValue placeholder="Select topic" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {TOPICS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <TextField label="Author" value={d.author} onChange={(v) => set('author', v)} />

          <div className="md:col-span-2">
            <AreaField label="Excerpt" value={d.excerpt} onChange={(v) => set('excerpt', v)} rows={2} hint="Short summary shown on cards" />
          </div>

          <div className="md:col-span-2">
            <AreaField label="Content" value={d.content} onChange={(v) => set('content', v)} rows={12} hint="One paragraph per line (blank lines are ignored)" />
          </div>

          <div className="md:col-span-2">
            <ImageField label="Thumbnail" value={d.thumbnail} onChange={(v) => set('thumbnail', v)} aspect="aspect-[16/9]" />
          </div>

          <Field label="Status">
            <Select value={d.status} onValueChange={(v) => set('status', v)}>
              <SelectTrigger className="bg-white w-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <TextField label="SEO title" value={d.seoTitle} onChange={(v) => set('seoTitle', v)} />
          <div className="md:col-span-2">
            <TextField label="SEO description" value={d.seoDescription} onChange={(v) => set('seoDescription', v)} />
          </div>
        </div>

        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="btn-outline !py-2.5 !px-5">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary !py-2.5 !px-5 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save story'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
