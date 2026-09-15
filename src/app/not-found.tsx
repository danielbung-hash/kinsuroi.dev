import Link from 'next/link'
import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function NotFound() {
  const initial = await getBootstrapData()
  return (
    <SiteShell initial={initial}>
      <main className="bg-white pt-40 pb-40 text-center px-6">
        <p className="kicker mb-4">404</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-6">Halaman tidak ditemukan</h1>
        <p className="text-muted-foreground font-light max-w-md mx-auto mb-10">
          Halaman yang kamu cari tidak tersedia atau sudah dipindahkan.
        </p>
        <Link href="/" className="btn-primary">
          KEMBALI KE BERANDA
        </Link>
      </main>
    </SiteShell>
  )
}
