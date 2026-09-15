import { SiteShell } from '@/components/kinsuroi/SiteShell'
import { HomeView } from '@/components/kinsuroi/views/HomeView'
import { getBootstrapData } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const initial = await getBootstrapData()
  return (
    <SiteShell initial={initial}>
      <HomeView />
    </SiteShell>
  )
}
