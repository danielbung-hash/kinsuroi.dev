/**
 * KINSUROI — Database seed (Bahasa Indonesia)
 * Run: bun scripts/seed.ts
 *
 * NOTE: Product claims (problem, benefits, ingredients, how-to-use, price, FAQ)
 * are intentionally left EMPTY — the admin fills them via the CMS.
 * For the existing database use scripts/migrate-v3.ts instead (idempotent,
 * preserves owner-entered content).
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const categories = [
  { name: 'Face Care', slug: 'face-care', description: 'Pembersih, krim, dan perawatan wajah tertarget.', order: 1 },
  { name: 'Lip Care', slug: 'lip-care', description: 'Perawatan harian untuk bibir yang lembut.', order: 2 },
  { name: 'Body Care', slug: 'body-care', description: 'Ritual mandi, minyak, dan lotion untuk tubuh.', order: 3 },
]

type SeedProduct = {
  name: string
  slug: string
  category: string
  shortDesc: string
  featured?: boolean
  order: number
  image?: string
}

const products: SeedProduct[] = [
  { name: 'KINSUROI Soft Cleanser Gel', slug: 'kinsuroi-soft-cleanser-gel', category: 'face-care', shortDesc: 'Gel pembersih yang lembut', featured: true, order: 1 },
  { name: 'KINSUROI Herbal Cleanser Gel', slug: 'kinsuroi-herbal-cleanser-gel', category: 'face-care', shortDesc: 'Gel pembersih herbal', featured: true, order: 2 },
  { name: 'KINSUROI L Active C+', slug: 'kinsuroi-l-active-c', category: 'face-care', shortDesc: 'Serum vitamin C aktif', featured: true, order: 3 },
  { name: 'KINSUROI Retinol Serum+', slug: 'kinsuroi-retinol-serum', category: 'face-care', shortDesc: 'Serum wajah retinol', featured: true, order: 4 },
  { name: 'KINSUROI LipBalm', slug: 'kinsuroi-lipbalm', category: 'lip-care', shortDesc: 'Balm bibir yang menutrisi', order: 5 },
  { name: 'KINSUROI LipBalm Coral', slug: 'kinsuroi-lipbalm-coral', category: 'lip-care', shortDesc: 'Balm bibir nuansa coral', order: 6 },
  // Product #7 — photo not final yet: neutral placeholder, renamed + uploaded via CMS
  { name: 'Segera Hadir', slug: 'kinsuroi-lip-segera-hadir', category: 'lip-care', shortDesc: 'Produk Lip Care terbaru KINSUROI', order: 7, image: '/images/products/kinsuroi-placeholder.jpg' },
  { name: 'KINSUROI Shower Oel', slug: 'kinsuroi-shower-oel', category: 'body-care', shortDesc: 'Gel mandi', order: 8 },
  { name: 'KINSUROI Body Lotion Retinol', slug: 'kinsuroi-body-lotion-retinol', category: 'body-care', shortDesc: 'Lotion tubuh dengan retinol', order: 9 },
  { name: 'KINSUROI Body Oel', slug: 'kinsuroi-body-oel', category: 'body-care', shortDesc: 'Minyak tubuh', order: 10 },
  { name: 'KINSUROI Barrier Light Cream', slug: 'kinsuroi-barrier-light-cream', category: 'face-care', shortDesc: 'Krim barrier bertekstur ringan', order: 11 },
  { name: 'KINSUROI Acne Gel', slug: 'kinsuroi-acne-gel', category: 'face-care', shortDesc: 'Gel tertarget untuk jerawat', order: 12 },
]

const articles = [
  {
    title: 'Membangun Rutinitas Skincare yang Sederhana',
    slug: 'building-a-simple-skincare-routine',
    topic: 'Rutinitas',
    excerpt: 'Rutinitas yang baik tidak harus rumit. Pelajari langkah-langkah esensial dari ritual harian yang sederhana dan konsisten.',
    thumbnail: '/images/journal-1.jpg',
    content: `Rutinitas skincare tidak membutuhkan sepuluh langkah untuk bekerja efektif. Faktanya, rutinitas yang paling bertahan lama justru yang paling sederhana — beberapa produk pilihan, digunakan secara konsisten, pagi dan malam.

Mulailah dengan membersihkan. Kanvas yang bersih membantu setiap produk selanjutnya bekerja sebagaimana mestinya. Pilih pembersih yang lembut dan menghormati kulitmu, lalu gunakan air hangat — bukan air yang terlalu panas.

Setelah membersihkan, pertimbangkan serum jika kulitmu butuh perawatan tertarget. Serum dirancang untuk mengantarkan bahan dengan konsentrasi tinggi, jadi sedikit saja sudah cukup. Beri waktu sejenak untuk menyerap sebelum melanjutkan.

Selanjutnya, kunci semua lapisan dengan pelembap. Bahkan krim bertekstur ringan pun membantu mendukung barrier kulit dan menjaga kelembapan sepanjang hari.

Terakhir — dan ini langkah yang paling sering dilewatkan — lindungi kulitmu dari matahari setiap pagi. Ini kebiasaan paling berharga dalam rutinitas apa pun.

Konsistensi mengalahkan intensitas. Ritual sederhana yang kamu jalani setiap hari akan selalu lebih baik daripada ritual rumit yang hanya dilakukan seminggu sekali. Mulailah dari yang kecil, tetap lembut, dan biarkan kulitmu berbicara.`,
    seoTitle: 'Membangun Rutinitas Skincare yang Sederhana | KINSUROI Journal',
    seoDescription: 'Pelajari cara membangun rutinitas skincare yang sederhana dan konsisten — pembersih, serum, pelembap, dan proteksi harian.',
  },
  {
    title: 'Layering Skincare: Urutan yang Benar',
    slug: 'layering-skincare-the-right-order',
    topic: 'Edukasi',
    excerpt: 'Dari tekstur tipis ke kental, dari air ke minyak. Memahami urutan layering membantu setiap produk bekerja optimal.',
    thumbnail: '/images/journal-2.jpg',
    content: `Jika kamu menggunakan lebih dari satu produk skincare, urutan itu penting. Satu aturan sederhana hampir berlaku untuk semuanya: aplikasikan dari tekstur paling tipis dan berbasis air, hingga yang paling kental dan oklusif.

Mulailah dengan pembersih untuk membuka jalan. Lalu, jika kamu memakai toner atau essence, aplikasikan saat kulit masih sedikit lembap — ini membantu menyiapkan kulit untuk langkah berikutnya.

Serum datang berikutnya. Serum berbasis air dipakai sebelum yang berbasis minyak. Jika kamu memakai lebih dari satu serum, beri jeda tiga puluh detik hingga satu menit di antara masing-masing.

Krim dan pelembap menyusul setelahnya. Teksturnya yang lebih kaya membentuk lapisan penutup yang mengunci lapisan di bawahnya. Jika kamu memakai facial oil, hampir selalu dipakai paling akhir, di atas krim.

Di malam hari, urutan yang sama berlaku. Di pagi hari, selalu akhiri dengan tabir surya sebagai langkah terakhir sebelum makeup — bukan di bawahnya.

Satu catatan soal bahan aktif: jika kamu memperkenalkan bahan baru, lakukan secara bertahap dan hindari menumpuk beberapa bahan aktif yang kuat di malam yang sama. Kulitmu akan berterima kasih atas kesabaran itu.`,
    seoTitle: 'Layering Skincare: Urutan yang Benar | KINSUROI Journal',
    seoDescription: 'Panduan praktis mengurutkan produk skincare dengan benar — dari pembersih hingga tabir surya.',
  },
  {
    title: 'Ritual Perawatan Tubuh',
    slug: 'the-ritual-of-body-care',
    topic: 'Lifestyle',
    excerpt: 'Perawatan tubuh bukan sekadar pemeliharaan — ini jeda harian. Ubah mandi biasa menjadi ritual yang tenang dan memulihkan.',
    thumbnail: '/images/journal-3.jpg',
    content: `Kami sering memperlakukan perawatan tubuh sebagai sesuatu yang sekadar — dilakukan terburu-buru di antara akhir mandi dan awal hari. Namun beberapa menit yang kita habiskan untuk merawat tubuh bisa menjadi salah satu momen paling tenang dalam rutinitas harian.

Mulailah di kamar mandi. Air hangat dan pembersih tubuh yang lembut adalah semua yang dibutuhkan kulit. Tidak perlu air yang terlalu panas; kehangatan harus terasa menenangkan, tidak pernah mengeringkan.

Saat kulit masih sedikit lembap setelah mandi, aplikasikan lotion atau minyak tubuh. Jendela waktu kecil inilah saat kelembapan paling baik terjaga di kulit. Luangkan waktu untuk memijatnya perlahan — bahu, lengan, tangan.

Detail kecil lebih berarti daripada jumlah. Balm untuk bibir. Krim untuk tangan sebelum tidur. Ritual kecil yang diulang setiap hari ini perlahan menjadi bentuk penghargaan pada diri sendiri.

Perawatan tubuh, pada versi terbaiknya, bukanlah kewajiban. Ia adalah jeda — beberapa menit tenang yang sepenuhnya milikmu.`,
    seoTitle: 'Ritual Perawatan Tubuh | KINSUROI Journal',
    seoDescription: 'Ubah perawatan tubuh sehari-hari menjadi ritual yang tenang — pembersihan lembut, pelembapan yang penuh perhatian, dan kebiasaan kecil setiap hari.',
  },
]

const settings: { key: string; value: string; group: string }[] = [
  // Hero
  { key: 'hero_title', value: 'KECANTIKANMU, RITUALMU.', group: 'hero' },
  { key: 'hero_subtitle', value: 'Temukan ritual kecantikan yang sederhana dan elegan bersama KINSUROI.', group: 'hero' },
  { key: 'hero_cta_text', value: 'LIHAT PRODUK', group: 'hero' },
  { key: 'hero_cta_url', value: '/products', group: 'hero' },
  { key: 'hero_cta2_text', value: 'KENALI KINSUROI', group: 'hero' },
  { key: 'hero_cta2_url', value: '/about', group: 'hero' },
  { key: 'hero_image', value: '/images/hero.jpg', group: 'hero' },
  // Brand
  { key: 'brand_title', value: 'Kecantikan yang Sederhana.', group: 'brand' },
  {
    key: 'brand_description',
    value:
      'KINSUROI adalah brand kecantikan dengan satu ide sederhana: merawat diri harus terasa mudah, elegan, dan jujur. Kami menciptakan perawatan wajah dan tubuh yang esensial — pembersih, serum, krim, dan ritual harian — dengan formulasi yang dipikirkan matang dan tampilan yang understated.\n\nTanpa kebisingan. Tanpa kelebihan. Hanya produk yang kamu butuhkan, dalam bentuk yang kamu sukai untuk dipakai setiap hari.',
    group: 'brand',
  },
  { key: 'brand_image', value: '/images/brand.jpg', group: 'brand' },
  // Mid-page CTA
  { key: 'cta_title', value: 'TEMUKAN RITUAL KECANTIKANMU', group: 'cta' },
  { key: 'cta_text', value: 'Jelajahi koleksi KINSUROI dan temukan ritual yang tepat untukmu.', group: 'cta' },
  { key: 'cta_button_text', value: 'BELI SEKARANG', group: 'cta' },
  { key: 'cta_button_url', value: '/products', group: 'cta' },
  // Footer
  { key: 'footer_text', value: 'Bersih. Tenang. Elegan. Terpercaya.', group: 'footer' },
  { key: 'footer_copyright', value: '© KINSUROI. Hak cipta dilindungi.', group: 'footer' },
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
  { key: 'contact_whatsapp', value: '085888244750', group: 'contact' },
  // Company page (content slots — filled via CMS, nothing invented here)
  { key: 'company_about', value: '', group: 'company' },
  { key: 'company_vision', value: '', group: 'company' },
  { key: 'company_mission', value: '', group: 'company' },
  { key: 'company_values', value: '', group: 'company' },
  { key: 'company_quality', value: '', group: 'company' },
  // Social media (official channels — editable via CMS)
  { key: 'social_shopee', value: '', group: 'social' },
  { key: 'social_tiktok', value: '', group: 'social' },
  { key: 'social_youtube', value: '', group: 'social' },
  { key: 'social_instagram', value: '', group: 'social' },
  { key: 'social_facebook', value: '', group: 'social' },
  // NOTE: no admin_password here — the CMS credential lives in the
  // server-side ADMIN_PASSWORD environment variable only.
]

async function main() {
  console.log('Seeding KINSUROI database (Bahasa Indonesia)…')

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
      image: p.image ?? `/images/products/${p.slug}.jpg`,
      status: 'published',
      featured: p.featured ?? false,
      order: p.order,
      seoTitle: `${p.name} | KINSUROI`,
    }
    await db.product.upsert({ where: { slug: p.slug }, update: data, create: data })
  }
  console.log(`✓ ${products.length} products`)

  // Drop the legacy Serum category if present (products already reassigned)
  await db.category.deleteMany({ where: { slug: 'serum' } })
  // Never keep a credential row in the DB
  await db.siteSetting.deleteMany({ where: { key: 'admin_password' } })

  // Articles
  for (const a of articles) {
    const data = { ...a, author: 'Redaksi KINSUROI', status: 'published', publishedAt: new Date() }
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
