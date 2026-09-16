import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

// /company merged into /about (single Company Profile page) — kept as a
// permanent redirect so old links and search results keep working.
export default function CompanyPage() {
  redirect('/about')
}
