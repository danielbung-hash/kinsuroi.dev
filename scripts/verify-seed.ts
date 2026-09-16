// Verify PDF-sourced data landed in the local DB after seeding.
import { db } from '../src/lib/db'
import { seedMissing } from '../src/lib/seed'

async function main() {
  const keys = [
    'contact_email',
    'contact_address',
    'social_instagram',
    'company_lab',
    'company_about',
  ]
  console.log('--- SETTINGS ---')
  for (const key of keys) {
    const row = await db.siteSetting.findUnique({ where: { key } })
    console.log(`${key}: ${(row?.value ?? '(missing)').slice(0, 80).replace(/\n/g, ' ⏎ ')}`)
  }

  console.log('--- PRODUCT BENEFITS (filled from PDF) ---')
  const rows = await db.product.findMany({
    where: { benefits: { not: '' } },
    orderBy: { order: 'asc' },
    select: { slug: true, benefits: true },
  })
  for (const r of rows) console.log(`${r.slug}: ${r.benefits?.slice(0, 60)}`)
  if (rows.length === 0) console.log('(none)')

  console.log('--- REPAIR MODE (should report 0 new) ---')
  const report = await seedMissing(db)
  console.log(JSON.stringify(report))

  await db.$disconnect()
}

main()
