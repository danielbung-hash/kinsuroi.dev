/**
 * KINSUROI — v3 data migration (safe, additive, no product data lost)
 * Run: bun scripts/migrate-v3.ts
 *
 * 1. Categories restructured to 3 main groups: Face Care / Lip Care / Body Care
 *    (Serum products join Face Care; the old "Serum" category is removed)
 * 2. Display order set to the owner's catalog numbering 1–12; new Lip Care
 *    product slot #7 created with a neutral placeholder (photo not final yet)
 * 3. Official WhatsApp number stored for the BUY CTA
 * 4. Company page content slots created (empty — filled via CMS, nothing invented)
 * 5. admin_password removed from the database — credential now lives only in
 *    the server-side ADMIN_PASSWORD environment variable
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  console.log('KINSUROI v3 migration…')

  /* 1 ── Categories: 3 main groups ─────────────────────────────── */
  const cats = [
    { name: 'Face Care', slug: 'face-care', description: 'Pembersih, krim, dan perawatan wajah tertarget.', order: 1 },
    { name: 'Lip Care', slug: 'lip-care', description: 'Perawatan harian untuk bibir yang lembut.', order: 2 },
    { name: 'Body Care', slug: 'body-care', description: 'Ritual mandi, minyak, dan lotion untuk tubuh.', order: 3 },
  ]
  for (const c of cats) {
    await db.category.upsert({ where: { slug: c.slug }, update: { name: c.name, description: c.description, order: c.order }, create: c })
  }
  const face = await db.category.findUnique({ where: { slug: 'face-care' } })
  const lip = await db.category.findUnique({ where: { slug: 'lip-care' } })
  const body = await db.category.findUnique({ where: { slug: 'body-care' } })

  // Move former Serum products into Face Care, then drop the Serum category
  await db.product.updateMany({ where: { categoryId: (await db.category.findUnique({ where: { slug: 'serum' } }))?.id }, data: { categoryId: face!.id } })
  await db.category.deleteMany({ where: { slug: 'serum' } })

  /* 2 ── Product order (owner catalog numbering 1–12) ──────────── */
  // New Lip Care slot #7 — photo not final, neutral placeholder, editable via CMS
  const pending = await db.product.upsert({
    where: { slug: 'kinsuroi-lip-segera-hadir' },
    update: { categoryId: lip!.id, order: 7, status: 'published' },
    create: {
      name: 'Segera Hadir',
      slug: 'kinsuroi-lip-segera-hadir',
      categoryId: lip!.id,
      shortDesc: 'Produk Lip Care terbaru KINSUROI',
      image: '/images/products/kinsuroi-placeholder.jpg',
      status: 'published',
      order: 7,
      seoTitle: 'Lip Care Terbaru dari KINSUROI — Segera Hadir',
    },
  })

  const orderMap: Record<string, number> = {
    'kinsuroi-soft-cleanser-gel': 1,
    'kinsuroi-herbal-cleanser-gel': 2,
    'kinsuroi-l-active-c': 3,
    'kinsuroi-retinol-serum': 4,
    'kinsuroi-lipbalm': 5,
    'kinsuroi-lipbalm-coral': 6,
    [pending.slug]: 7,
    'kinsuroi-shower-oel': 8,
    'kinsuroi-body-lotion-retinol': 9,
    'kinsuroi-body-oel': 10,
    'kinsuroi-barrier-light-cream': 11,
    'kinsuroi-acne-gel': 12,
  }
  const catMap: Record<string, string> = {
    'kinsuroi-soft-cleanser-gel': face!.id,
    'kinsuroi-herbal-cleanser-gel': face!.id,
    'kinsuroi-l-active-c': face!.id,
    'kinsuroi-retinol-serum': face!.id,
    'kinsuroi-lipbalm': lip!.id,
    'kinsuroi-lipbalm-coral': lip!.id,
    [pending.slug]: lip!.id,
    'kinsuroi-shower-oel': body!.id,
    'kinsuroi-body-lotion-retinol': body!.id,
    'kinsuroi-body-oel': body!.id,
    'kinsuroi-barrier-light-cream': face!.id,
    'kinsuroi-acne-gel': face!.id,
  }
  for (const [slug, order] of Object.entries(orderMap)) {
    const p = await db.product.findUnique({ where: { slug } })
    if (!p) continue // never fail on a product the owner may have renamed
    await db.product.update({ where: { slug }, data: { order, categoryId: catMap[slug] } })
  }

  /* 3 ── Official WhatsApp number for BUY CTA ──────────────────── */
  await db.siteSetting.upsert({
    where: { key: 'contact_whatsapp' },
    update: { value: '085888244750' },
    create: { key: 'contact_whatsapp', value: '085888244750', group: 'contact' },
  })

  /* 4 ── Company page content slots (empty — CMS fills these) ──── */
  const companySettings = [
    { key: 'company_about', group: 'company' },
    { key: 'company_vision', group: 'company' },
    { key: 'company_mission', group: 'company' },
    { key: 'company_values', group: 'company' },
    { key: 'company_quality', group: 'company' },
  ]
  for (const s of companySettings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: { group: s.group }, create: { ...s, value: '' } })
  }

  /* 5 ── Remove the credential from the database ───────────────── */
  await db.siteSetting.deleteMany({ where: { key: 'admin_password' } })

  const count = await db.product.count()
  console.log(`✓ categories: Face Care / Lip Care / Body Care (Serum merged)`)
  console.log(`✓ ${count} products ordered 1–12 (slot #7 → ${pending.slug})`)
  console.log(`✓ WhatsApp CTA 085888244750 · company slots created · admin_password removed from DB`)
  console.log('Migration complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
