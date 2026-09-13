'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Field, TextField, AreaField, SwitchField, ImageField } from './fields'
import type { Category, FaqItem, Product } from '@/lib/types'

type Draft = {
  name: string
  slug: string
  categoryId: string
  shortDesc: string
  description: string
  benefits: string
  ingredients: string
  howToUse: string
  suitableFor: string
  image: string
  gallery: string
  faq: string
  status: string
  featured: boolean
  order: number
  marketplaceUrl: string
  seoTitle: string
  seoDescription: string
}

function toDraft(p?: Product | null): Draft {
  return {
    name: p?.name ?? '',
    slug: p?.slug ?? '',
    categoryId: p?.categoryId ?? '',
    shortDesc: p?.shortDesc ?? '',
    description: p?.description ?? '',
    benefits: p?.benefits ?? '',
    ingredients: p?.ingredients ?? '',
    howToUse: p?.howToUse ?? '',
    suitableFor: p?.suitableFor ?? '',
    image: p?.image ?? '',
    gallery: p?.gallery ?? '',
    faq: p?.faq ?? '',
    status: p?.status ?? 'published',
    featured: p?.featured ?? false,
    order: p?.order ?? 99,
    marketplaceUrl: p?.marketplaceUrl ?? '',
    seoTitle: p?.seoTitle ?? '',
    seoDescription: p?.seoDescription ?? '',
  }
}

export function ProductEditor({
  open,
  onOpenChange,
  product,
  categories,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  product?: Product | null
  categories: Category[]
  onSaved: () => void
}) {
  const [d, setD] = useState<Draft>(toDraft(product))
  const [saving, setSaving] = useState(false)
  const [faqItems, setFaqItems] = useState<FaqItem[]>([])

  useEffect(() => {
    setD(toDraft(product))
    try {
      setFaqItems(product?.faq ? (JSON.parse(product.faq) as FaqItem[]) : [])
    } catch {
      setFaqItems([])
    }
  }, [product, open])

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }))

  const save = async () => {
    if (!d.name.trim()) {
      toast({ title: 'Product name is required', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const payload = { ...d, faq: JSON.stringify(faqItems.filter((f) => f.question.trim())) }
      const res = await fetch(product ? `/api/products/${product.id}` : '/api/products', {
        method: product ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast({ title: product ? 'Product updated' : 'Product created' })
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
          <DialogTitle className="font-display text-2xl">{product ? 'Edit product' : 'New product'}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Leave fields empty if information is not available yet.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          <TextField label="Product name" value={d.name} onChange={(v) => set('name', v)} placeholder="KINSUROI …" />
          <TextField label="Slug" value={d.slug} onChange={(v) => set('slug', v)} placeholder="kinsuroi-…" hint="URL segment — leave as generated unless needed" />

          <Field label="Category">
            <Select value={d.categoryId || 'none'} onValueChange={(v) => set('categoryId', v === 'none' ? '' : v)}>
              <SelectTrigger className="bg-white w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— No category —</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <TextField label="Short description" value={d.shortDesc} onChange={(v) => set('shortDesc', v)} placeholder="Gentle cleansing gel" />

          <div className="md:col-span-2">
            <AreaField label="Description" value={d.description} onChange={(v) => set('description', v)} rows={4} hint="One paragraph per line" />
          </div>

          <AreaField label="Benefits" value={d.benefits} onChange={(v) => set('benefits', v)} rows={4} hint="One benefit per line" />
          <AreaField label="Ingredients (INCI)" value={d.ingredients} onChange={(v) => set('ingredients', v)} rows={4} hint="One ingredient or group per line" />

          <AreaField label="How to use" value={d.howToUse} onChange={(v) => set('howToUse', v)} rows={4} hint="Step per line" />
          <AreaField label="Suitable for" value={d.suitableFor} onChange={(v) => set('suitableFor', v)} rows={4} hint="One skin type / need per line" />

          <div className="md:col-span-2">
            <ImageField label="Product image" value={d.image} onChange={(v) => set('image', v)} />
          </div>

          {/* FAQ repeater */}
          <div className="md:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">FAQ</p>
              <button
                type="button"
                onClick={() => setFaqItems((f) => [...f, { question: '', answer: '' }])}
                className="inline-flex items-center gap-1 text-xs text-ink hover:text-bronze transition-colors"
              >
                <Plus size={13} /> Add question
              </button>
            </div>
            {faqItems.length === 0 && <p className="text-xs text-muted-foreground/70">No questions yet.</p>}
            {faqItems.map((f, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-start bg-white border border-line p-3 rounded-sm">
                <TextField label={`Q${i + 1}`} value={f.question} onChange={(v) => setFaqItems((arr) => arr.map((x, j) => (j === i ? { ...x, question: v } : x)))} />
                <AreaField label="Answer" value={f.answer} onChange={(v) => setFaqItems((arr) => arr.map((x, j) => (j === i ? { ...x, answer: v } : x)))} rows={2} />
                <button
                  type="button"
                  onClick={() => setFaqItems((arr) => arr.filter((_, j) => j !== i))}
                  className="justify-self-start inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                >
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Status">
              <Select value={d.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger className="bg-white w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <TextField label="Display order" value={String(d.order)} onChange={(v) => set('order', parseInt(v) || 99)} type="number" />
            <TextField label="Marketplace URL" value={d.marketplaceUrl} onChange={(v) => set('marketplaceUrl', v)} placeholder="https://shopee.co.id/…" hint="Used by the BUY NOW button on the product page" />
            <TextField label="SEO title" value={d.seoTitle} onChange={(v) => set('seoTitle', v)} placeholder="Overrides the page title" />
            <div className="md:col-span-2">
              <TextField label="SEO description" value={d.seoDescription} onChange={(v) => set('seoDescription', v)} hint="Meta description for search engines" />
            </div>
          </div>

          <div className="md:col-span-2">
            <SwitchField label="Featured product" checked={d.featured} onChange={(v) => set('featured', v)} hint="Highlighted on the homepage" />
          </div>
        </div>

        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="btn-outline !py-2.5 !px-5">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary !py-2.5 !px-5 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save product'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
