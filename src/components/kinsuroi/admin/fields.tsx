'use client'

import { useRef, useState } from 'react'
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

/** Image input with upload button + preview. Returns a public URL (/uploads/... or manual path). */
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

  const upload = async (file: File) => {
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      onChange(data.url)
      toast({ title: 'Image uploaded' })
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
          <Input value={value} placeholder="/uploads/… or /images/…" onChange={(e) => onChange(e.target.value)} className="bg-white" />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-2 text-xs border border-input bg-white px-3 py-2 hover:bg-sand transition-colors disabled:opacity-50"
            >
              <Upload size={13} />
              {busy ? 'Uploading…' : 'Upload image'}
            </button>
            {value && (
              <button type="button" onClick={() => onChange('')} className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                <X size={13} /> Clear
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
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
