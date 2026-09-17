'use client'

import { useEffect, useState } from 'react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { Field, TextField, AreaField, ImageField } from './fields'
import type { Testimonial } from '@/lib/types'

type Draft = {
  image: string
  name: string
  caption: string
  source: string
  status: string
  order: number
}

function toDraft(t?: Testimonial | null): Draft {
  return {
    image: t?.image ?? '',
    name: t?.name ?? '',
    caption: t?.caption ?? '',
    source: t?.source ?? '',
    status: t?.status ?? 'published',
    order: t?.order ?? 99,
  }
}

export function TestimonialEditor({
  open,
  onOpenChange,
  testimonial,
  onSaved,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  testimonial?: Testimonial | null
  onSaved: () => void
}) {
  const [d, setD] = useState<Draft>(toDraft(testimonial))
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setD(toDraft(testimonial))
  }, [testimonial, open])

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((prev) => ({ ...prev, [k]: v }))

  const save = async () => {
    if (!d.image.trim()) {
      toast({ title: 'Foto testimoni wajib diunggah', variant: 'destructive' })
      return
    }
    setSaving(true)
    try {
      const res = await fetch(testimonial ? `/api/testimonials/${testimonial.id}` : '/api/testimonials', {
        method: testimonial ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(d),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast({ title: testimonial ? 'Testimoni diperbarui' : 'Testimoni ditambahkan' })
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto thin-scroll bg-cream">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{testimonial ? 'Edit testimoni' : 'Testimoni baru'}</DialogTitle>
          <DialogDescription>
            Unggah foto testimoni (screenshot chat/review atau foto pelanggan). Nama, keterangan, dan sumber bersifat opsional — yang ditampilkan di beranda hanya foto dan isian yang diisi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2">
          <ImageField
            label="Foto testimoni"
            value={d.image}
            onChange={(v) => set('image', v)}
            aspect="aspect-[4/5]"
            hint="Disarankan potret/vertikal (rasio 4:5) agar rapi di beranda."
          />
          <TextField label="Nama pelanggan (opsional)" value={d.name} onChange={(v) => set('name', v)} placeholder="mis. Sarah M." />
          <AreaField label="Keterangan / kutipan (opsional)" value={d.caption} onChange={(v) => set('caption', v)} rows={3} placeholder="Kutipan singkat dari ulangannya…" />
          <TextField label="Sumber (opsional)" value={d.source} onChange={(v) => set('source', v)} placeholder="WhatsApp / Instagram / Shopee" />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Status">
              <Select value={d.status} onValueChange={(v) => set('status', v)}>
                <SelectTrigger className="bg-white w-full"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <TextField label="Urutan" value={String(d.order)} onChange={(v) => set('order', parseInt(v) || 99)} type="number" hint="Posisi tampil (angka kecil = lebih dulu)" />
          </div>
        </div>

        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="btn-outline !py-2.5 !px-5">Cancel</button>
          <button onClick={save} disabled={saving} className="btn-primary !py-2.5 !px-5 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save testimoni'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
