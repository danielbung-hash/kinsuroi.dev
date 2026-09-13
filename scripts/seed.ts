/**
 * KINSUROI — Database seed
 * Run: bun scripts/seed.ts
 *
 * NOTE: Product claims (benefits, ingredients, how-to-use, suitable-for, FAQ)
 * are intentionally left EMPTY — the admin fills them via the CMS.
 * Short descriptions are derived from the product name only.
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const categories = [
  { name: 'Face Care', slug: 'face-care', description: 'Cleansers, creams and targeted treatments for the face.', order: 1 },
  { name: 'Serum', slug: 'serum', description: 'Concentrated facial serums.', order: 2 },
  { name: 'Lip Care', slug: 'lip-care', description: 'Balms and care for the lips.', order: 3 },
  { name: 'Body Care', slug: 'body-care', description: 'Shower, oil and lotion rituals for the body.', order: 4 },
]

type SeedProduct = {
  name: string
  slug: string
  category: string
  shortDesc: string
  featured?: boolean
  order: number
}

const products: SeedProduct[] = [
  { name: 'KINSUROI Soft Cleanser Gel', slug: 'kinsuroi-soft-cleanser-gel', category: 'face-care', shortDesc: 'Gentle cleansing gel', featured: true, order: 1 },
  { name: 'KINSUROI Herbal Cleanser Gel', slug: 'kinsuroi-herbal-cleanser-gel', category: 'face-care', shortDesc: 'Herbal cleansing gel', featured: true, order: 2 },
  { name: 'KINSUROI L Active C+', slug: 'kinsuroi-l-active-c', category: 'serum', shortDesc: 'Active vitamin C serum', featured: true, order: 3 },
  { name: 'KINSUROI Retinol Serum+', slug: 'kinsuroi-retinol-serum', category: 'serum', shortDesc: 'Retinol facial serum', featured: true, order: 4 },
  { name: 'KINSUROI LipBalm', slug: 'kinsuroi-lipbalm', category: 'lip-care', shortDesc: 'Nourishing lip balm', order: 5 },
  { name: 'KINSUROI LipBalm Coral', slug: 'kinsuroi-lipbalm-coral', category: 'lip-care', shortDesc: 'Lip balm in Coral', order: 6 },
  { name: 'KINSUROI Shower Oel', slug: 'kinsuroi-shower-oel', category: 'body-care', shortDesc: 'Shower gel', order: 7 },
  { name: 'KINSUROI Body Lotion Retinol', slug: 'kinsuroi-body-lotion-retinol', category: 'body-care', shortDesc: 'Retinol body lotion', order: 8 },
  { name: 'KINSUROI Body Oel', slug: 'kinsuroi-body-oel', category: 'body-care', shortDesc: 'Body oil', order: 9 },
  { name: 'KINSUROI Barrier Light Cream', slug: 'kinsuroi-barrier-light-cream', category: 'face-care', shortDesc: 'Lightweight barrier cream', order: 10 },
  { name: 'KINSUROI Acne Gel', slug: 'kinsuroi-acne-gel', category: 'face-care', shortDesc: 'Targeted acne gel', order: 11 },
]

const articles = [
  {
    title: 'Building a Simple Skincare Routine',
    slug: 'building-a-simple-skincare-routine',
    topic: 'Routine',
    excerpt: 'A good routine does not need to be complicated. Learn the essential steps of a simple, consistent daily ritual.',
    thumbnail: '/images/journal-1.jpg',
    content: `A skincare routine does not need ten steps to be effective. In fact, the most sustainable routines are often the simplest ones — a few well-chosen products, used consistently, morning and evening.

Start with cleansing. A clean canvas helps every product that follows work as intended. Choose a gentle cleanser that respects your skin, and use lukewarm water rather than something too hot.

After cleansing, consider a serum if your skin needs targeted attention. Serums are designed to deliver concentrated ingredients, so a little goes a long way. Allow it to absorb for a moment before moving on.

Next, seal everything in with a moisturiser. Even lightweight creams help support the skin barrier and keep water from evaporating through the day.

Finally — and this is the step people skip most often — protect your skin from the sun every morning. It is the single most valuable habit in any routine.

Consistency beats intensity. A simple ritual you follow every day will always outperform an elaborate one you follow once a week. Start small, stay gentle, and let your skin tell you what it needs.`,
    seoTitle: 'Building a Simple Skincare Routine | KINSUROI Journal',
    seoDescription: 'Learn how to build a simple, consistent skincare routine — cleansing, serum, moisturiser and daily protection.',
  },
  {
    title: 'Layering Skincare: The Right Order',
    slug: 'layering-skincare-the-right-order',
    topic: 'Education',
    excerpt: 'Thin to thick, water to oil. Understanding layering order helps every product in your ritual do its best work.',
    thumbnail: '/images/journal-2.jpg',
    content: `If you use more than one skincare product, order matters. A simple rule guides almost everything: apply from the thinnest, most watery texture to the thickest, most occlusive one.

Begin with your cleanser to clear the way. Then, if you use a toner or essence, apply it while the skin is still slightly damp — it helps prepare the skin for what comes next.

Serums come next. Water-based serums go before oil-based ones. If you use more than one serum, let each one settle for thirty seconds to a minute before applying the next.

Creams and moisturisers follow. Their richer texture forms a seal that locks in the layers beneath. If you use a facial oil, it almost always goes last, on top of your cream.

At night, the same order applies. In the morning, always finish with sun protection as the final step before makeup — never underneath it.

One more note on active ingredients: if you are introducing something new, do it gradually and avoid layering multiple strong actives on the same night. Your skin will thank you for the patience.`,
    seoTitle: 'Layering Skincare: The Right Order | KINSUROI Journal',
    seoDescription: 'A practical guide to layering skincare products in the right order — from cleanser to sun protection.',
  },
  {
    title: 'The Ritual of Body Care',
    slug: 'the-ritual-of-body-care',
    topic: 'Lifestyle',
    excerpt: 'Body care is more than maintenance — it is a daily pause. Turn an ordinary shower into a quiet, restorative ritual.',
    thumbnail: '/images/journal-3.jpg',
    content: `We often treat body care as an afterthought — something rushed between the end of a shower and the start of the day. But the few minutes we spend caring for our body can become one of the calmest moments of a daily routine.

Begin in the shower. Lukewarm water and a gentle body cleanser are all the skin needs. There is no need for water that is too hot; warmth should feel comforting, never stripping.

While the skin is still slightly damp after showering, apply a body lotion or oil. This small window of time is when moisture is best held against the skin. Take a moment to massage it in slowly — shoulders, arms, hands.

Small details matter more than quantity. A balm for the lips. A cream for the hands before bed. These tiny rituals, repeated daily, quietly become acts of self-respect.

Body care, at its best, is not a chore. It is a pause — a few quiet minutes that belong entirely to you.`,
    seoTitle: 'The Ritual of Body Care | KINSUROI Journal',
    seoDescription: 'Turn everyday body care into a quiet ritual — gentle cleansing, mindful moisturising, and small daily habits.',
  },
]

const settings: { key: string; value: string; group: string }[] = [
  // Hero
  { key: 'hero_title', value: 'YOUR BEAUTY, YOUR RITUAL.', group: 'hero' },
  { key: 'hero_subtitle', value: 'Discover a simple and elegant beauty ritual with KINSUROI.', group: 'hero' },
  { key: 'hero_cta_text', value: 'SHOP PRODUCTS', group: 'hero' },
  { key: 'hero_cta_url', value: '#/products', group: 'hero' },
  { key: 'hero_cta2_text', value: 'EXPLORE KINSUROI', group: 'hero' },
  { key: 'hero_cta2_url', value: '#/about', group: 'hero' },
  { key: 'hero_image', value: '/images/hero.jpg', group: 'hero' },
  // Brand
  { key: 'brand_title', value: 'Beauty, Simplified.', group: 'brand' },
  {
    key: 'brand_description',
    value:
      'KINSUROI is a beauty brand built on one quiet idea: that caring for yourself should feel simple, elegant and honest. We create essential skincare and body care — cleansers, serums, creams and daily rituals — thoughtfully formulated and beautifully understated.\n\nNo noise. No excess. Just the products you need, in a form you will love to use every day.',
    group: 'brand',
  },
  { key: 'brand_image', value: '/images/brand.jpg', group: 'brand' },
  // Mid-page CTA
  { key: 'cta_title', value: 'DISCOVER YOUR BEAUTY ROUTINE', group: 'cta' },
  { key: 'cta_text', value: 'Explore the KINSUROI collection and find the ritual that suits you.', group: 'cta' },
  { key: 'cta_button_text', value: 'SHOP NOW', group: 'cta' },
  { key: 'cta_button_url', value: '#/products', group: 'cta' },
  // Footer
  { key: 'footer_text', value: 'Clean. Quiet. Elegant. Trustworthy.', group: 'footer' },
  { key: 'footer_copyright', value: '© KINSUROI. All rights reserved.', group: 'footer' },
  // Contact
  {
    key: 'contact_address',
    value:
      'Komp. Sentra Niaga Surya Kadu Blok F No.9, Kadujaya RT 001/001, Kec. Curug, Jl. Raya Telesonik No.10, Kota Tangerang, Banten 15810, Indonesia',
    group: 'contact',
  },
  { key: 'contact_phone_1', value: '+62 21 29437988', group: 'contact' },
  { key: 'contact_phone_2', value: '+62 21 29437987', group: 'contact' },
  { key: 'contact_email', value: '', group: 'contact' },
  { key: 'contact_whatsapp', value: '', group: 'contact' },
  // Social media (official channels — editable via CMS)
  { key: 'social_shopee', value: '', group: 'social' },
  { key: 'social_tiktok', value: '', group: 'social' },
  { key: 'social_youtube', value: '', group: 'social' },
  { key: 'social_instagram', value: '', group: 'social' },
  { key: 'social_facebook', value: '', group: 'social' },
  // Admin
  { key: 'admin_password', value: 'kinsuroi-admin', group: 'admin' },
]

async function main() {
  console.log('Seeding KINSUROI database…')

  // Categories
  for (const c of categories) {
    await db.category.upsert({ where: { slug: c.slug }, update: c, create: c })
  }
  console.log(`✓ ${categories.length} categories`)

  // Products (claims intentionally empty — CMS-ready)
  for (const p of products) {
    const cat = await db.category.findUnique({ where: { slug: p.category } })
    const data = {
      name: p.name,
      slug: p.slug,
      categoryId: cat?.id ?? null,
      shortDesc: p.shortDesc,
      image: `/images/products/${p.slug}.jpg`,
      status: 'published',
      featured: p.featured ?? false,
      order: p.order,
      seoTitle: `${p.name} | KINSUROI`,
    }
    await db.product.upsert({ where: { slug: p.slug }, update: data, create: data })
  }
  console.log(`✓ ${products.length} products`)

  // Articles
  for (const a of articles) {
    const data = { ...a, author: 'KINSUROI Editorial', status: 'published', publishedAt: new Date() }
    await db.article.upsert({ where: { slug: a.slug }, update: data, create: data })
  }
  console.log(`✓ ${articles.length} articles`)

  // Settings
  for (const s of settings) {
    await db.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value, group: s.group }, create: s })
  }
  console.log(`✓ ${settings.length} site settings`)

  console.log('Seed complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
