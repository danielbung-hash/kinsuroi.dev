'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { Lock, LogOut, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from '@/hooks/use-toast'
import { useKinsuroi } from './store'
import { Wordmark } from './Navbar'
import { TextField, AreaField } from './admin/fields'
import { ProductEditor } from './admin/ProductEditor'
import { ArticleEditor } from './admin/ArticleEditor'
import type { Article, Category, Product, SiteSettings } from '@/lib/types'

/* ─────────────────────────── LOGIN ─────────────────────────── */

function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      onSuccess()
      toast({ title: 'Welcome back, Admin' })
    } catch (err) {
      toast({ title: 'Login failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="min-h-screen bg-sand flex items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm bg-white border border-line p-10 text-center">
        <Wordmark className="text-lg block mb-2" />
        <p className="kicker mb-8">Content Management</p>
        <div className="mb-5 text-left">
          <label htmlFor="admin-password" className="text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
            Admin password
          </label>
          <div className="relative mt-2">
            <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-input bg-white pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
            />
          </div>
        </div>
        <button type="submit" disabled={busy} className="btn-primary w-full disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="mt-6 text-[11px] text-muted-foreground/70 leading-relaxed">
          Default password: <code className="bg-sand px-1.5 py-0.5">kinsuroi-admin</code>
          <br />
          Change it in Admin settings after first login.
        </p>
      </form>
    </main>
  )
}

/* ──────────────────────── PRODUCT TAB ──────────────────────── */

function ProductsTab() {
  const { products, categories, refresh } = useKinsuroi()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<Product | null>(null)

  const catName = (id?: string | null) => categories.find((c) => c.id === id)?.name ?? '—'

  const remove = async () => {
    if (!deleting) return
    try {
      const res = await fetch(`/api/products/${deleting.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast({ title: 'Product deleted' })
      refresh()
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : '', variant: 'destructive' })
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Products <span className="text-muted-foreground text-base">({products.length})</span></h2>
        <button
          onClick={() => { setEditing(null); setEditorOpen(true) }}
          className="btn-primary !py-2.5 !px-5"
        >
          <Plus size={14} /> New product
        </button>
      </div>

      <div className="border border-line bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[720px]">
          <thead>
            <tr className="border-b border-line text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Featured</th>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-line last:border-0 hover:bg-cream/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-12 bg-sand shrink-0 overflow-hidden">
                      {p.image && <Image src={p.image} alt="" fill sizes="40px" className="object-cover" />}
                    </div>
                    <div>
                      <p className="text-ink">{p.name}</p>
                      <p className="text-xs text-muted-foreground">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{catName(p.categoryId)}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.status === 'published' ? 'default' : 'secondary'} className={p.status === 'published' ? 'bg-ink text-white' : ''}>
                    {p.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{p.featured ? 'Yes' : '—'}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.order}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditing(p); setEditorOpen(true) }} className="p-2 hover:bg-sand transition-colors" aria-label={`Edit ${p.name}`}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleting(p)} className="p-2 hover:bg-sand text-muted-foreground hover:text-destructive transition-colors" aria-label={`Delete ${p.name}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductEditor
        open={editorOpen}
        onOpenChange={setEditorOpen}
        product={editing}
        categories={categories}
        onSaved={refresh}
      />

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete product?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.name}&rdquo; will be permanently removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/* ────────────────────── CATEGORIES TAB ────────────────────── */

function CategoriesTab() {
  const { categories, refresh } = useKinsuroi()
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editDesc, setEditDesc] = useState('')
  const [deleting, setDeleting] = useState<Category | null>(null)

  const create = async () => {
    if (!name.trim()) return
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description: desc }),
      })
      if (!res.ok) throw new Error('Create failed')
      setName('')
      setDesc('')
      toast({ title: 'Category created' })
      refresh()
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : '', variant: 'destructive' })
    }
  }

  const saveEdit = async (id: string) => {
    try {
      const res = await fetch(`/api/categories?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, description: editDesc }),
      })
      if (!res.ok) throw new Error('Update failed')
      setEditingId(null)
      toast({ title: 'Category updated' })
      refresh()
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : '', variant: 'destructive' })
    }
  }

  const remove = async () => {
    if (!deleting) return
    try {
      const res = await fetch(`/api/categories?id=${deleting.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast({ title: 'Category deleted' })
      refresh()
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : '', variant: 'destructive' })
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl mb-6">Categories</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 items-end">
        <TextField label="New category name" value={name} onChange={setName} placeholder="e.g. Hair Care" />
        <TextField label="Description (optional)" value={desc} onChange={setDesc} placeholder="Short line shown on the products page" />
        <button onClick={create} className="btn-primary !py-2.5 !px-5 justify-self-start">
          <Plus size={14} /> Add category
        </button>
      </div>

      <div className="border border-line bg-white divide-y divide-line">
        {categories.map((c) => (
          <div key={c.id} className="px-4 py-4 flex flex-col md:flex-row md:items-center gap-3">
            {editingId === c.id ? (
              <>
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                  <TextField label="Name" value={editName} onChange={setEditName} />
                  <TextField label="Description" value={editDesc} onChange={setEditDesc} />
                </div>
                <div className="flex gap-2 md:justify-end">
                  <button onClick={() => saveEdit(c.id)} className="btn-primary !py-2 !px-4">Save</button>
                  <button onClick={() => setEditingId(null)} className="btn-outline !py-2 !px-4">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-ink">{c.name} <span className="text-xs text-muted-foreground">/{c.slug}</span></p>
                  {c.description && <p className="text-xs text-muted-foreground mt-0.5">{c.description}</p>}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditingId(c.id); setEditName(c.name); setEditDesc(c.description || '') }} className="p-2 hover:bg-sand transition-colors" aria-label={`Edit ${c.name}`}>
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleting(c)} className="p-2 hover:bg-sand text-muted-foreground hover:text-destructive transition-colors" aria-label={`Delete ${c.name}`}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.name}&rdquo; will be removed. Products in it will become uncategorised.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/* ─────────────────────── JOURNAL TAB ─────────────────────── */

function JournalTab() {
  const { articles, refresh } = useKinsuroi()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editing, setEditing] = useState<Article | null>(null)
  const [deleting, setDeleting] = useState<Article | null>(null)

  const remove = async () => {
    if (!deleting) return
    try {
      const res = await fetch(`/api/articles/${deleting.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      toast({ title: 'Story deleted' })
      refresh()
    } catch (e) {
      toast({ title: 'Error', description: e instanceof Error ? e.message : '', variant: 'destructive' })
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Journal <span className="text-muted-foreground text-base">({articles.length})</span></h2>
        <button onClick={() => { setEditing(null); setEditorOpen(true) }} className="btn-primary !py-2.5 !px-5">
          <Plus size={14} /> New story
        </button>
      </div>

      <div className="border border-line bg-white overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr className="border-b border-line text-left text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              <th className="px-4 py-3 font-medium">Story</th>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-line last:border-0 hover:bg-cream/60 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-14 h-10 bg-sand shrink-0 overflow-hidden">
                      {a.thumbnail && <Image src={a.thumbnail} alt="" fill sizes="56px" className="object-cover" />}
                    </div>
                    <div>
                      <p className="text-ink">{a.title}</p>
                      <p className="text-xs text-muted-foreground">/{a.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{a.topic || '—'}</td>
                <td className="px-4 py-3">
                  <Badge variant={a.status === 'published' ? 'default' : 'secondary'} className={a.status === 'published' ? 'bg-ink text-white' : ''}>
                    {a.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => { setEditing(a); setEditorOpen(true) }} className="p-2 hover:bg-sand transition-colors" aria-label={`Edit ${a.title}`}>
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleting(a)} className="p-2 hover:bg-sand text-muted-foreground hover:text-destructive transition-colors" aria-label={`Delete ${a.title}`}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ArticleEditor open={editorOpen} onOpenChange={setEditorOpen} article={editing} onSaved={refresh} />

      <AlertDialog open={!!deleting} onOpenChange={(v) => !v && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete story?</AlertDialogTitle>
            <AlertDialogDescription>&ldquo;{deleting?.title}&rdquo; will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-destructive text-white hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

/* ─────────────────── WEBSITE CONTENT TAB ─────────────────── */

const SETTING_FIELDS: { key: string; label: string; area?: boolean; hint?: string }[] = [
  { key: 'hero_title', label: 'Hero title' },
  { key: 'hero_subtitle', label: 'Hero subtitle' },
  { key: 'hero_cta_text', label: 'Hero primary CTA text' },
  { key: 'hero_cta_url', label: 'Hero primary CTA URL' },
  { key: 'hero_cta2_text', label: 'Hero secondary CTA text' },
  { key: 'hero_cta2_url', label: 'Hero secondary CTA URL' },
  { key: 'hero_image', label: 'Hero image URL', hint: '/images/hero.jpg or /uploads/…' },
  { key: 'brand_title', label: 'Brand section title' },
  { key: 'brand_description', label: 'Brand description', area: true, hint: 'Blank line = new paragraph' },
  { key: 'brand_image', label: 'Brand image URL' },
  { key: 'cta_title', label: 'CTA banner title' },
  { key: 'cta_text', label: 'CTA banner text' },
  { key: 'cta_button_text', label: 'CTA button text' },
  { key: 'cta_button_url', label: 'CTA button URL' },
  { key: 'footer_text', label: 'Footer tagline' },
  { key: 'footer_copyright', label: 'Copyright line' },
]

function WebsiteTab({ settings, onSave }: { settings: SiteSettings; onSave: (patch: SiteSettings) => Promise<void> }) {
  const [draft, setDraft] = useState<SiteSettings>(settings)
  const [saving, setSaving] = useState(false)
  const dirty = useMemo(() => SETTING_FIELDS.some((f) => (draft[f.key] ?? '') !== (settings[f.key] ?? '')), [draft, settings])

  const save = async () => {
    setSaving(true)
    const patch: SiteSettings = {}
    for (const f of SETTING_FIELDS) patch[f.key] = draft[f.key] ?? ''
    await onSave(patch)
    setSaving(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl">Website content</h2>
        <button onClick={save} disabled={saving || !dirty} className="btn-primary !py-2.5 !px-5 disabled:opacity-40">
          <RefreshCw size={13} className={saving ? 'animate-spin' : ''} />
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-line p-6">
        {SETTING_FIELDS.map((f) =>
          f.area ? (
            <div key={f.key} className="md:col-span-2">
              <AreaField label={f.label} value={draft[f.key] ?? ''} onChange={(v) => setDraft((p) => ({ ...p, [f.key]: v }))} rows={4} hint={f.hint} />
            </div>
          ) : (
            <TextField key={f.key} label={f.label} value={draft[f.key] ?? ''} onChange={(v) => setDraft((p) => ({ ...p, [f.key]: v }))} hint={f.hint} />
          ),
        )}
      </div>
    </div>
  )
}

/* ─────────────── SOCIAL & CONTACT TAB ─────────────── */

const SOCIAL_FIELDS = [
  { key: 'social_shopee', label: 'Shopee URL' },
  { key: 'social_tiktok', label: 'TikTok URL' },
  { key: 'social_youtube', label: 'YouTube URL' },
  { key: 'social_instagram', label: 'Instagram URL' },
  { key: 'social_facebook', label: 'Facebook URL' },
]

const CONTACT_FIELDS = [
  { key: 'contact_address', label: 'Address', area: true },
  { key: 'contact_phone_1', label: 'Phone 1', area: false },
  { key: 'contact_phone_2', label: 'Phone 2', area: false },
  { key: 'contact_email', label: 'Email', area: false },
  { key: 'contact_whatsapp', label: 'WhatsApp CTA URL', area: false },
]

const ALL_SETTING_KEYS = [
  ...SOCIAL_FIELDS.map((f) => f.key),
  ...CONTACT_FIELDS.map((f) => f.key),
]

function SocialContactTab({ settings, onSave }: { settings: SiteSettings; onSave: (patch: SiteSettings) => Promise<void> }) {
  const [draft, setDraft] = useState<SiteSettings>(settings)
  const [saving, setSaving] = useState(false)
  const allKeys = ALL_SETTING_KEYS
  const dirty = useMemo(() => allKeys.some((k) => (draft[k] ?? '') !== (settings[k] ?? '')), [draft, settings, allKeys])

  const save = async () => {
    setSaving(true)
    const patch: SiteSettings = {}
    for (const k of allKeys) patch[k] = draft[k] ?? ''
    await onSave(patch)
    setSaving(false)
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl">Social media</h2>
          <button onClick={save} disabled={saving || !dirty} className="btn-primary !py-2.5 !px-5 disabled:opacity-40">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-line p-6">
          {SOCIAL_FIELDS.map((f) => (
            <TextField key={f.key} label={f.label} value={draft[f.key] ?? ''} onChange={(v) => setDraft((p) => ({ ...p, [f.key]: v }))} placeholder="https://…" />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">Channels left empty are hidden on the website until a URL is set.</p>
      </div>

      <div>
        <h2 className="font-display text-2xl mb-6">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white border border-line p-6">
          {CONTACT_FIELDS.map((f) =>
            f.area ? (
              <div key={f.key} className="md:col-span-2">
                <AreaField label={f.label} value={draft[f.key] ?? ''} onChange={(v) => setDraft((p) => ({ ...p, [f.key]: v }))} rows={3} />
              </div>
            ) : (
              <TextField key={f.key} label={f.label} value={draft[f.key] ?? ''} onChange={(v) => setDraft((p) => ({ ...p, [f.key]: v }))} />
            ),
          )}
        </div>
      </div>
    </div>
  )
}

/* ──────────────────────── ADMIN SHELL ──────────────────────── */

export function AdminView() {
  const { settings, refresh, products, articles, categories } = useKinsuroi()
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [globalSettings, setGlobalSettings] = useState<SiteSettings | null>(null)
  const [settingsVersion, setSettingsVersion] = useState(0)

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/login')
      setAuthed(res.ok)
    } catch {
      setAuthed(false)
    }
  }, [])

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) setGlobalSettings(await res.json())
      else setGlobalSettings({})
    } catch {
      setGlobalSettings({})
    }
  }, [])

  useEffect(() => {
    checkAuth()
    refresh()
  }, [checkAuth, refresh])

  useEffect(() => {
    if (authed) loadSettings()
  }, [authed, loadSettings])

  const saveSettings = useCallback(
    async (patch: SiteSettings) => {
      try {
        const res = await fetch('/api/settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(patch),
        })
        if (!res.ok) throw new Error('Save failed')
        const updated = await res.json()
        setGlobalSettings(updated)
        setSettingsVersion((v) => v + 1)
        toast({ title: 'Saved' })
        refresh()
      } catch (e) {
        toast({ title: 'Error', description: e instanceof Error ? e.message : '', variant: 'destructive' })
      }
    },
    [refresh],
  )

  const logout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    setAuthed(false)
  }

  if (authed === null) {
    return <main className="min-h-screen bg-sand flex items-center justify-center"><RefreshCw className="animate-spin text-muted-foreground" size={20} /></main>
  }

  if (!authed) return <LoginCard onSuccess={() => setAuthed(true)} />

  const stats = [
    { label: 'Products', value: products.length },
    { label: 'Categories', value: categories.length },
    { label: 'Stories', value: articles.length },
    { label: 'Published stories', value: articles.filter((a) => a.status === 'published').length },
  ]

  return (
    <main className="min-h-screen bg-cream pb-20">
      {/* Admin top bar */}
      <div className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Wordmark tone="light" className="text-sm" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-white/40">Admin CMS</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#/" className="text-xs text-white/60 hover:text-white transition-colors">View site</a>
            <button onClick={logout} className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors">
              <LogOut size={13} /> Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line mb-10">
          {stats.map((st) => (
            <div key={st.label} className="bg-white px-6 py-5">
              <p className="font-display text-3xl text-ink">{st.value}</p>
              <p className="kicker !text-[9px] mt-1">{st.label}</p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="products">
          <TabsList className="bg-white border border-line h-auto p-1 rounded-none flex-wrap">
            <TabsTrigger value="products" className="rounded-none data-[state=active]:bg-ink data-[state=active]:text-white text-xs tracking-wider">Products</TabsTrigger>
            <TabsTrigger value="categories" className="rounded-none data-[state=active]:bg-ink data-[state=active]:text-white text-xs tracking-wider">Categories</TabsTrigger>
            <TabsTrigger value="journal" className="rounded-none data-[state=active]:bg-ink data-[state=active]:text-white text-xs tracking-wider">Journal</TabsTrigger>
            <TabsTrigger value="website" className="rounded-none data-[state=active]:bg-ink data-[state=active]:text-white text-xs tracking-wider">Website</TabsTrigger>
            <TabsTrigger value="social" className="rounded-none data-[state=active]:bg-ink data-[state=active]:text-white text-xs tracking-wider">Social & Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-6"><ProductsTab /></TabsContent>
          <TabsContent value="categories" className="mt-6"><CategoriesTab /></TabsContent>
          <TabsContent value="journal" className="mt-6"><JournalTab /></TabsContent>
          {globalSettings !== null && (
            <>
              <TabsContent value="website" className="mt-6"><WebsiteTab key={`w${settingsVersion}`} settings={globalSettings} onSave={saveSettings} /></TabsContent>
              <TabsContent value="social" className="mt-6"><SocialContactTab key={`s${settingsVersion}`} settings={globalSettings} onSave={saveSettings} /></TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </main>
  )
}
