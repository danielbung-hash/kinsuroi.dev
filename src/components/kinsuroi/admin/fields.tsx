'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/hooks/use-toast'

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ''}`}>
      <Label className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
    </div>
  )
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  type?: string
}) {
  return (
    <Field label={label} hint={hint}>
      <Input value={value} type={type} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="bg-white" />
    </Field>
  )
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  hint?: string
}) {
  return (
    <Field label={label} hint={hint}>
      <Textarea value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="bg-white" />
    </Field>
  )
}

/* ── Character counter / soft limit (requirement: warn, never block) ── */

export function CharCounter({ value, max }: { value: string; max: number }) {
  const len = value.length
  const over = len > max
  return (
    <p className={`text-[11px] mt-1 ${over ? 'text-amber-600' : 'text-muted-foreground/70'}`} aria-live="polite">
      {len} / {max} characters
      {over && <span className="block">Content is longer than recommended.</span>}
    </p>
  )
}

/** AreaField with a recommended character limit — warning only, saving is still allowed */
export function CounterAreaField({
  label,
  value,
  onChange,
  rows = 4,
  placeholder,
  hint,
  max,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  hint?: string
  max: number
}) {
  return (
    <Field label={label} hint={hint}>
      <Textarea value={value} rows={rows} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="bg-white" />
      <CharCounter value={value} max={max} />
    </Field>
  )
}

/** TextField with a recommended character limit — warning only, saving is still allowed */
export function CounterTextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = 'text',
  max,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  hint?: string
  type?: string
  max: number
}) {
  return (
    <Field label={label} hint={hint}>
      <Input value={value} type={type} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className="bg-white" />
      <CharCounter value={value} max={max} />
    </Field>
  )
}

export function SwitchField({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-input bg-white px-4 py-3">
      <div>
        <p className="text-sm">{label}</p>
        {hint && <p className="text-[11px] text-muted-foreground/70">{hint}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

/* ── Client-side image compression ───────────────────────────
 * Vercel serverless functions reject request bodies over ~4.5 MB, and
 * phone photos are routinely 3–8 MB. Oversized images are therefore
 * downscaled (max 2000 px) and re-encoded in the browser before upload:
 * WebP (alpha preserved) for PNG/WebP sources, JPEG otherwise.
 * Failures are non-fatal — the original file is used as fallback.
 */
const COMPRESS_OVER = 1.2 * 1024 * 1024 // only bother above 1.2 MB

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  if (file.size <= COMPRESS_OVER) return file
  try {
    const bitmap = await createImageBitmap(file)
    const maxSide = 2000
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
    const w = Math.max(1, Math.round(bitmap.width * scale))
    const h = Math.max(1, Math.round(bitmap.height * scale))
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      bitmap.close()
      return file
    }
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close()

    const keepAlpha = file.type === 'image/png' || file.type === 'image/webp'
    const outType = keepAlpha && typeof canvas.toBlob === 'function' ? 'image/webp' : 'image/jpeg'
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, outType, 0.85))
    if (!blob || blob.size >= file.size) return file
    const ext = outType === 'image/webp' ? 'webp' : 'jpg'
    const name = `${file.name.replace(/\.[^.]+$/, '')}-compressed.${ext}`
    return new File([blob], name, { type: outType })
  } catch {
    return file
  }
}

/** Image input with upload button + preview. Returns a public URL (Supabase Storage or /uploads/...). */
export function ImageField({
  label,
  value,
  onChange,
  aspect = 'aspect-[4/5]',
  hint,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  aspect?: string
  hint?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [storage, setStorage] = useState<'supabase' | 'local' | ''>('')

  useEffect(() => {
    fetch('/api/upload')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setStorage(d.storage))
      .catch(() => {})
  }, [])

  const upload = async (raw: File) => {
    // Client-side pre-validation (server validates again — same rules)
    if (!raw.type.startsWith('image/')) {
      toast({ title: 'Upload failed', description: 'Hanya file gambar (JPG, PNG, WebP, AVIF) yang diizinkan.', variant: 'destructive' })
      return
    }
    setBusy(true)
    try {
      // Photos above ~1.2 MB are downscaled/re-encoded in the browser first,
      // so phone photos pass the serverless 4.5 MB body limit comfortably.
      const file = await compressImage(raw)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Ukuran file tetap melebihi 5 MB setelah kompresi otomatis. Coba gambar yang lebih kecil.')
      }
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
      setStorage(data.storage)
      toast({ title: 'Image uploaded', description: data.storage === 'supabase' ? 'Saved to Supabase Storage (product-images).' : 'Saved to local uploads.' })
    } catch (e) {
      toast({ title: 'Upload failed', description: e instanceof Error ? e.message : 'Unknown error', variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Field label={label} hint={hint}>
      <div className="flex gap-4 items-start">
        <div className={`relative ${aspect} w-24 shrink-0 bg-sand overflow-hidden rounded-sm border border-line`}>
          {value ? (
            <Image src={value} alt="preview" fill sizes="96px" className="object-cover" />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-muted-foreground">No image</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <Input value={value} placeholder="/uploads/…, /images/… or https://…supabase.co/…" onChange={(e) => onChange(e.target.value)} className="bg-white" />
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 text-xs border border-input bg-white px-3 py-2 hover:bg-sand transition-colors disabled:opacity-50"
            >
              <Upload size={13} />
              {value ? 'Replace image' : 'Upload image'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                <X size={13} /> Remove
              </button>
            )}
            {storage && (
              <span className="text-[10px] tracking-wider uppercase text-muted-foreground/60">
                Storage: {storage === 'supabase' ? 'Supabase (product-images)' : 'Local (preview)'}
              </span>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) upload(f)
              e.target.value = ''
            }}
          />
        </div>
      </div>
    </Field>
  )
}
