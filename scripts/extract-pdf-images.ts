// Extract PDF images → public/images/company/*.jpg (sharp)
import sharp from 'sharp'
import { mkdirSync } from 'fs'

const SRC = '/tmp/kinsuroi-backup/pdf-img'
const OUT = '/home/z/my-project/public/images/company'
mkdirSync(OUT, { recursive: true })

const jobs: [string, string, number][] = [
  ['img-002.png', 'company-founder.jpg', 800],      // founder portrait
  ['img-005.png', 'company-facility.jpg', 1400],    // lab + production wide
  ['img-008.png', 'company-founder-lab.jpg', 600],  // founder in lab
]

for (const [src, out, width] of jobs) {
  await sharp(`${SRC}/${src}`).resize({ width, withoutEnlargement: true }).jpeg({ quality: 82 }).toFile(`${OUT}/${out}`)
  console.log('saved', out)
}
