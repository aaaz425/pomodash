import sharp from 'sharp'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const svgBuffer = readFileSync(join(__dirname, 'icon-source.svg'))

const BG = { r: 15, g: 23, b: 42, alpha: 1 } // #0f172a

async function makeIcon(size, dest) {
  await sharp(svgBuffer).resize(size, size).png().toFile(join(root, dest))
  console.log(`✓ ${dest}`)
}

async function makeMaskableIcon(size, dest) {
  const innerSize = Math.round(size * 0.6)
  const offset = Math.round((size - innerSize) / 2)
  const inner = await sharp(svgBuffer).resize(innerSize, innerSize).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background: BG } })
    .composite([{ input: inner, top: offset, left: offset }])
    .png()
    .toFile(join(root, dest))
  console.log(`✓ ${dest}`)
}

await makeIcon(512, 'public/icon-512.png')
await makeIcon(192, 'public/icon-192.png')
await makeIcon(180, 'public/apple-touch-icon.png')
await makeMaskableIcon(512, 'public/icon-maskable-512.png')
await makeMaskableIcon(192, 'public/icon-maskable-192.png')

console.log('\nAll icons generated.')
