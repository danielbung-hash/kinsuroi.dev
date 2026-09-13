// Elegant brand-consistent loading state between route transitions
export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center" role="status" aria-label="Memuat halaman">
      <div className="text-center">
        <p className="font-display font-medium tracking-[0.35em] uppercase text-ink text-lg animate-pulse">KINSUROI</p>
        <p className="kicker mt-3">Memuat…</p>
      </div>
    </div>
  )
}
