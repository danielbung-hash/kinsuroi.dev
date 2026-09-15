/**
 * KINSUROI — brand asset pipeline (owner-provided logo photo)
 * Run: bun scripts/make-brand-assets.ts
 *
 * Source: upload/Screenshot_20260915-193330.jpg (KINSUROI wordmark, white bg)
 *  1. public/images/kinsuroi-logo.png   — wordmark, white removed → transparent
 *  2. src/app/icon.png                  — favicon 512px (gold kinbaki ball)
 *  3. src/app/apple-icon.png            — 180px, white background
 *  4. public/images/products/kinsuroi-placeholder.jpg — neutral 4:5 placeholder
 *     for product #7 (photo not final — clearly a placeholder, NOT a fake photo)
 */
import sharp from 'sharp'

const SRC = 'upload/Screenshot_20260915-193330.jpg'
const W = 698
const H = 293

/** Remove the white background: keep dark pixels + the gold ball, feather edges */
async function transparentWordmark(): Promise<sharp.Sharp> {
  const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true })
  const out = Buffer.alloc(W * H * 4)
  for (let i = 0; i < W * H; i++) {
    const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2]
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    // white → transparent; dark text & gold ball stay fully opaque
    let alpha: number
    if (lum >= 248) alpha = 0
    else if (lum <= 225) alpha = 255
    else alpha = Math.round(255 * ((248 - lum) / 23))
    out[i * 4] = r
    out[i * 4 + 1] = g
    out[i * 4 + 2] = b
    out[i * 4 + 3] = alpha
  }
  return sharp(out, { raw: { width: W, height: H, channels: 4 } })
}

async function main() {
  /* 1 ── navbar/footer logo (transparent, trimmed, light padding) */
  const wordmark = await transparentWordmark()
  await wordmark
    .clone()
    .trim({ threshold: 12 })
    .extend({ top: 10, bottom: 10, left: 12, right: 12, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile('public/images/kinsuroi-logo.png')
  const logoMeta = await sharp('public/images/kinsuroi-logo.png').metadata()
  console.log(`✓ kinsuroi-logo.png ${logoMeta.width}x${logoMeta.height}`)

  /* 2+3 ── favicon: crop the gold kinbaki ball from the wordmark */
  // Ball bbox measured by pixel scan: x 524–617, y 116–209 (94×94)
  const ball = await wordmark.clone().extract({ left: 522, top: 114, width: 98, height: 98 }).png().toBuffer()
  const ballTrimmed = await sharp(ball).trim({ threshold: 12 }).png().toBuffer()
  const ballMeta = await sharp(ballTrimmed).metadata()
  console.log(`  ball crop: ${ballMeta.width}x${ballMeta.height}`)
  const side = Math.max(ballMeta.width, ballMeta.height)
  const pad = Math.round(side * 0.08)
  const sq = await sharp({
    create: { width: side + pad * 2, height: side + pad * 2, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: ballTrimmed, top: pad + Math.round((side - ballMeta.height) / 2), left: pad + Math.round((side - ballMeta.width) / 2) }])
    .png().toBuffer()

  await sharp(sq).resize(512, 512).png().toFile('src/app/icon.png')
  await sharp(sq).resize(180, 180).flatten({ background: '#ffffff' }).png().toFile('src/app/apple-icon.png')
  console.log('✓ icon.png (512) + apple-icon.png (180)')

  /* 4 ── product #7 placeholder (neutral, elegant, clearly not a product shot) */
  const phSvg = Buffer.from(`
  <svg width="1200" height="1500" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="1500" fill="#FAFAF8"/>
    <rect x="60" y="60" width="1080" height="1380" fill="none" stroke="#EAEAEA" stroke-width="2"/>
    <circle cx="600" cy="620" r="170" fill="none" stroke="#B08D57" stroke-width="2.5"/>
    <path d="M 510 520 L 690 720 M 690 520 L 510 720 M 600 450 L 600 790 M 470 620 L 730 620" stroke="#B08D57" stroke-width="1.5" opacity="0.55"/>
    <text x="600" y="950" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="64" letter-spacing="18" fill="#222222">KINSUROI</text>
    <text x="600" y="1030" text-anchor="middle" font-family="Jost, Arial, sans-serif" font-size="30" letter-spacing="12" fill="#9A8F80">SEGERA HADIR</text>
  </svg>`)
  await sharp(phSvg).jpeg({ quality: 90 }).toFile('public/images/products/kinsuroi-placeholder.jpg')
  console.log('✓ kinsuroi-placeholder.jpg (4:5 neutral placeholder)')
}

main().catch((e) => { console.error(e); process.exit(1) })
