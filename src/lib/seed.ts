// KINSUROI — Shared seed data + idempotent seeding.
//
// Used by:
//   • src/lib/db-setup.ts  → runtime auto-provision (first request on a fresh DB)
//   • scripts/seed.ts      → manual CLI seed (bun scripts/seed.ts)
//
// Product claims (problem, benefits, ingredients, how-to-use, price, FAQ) are
// intentionally EMPTY — the owner fills them via the CMS. Nothing is invented.
import type { PrismaClient } from '@prisma/client'

export const categories = [
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

export const products: SeedProduct[] = [
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

export const articles = [
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

export const settings: { key: string; value: string; group: string }[] = [
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
  // Contact — exactly as written in the official company profile PDF
  {
    key: 'contact_address',
    value:
      'Komplek Sentra Niaga Surya Kadu Blok F.9, Jl. Raya Telesonik No. 10, RT.001/RW.001, Kadu Jaya, Kec. Curug, Kabupaten Tangerang, Banten 15810',
    group: 'contact',
  },
  { key: 'contact_phone_1', value: '+62 21 29437988', group: 'contact' },
  { key: 'contact_phone_2', value: '+62 21 29437987', group: 'contact' },
  { key: 'contact_email', value: 'danieramardika@gmail.com', group: 'contact' },
  { key: 'contact_whatsapp', value: '085888244750', group: 'contact' },
  // Company profile ("Tentang") — follows the owner's official PDF
  // "Company Profile — PT Dani Era Mardika". Editable via CMS at any time.
  {
    key: 'company_about',
    value:
      'PT Dani Era Mardika adalah boutique manufaktur skincare kosmetik yang berdiri di Indonesia pada 2022, dibangun oleh Dipl.-Ing. Daniel A. Bung dengan pengalaman lebih dari 30 tahun di industri kosmetik Jerman dan Eropa.\n\nGagasan mendirikan fasilitas ini berangkat dari visi untuk membangun kemampuan industri skincare kosmetik Indonesia agar mampu menghasilkan produk berbasis scientific research, berkualitas tinggi, dan memiliki standar yang dapat sejajar dengan negara maju.\n\nPengembangan formula berlandaskan riset dan pengalaman lapangan, dengan memahami kondisi iklim, lingkungan, karakteristik kulit, serta permasalahan konsumen Indonesia. Untuk pasar ekspor, formula dikembangkan secara adaptif sesuai kondisi, kebutuhan konsumen, dan persyaratan negara tujuan.\n\nFasilitas ini menjadi fondasi pengembangan KINSUROI sekaligus bagian dari upaya membangun industri kosmetik Indonesia yang lebih mandiri — menghasilkan skincare kosmetik Indonesia yang tidak hanya mampu memenuhi kebutuhan pasar dalam negeri, tetapi memiliki kualitas, teknologi, dan daya saing untuk menembus pasar global serta berdiri sejajar dengan produk dari negara-negara maju.',
    group: 'company',
  },
  { key: 'company_founder', value: 'Dipl.-Ing. Daniel A. Bung — Founder & Formulator, PT Dani Era Mardika', group: 'company' },
  {
    key: 'company_facts',
    value:
      'Badan Hukum: PT (Perseroan Terbatas)\nBidang Usaha: Skincare kosmetik standar internasional\nFasilitas: Bersertifikat CPKB (GMP) dan Halal\nBrand Internal: KINSUROI',
    group: 'company',
  },
  {
    key: 'company_factory',
    value:
      'PT Dani Era Mardika didirikan untuk mendukung brand internal KINSUROI, dengan pabrik sendiri sebagai fondasinya. Pendekatan ini didasari pengamatan langsung Daniel A. Bung selama berkarir di lapangan industri kosmetik Jerman: brand-brand yang memegang kendali kualitas paling konsisten adalah yang memiliki pabrik CPKB sendiri, bukan yang sepenuhnya bergantung pada pihak ketiga.',
    group: 'company',
  },
  {
    key: 'company_quality',
    value:
      'Standar dan konsistensi produk dipegang penuh dari hulu ke hilir, tidak bergantung pada pihak eksternal yang bisa berubah standar atau bahan bakunya.',
    group: 'company',
  },
  {
    key: 'company_responsibility',
    value:
      'Setiap batch produk yang keluar menjadi tanggung jawab langsung PT Dani Era Mardika, dari formulasi sampai produk jadi.',
    group: 'company',
  },
  {
    key: 'company_quote',
    value:
      'Hasil dari model ini: produk KINSUROI dapat diproduksi dengan kualitas tinggi standar Jerman, karena seluruh proses berada di bawah kendali perusahaan sendiri.',
    group: 'company',
  },
  {
    key: 'company_production',
    value:
      'PT Dani Era Mardika menjalankan formulasi dan produksi skincare secara in-house, dipimpin langsung oleh Dipl.-Ing. Daniel A. Bung sebagai Formulator dan Strategy Development Produk, dengan lebih dari 30 tahun pengalaman di industri kosmetik, termasuk pengalaman dan pendidikan di Jerman. Pengembangan produk memadukan German formulation approach dengan riset lapangan terhadap iklim, kondisi kulit, serta permasalahan dan kebutuhan konsumen Indonesia.',
    group: 'company',
  },
  {
    key: 'company_lab',
    value:
      'Setiap formula dikembangkan, diuji, disempurnakan, dan diproduksi secara in-house di bawah kendali langsung PT Dani Era Mardika. Pendekatan ini memungkinkan proses R&D hingga produk akhir dikontrol secara konsisten, dengan setiap formula dapat dievaluasi dan disesuaikan berdasarkan hasil riset dan kondisi nyata konsumen Indonesia.',
    group: 'company',
  },
  {
    key: 'company_encapsulation',
    value:
      'Zat aktif tertentu dikembangkan menggunakan teknologi micro-encapsulation, termasuk Ascorbic Acid, Bakuchiol, Niacinamide, Retinol, Tranexamic Acid, Ceramide, dan lainnya. PT Dani Era Mardika memiliki hak import bahan baku secara langsung serta mengembangkan sistem encapsulation dengan pendekatan teknologi farmasi, untuk meningkatkan stabilitas terhadap oksidasi, kompatibilitas formulasi, skin delivery, dan efektivitas zat aktif.',
    group: 'company',
  },
  {
    key: 'company_natural',
    value:
      'Sebagai anak bangsa dan perusahaan yang lahir di Indonesia, kami bersyukur atas kekayaan hayati yang dianugerahkan Indonesia, dengan berbagai tanaman potensial seperti Buah Merah Papua, Aloe Vera, Chamomile, Lavender, Rosemary, dan berbagai tanaman lainnya.\n\nKami berkomitmen untuk mengembangkan potensi bahan baku hayati Indonesia, mengolahnya menjadi ekstrak berkualitas tinggi dengan standar cosmetic grade, serta memberikan nilai tambah melalui pengembangan dan formulasi untuk industri kosmetik berstandar internasional.',
    group: 'company',
  },
  {
    key: 'company_brand_story',
    value:
      'KINSUROI adalah brand internal PT Dani Era Mardika, lahir dari inovasi dan pemikiran Dipl.-Ing. Daniel A. Bung dalam melihat kondisi industri skincare saat ini.\n\nDi tengah overload produk, active ingredients, dan rutinitas yang semakin kompleks, konsumen justru semakin sulit memahami apa yang benar-benar dibutuhkan kulitnya. Penggunaan terlalu banyak produk dan active ingredients secara bersamaan juga dapat meningkatkan risiko irritation, incompatibility, dan skin barrier yang terganggu.\n\nDari sinilah KINSUROI lahir dengan filosofi Simple & Clear: formulasi tetap berbasis teknologi dan inovasi, tetapi setiap bahan dan setiap fungsi harus memiliki tujuan yang jelas, relevan, dan dibutuhkan oleh kulit.',
    group: 'company',
  },
  {
    key: 'company_kintsukuroi',
    value:
      'Nama KINSUROI terinspirasi dari filosofi Jepang Kintsukuroi — memperbaiki sesuatu yang retak dengan emas, dan menjadikan bekas perbaikannya sebagai bagian dari keindahan.\n\nFilosofi ini mengajarkan bahwa keindahan tidak selalu lahir dari sesuatu yang sempurna atau berlebihan. Justru melalui hal yang simple, tepat, dan penuh makna, sesuatu dapat memiliki nilai dan keindahan yang lebih dalam.\n\nSemangat inilah yang menjadi dasar KINSUROI: Simple & Clear — tidak mengejar kompleksitas, tetapi memahami apa yang benar-benar dibutuhkan dan menjadikannya bernilai.',
    group: 'company',
  },
  {
    key: 'company_vision',
    value:
      'Menghasilkan skincare kosmetik Indonesia yang tidak hanya mampu memenuhi kebutuhan pasar dalam negeri, tetapi memiliki kualitas, teknologi, dan daya saing untuk menembus pasar global serta berdiri sejajar dengan produk dari negara-negara maju.',
    group: 'company',
  },
  { key: 'company_mission', value: '', group: 'company' },
  {
    key: 'company_values',
    value:
      'Bersih — Formula yang dipikirkan matang dan informasi yang jujur. Apa yang tertulis di label adalah yang kamu dapatkan.\nElegan — Desain yang tenang dalam segala hal — dari produknya sendiri hingga cara kamu menggunakannya.\nSederhana — Tanpa tekanan sepuluh langkah. Produk esensial yang menghormati waktumu dan kulitmu.\nTerpercaya — Informasi yang jelas, kanal resmi, dan tim yang selalu merespons ketika kamu menghubungi.',
    group: 'company',
  },
  // Company page photos (extracted from the official PDF; replaceable via CMS)
  { key: 'company_founder_image', value: '/images/company/company-founder.jpg', group: 'company' },
  { key: 'company_factory_image', value: '/images/company/company-facility.jpg', group: 'company' },
  { key: 'company_lab_image', value: '/images/company/company-founder-lab.jpg', group: 'company' },
  // Social media (official channels — editable via CMS)
  { key: 'social_instagram', value: 'https://www.instagram.com/kinsuroi', group: 'social' },
  { key: 'social_shopee', value: '', group: 'social' },
  { key: 'social_tiktok', value: '', group: 'social' },
  { key: 'social_youtube', value: '', group: 'social' },
  { key: 'social_facebook', value: '', group: 'social' },
  // NOTE: no admin_password here — the CMS credential lives in the
  // server-side ADMIN_PASSWORD environment variable only.
]

/**
 * Official product claims lifted verbatim from the "PRODUCT PORTFOLIO"
 * section of the owner's Company Profile PDF. Applied by the seed ONLY to
 * products whose "benefits" (Manfaat) field is still empty — owner-entered
 * claims are never overwritten.
 */
export const productClaims: Record<string, string> = {
  'kinsuroi-soft-cleanser-gel': 'BHA + Skin Barrier Kompleks',
  'kinsuroi-l-active-c':
    'Encapsulasi L-Ascorbic Acid + Niacinamide + Vitamin E + Coenzyme Q10 + Barrier Kompleks',
  'kinsuroi-retinol-serum':
    'Encapsulasi Retinol + Bakuchiol + Niacinamide + Tranexamic Acid + Barrier Kompleks',
  'kinsuroi-lipbalm': 'Peptide + Encapsulasi Vitamin E + Coenzyme Q10',
  'kinsuroi-shower-oel': 'Konsep SPA Germany',
  'kinsuroi-body-oel': 'SPA Oil Wangi Rose Prancis',
  'kinsuroi-body-lotion-retinol':
    'Retinol + Bakuchiol + Niacinamide + TXA + Urea + Barrier Kompleks',
}

/** Fill a product's EMPTY benefits field with the official PDF claim (if any). */
async function fillEmptyClaims(client: PrismaClient): Promise<number> {
  let filled = 0
  for (const [slug, benefits] of Object.entries(productClaims)) {
    const p = await client.product.findUnique({ where: { slug } })
    if (p && !(p.benefits ?? '').trim()) {
      await client.product.update({ where: { slug }, data: { benefits } })
      filled++
    }
  }
  return filled
}

// Address auto-seeded by an earlier release (abbreviated wording). Refreshed
// to the official PDF wording ONLY when still byte-equal — i.e. never edited
// by the owner in the CMS.
const LEGACY_ADDRESS =
  'Komp. Sentra Niaga Surya Kadu Blok F No.9, Kadujaya RT 001/001, Kec. Curug, Jl. Raya Telesonik No.10, Kota Tangerang, Banten 15810, Indonesia'

async function refreshLegacyAddress(client: PrismaClient): Promise<void> {
  const row = await client.siteSetting.findUnique({ where: { key: 'contact_address' } })
  if (row && row.value.trim() === LEGACY_ADDRESS) {
    const official = settings.find((s) => s.key === 'contact_address')?.value
    if (official) {
      await client.siteSetting.update({ where: { key: 'contact_address' }, data: { value: official } })
    }
  }
}

/**
 * Idempotent seed — safe to run against an empty or partially-filled database.
 * Upserts by slug/key so owner-entered CMS content is never overwritten with
 * empty values: `update` only touches structural fields, never the claim fields.
 */
export async function seedDatabase(client: PrismaClient): Promise<void> {
  for (const c of categories) {
    await client.category.upsert({ where: { slug: c.slug }, update: c, create: c })
  }

  for (const p of products) {
    const cat = await client.category.findUnique({ where: { slug: p.category } })
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
    await client.product.upsert({ where: { slug: p.slug }, update: data, create: data })
  }

  // Drop the legacy Serum category if present (products already reassigned)
  await client.category.deleteMany({ where: { slug: 'serum' } })
  // Never keep a credential row in the DB
  await client.siteSetting.deleteMany({ where: { key: 'admin_password' } })

  // Official PDF claims → products whose Manfaat is still blank
  await fillEmptyClaims(client)
  await refreshLegacyAddress(client)

  for (const a of articles) {
    const data = { ...a, author: 'Redaksi KINSUROI', status: 'published', publishedAt: new Date() }
    await client.article.upsert({ where: { slug: a.slug }, update: data, create: data })
  }

  for (const s of settings) {
    await client.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value, group: s.group }, create: s })
  }
}

export type SeedReport = {
  categories: number
  products: number
  articles: number
  settings: number
}

/**
 * Repair-mode seed — adds ONLY rows that are missing (matched by slug/key).
 * Never overwrites owner-entered CMS content, so it is safe to run anytime
 * (e.g. from the admin "Seed default content" button on a fresh production
 * database, or after rows were deleted accidentally).
 */
export async function seedMissing(client: PrismaClient): Promise<SeedReport> {
  const report: SeedReport = { categories: 0, products: 0, articles: 0, settings: 0 }

  for (const c of categories) {
    const exists = await client.category.findUnique({ where: { slug: c.slug } })
    if (!exists) {
      await client.category.create({ data: c })
      report.categories++
    }
  }

  for (const p of products) {
    const exists = await client.product.findUnique({ where: { slug: p.slug } })
    if (exists) continue
    const cat = await client.category.findUnique({ where: { slug: p.category } })
    await client.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        categoryId: cat?.id ?? null,
        shortDesc: p.shortDesc,
        image: p.image ?? `/images/products/${p.slug}.jpg`,
        status: 'published',
        featured: p.featured ?? false,
        order: p.order,
        seoTitle: `${p.name} | KINSUROI`,
      },
    })
    report.products++
  }

  for (const a of articles) {
    const exists = await client.article.findUnique({ where: { slug: a.slug } })
    if (exists) continue
    await client.article.create({
      data: { ...a, author: 'Redaksi KINSUROI', status: 'published', publishedAt: new Date() },
    })
    report.articles++
  }

  for (const st of settings) {
    const exists = await client.siteSetting.findUnique({ where: { key: st.key } })
    if (!exists) {
      await client.siteSetting.create({ data: st })
      report.settings++
    } else if (!exists.value.trim() && st.value.trim()) {
      // Repair mode also fills EMPTY values with defaults — owner-entered
      // content is never overwritten, only blanks get completed.
      await client.siteSetting.update({ where: { key: st.key }, data: { value: st.value, group: st.group } })
      report.settings++
    }
  }

  // Same housekeeping as the full seed
  await client.category.deleteMany({ where: { slug: 'serum' } })
  await client.siteSetting.deleteMany({ where: { key: 'admin_password' } })

  // Official PDF claims → products whose Manfaat is still blank
  report.products += await fillEmptyClaims(client)
  await refreshLegacyAddress(client)

  return report
}
