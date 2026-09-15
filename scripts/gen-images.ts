/**
 * KINSUROI — elegant placeholder image generation
 * Run: bun scripts/gen-images.ts
 * Generates hero, brand, 11 product images and 3 journal thumbnails.
 */
import ZAI from 'z-ai-web-dev-sdk'
import fs from 'fs'
import path from 'path'

const OUT = '/home/z/my-project/public/images'

const STYLE =
  'premium beauty brand product photography, unlabeled minimal packaging with no text, seamless soft off-white studio background, gentle natural lighting, soft subtle shadow, centered composition, elegant clean aesthetic, muted warm white and beige tones, high quality, detailed, photorealistic'

type Job = { file: string; size: string; prompt: string }

const jobs: Job[] = [
  {
    file: 'hero.jpg',
    size: '864x1152',
    prompt: `Tall editorial arrangement of elegant luxury skincare products: clear gel pump bottle, frosted glass dropper serum bottle and a white cream jar grouped on a smooth cream podium, ${STYLE}`,
  },
  {
    file: 'brand.jpg',
    size: '864x1152',
    prompt: `Quiet beauty ritual scene, one elegant white cosmetic cream jar beside folded soft beige linen cloth and a single dried botanical stem, ${STYLE}`,
  },
  {
    file: 'journal-1.jpg',
    size: '1344x768',
    prompt: `Row of minimal skincare bottles lined up on a light marble surface in soft morning window light, wide horizontal composition, ${STYLE}`,
  },
  {
    file: 'journal-2.jpg',
    size: '1344x768',
    prompt: `Glass dropper held above an open palm with a single serum drop, macro beauty photography, wide horizontal composition, ${STYLE}`,
  },
  {
    file: 'journal-3.jpg',
    size: '1344x768',
    prompt: `Spa-like flat lay with white body lotion bottle, rolled cream towel and smooth stone on beige linen, wide horizontal composition, ${STYLE}`,
  },
]

const products: [string, string][] = [
  ['kinsuroi-soft-cleanser-gel', 'clear pump bottle filled with translucent gentle gel, cylindrical modern shape'],
  ['kinsuroi-herbal-cleanser-gel', 'pump bottle with soft sage green herbal gel, minimalist cylindrical shape'],
  ['kinsuroi-l-active-c', 'small amber orange glass dropper bottle of bright serum'],
  ['kinsuroi-retinol-serum', 'frosted white glass dropper bottle of serum'],
  ['kinsuroi-lipbalm', 'small round white lip balm jar, tiny and compact'],
  ['kinsuroi-lipbalm-coral', 'small round lip balm jar with soft coral tinted lid'],
  ['kinsuroi-shower-oel', 'tall cream white pump bottle of shower gel'],
  ['kinsuroi-body-lotion-retinol', 'tall white pump bottle of body lotion'],
  ['kinsuroi-body-oel', 'clear glass bottle filled with golden body oil, slender elegant silhouette'],
  ['kinsuroi-barrier-light-cream', 'round white ceramic-style cream jar with soft matte lid'],
  ['kinsuroi-acne-gel', 'small slim white squeeze tube with narrow precision tip'],
]

for (const [slug, desc] of products) {
  jobs.push({ file: `products/${slug}.jpg`, size: '1024x1024', prompt: `Single ${desc}, ${STYLE}` })
}

async function main() {
  fs.mkdirSync(path.join(OUT, 'products'), { recursive: true })
  const zai = await ZAI.create()
  let ok = 0
  let fail = 0

  for (const job of jobs) {
    const outPath = path.join(OUT, job.file)
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
      console.log(`↷ skip existing ${job.file}`)
      ok++
      continue
    }
    let done = false
    for (let attempt = 1; attempt <= 3 && !done; attempt++) {
      try {
        const res = await zai.images.generations.create({ prompt: job.prompt, size: job.size })
        const b64 = res?.data?.[0]?.base64
        if (!b64) throw new Error('empty base64')
        fs.writeFileSync(outPath, Buffer.from(b64, 'base64'))
        console.log(`✓ ${job.file} (${fs.statSync(outPath).size} bytes)`)
        done = true
        ok++
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e)
        console.error(`✗ ${job.file} attempt ${attempt}: ${msg}`)
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1500 * attempt))
        else fail++
      }
    }
  }
  console.log(`DONE ok=${ok} fail=${fail}`)
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
