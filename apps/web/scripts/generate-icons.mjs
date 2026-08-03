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

// 스크린샷 SVG 템플릿 (wide: 1280×800, narrow: 390×844)
function screenshotSvg(width, height) {
  const iconSize = Math.round(Math.min(width, height) * 0.12)
  const cx = width / 2
  const cy = height * 0.38
  const textY = cy + iconSize * 0.72 + 36
  const scale = iconSize / 24

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <rect width="${width}" height="${height}" fill="#0f172a"/>
  <g transform="translate(${cx - iconSize / 2},${cy - iconSize / 2}) scale(${scale})" stroke="white" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 21 L5 3 L13 3" stroke-width="2.5"/>
    <circle cx="13" cy="10" r="7" stroke-width="2"/>
    <line x1="5" y1="17" x2="13" y2="17" stroke-width="2.5"/>
    <line x1="13" y1="7.5" x2="13" y2="10" stroke-width="1.8"/>
    <line x1="13" y1="10" x2="15.5" y2="11.5" stroke-width="1.8"/>
    <circle cx="15.5" cy="11.5" r="1.2" fill="#ef4444" stroke="none"/>
  </g>
  <text x="${cx}" y="${textY}" font-family="system-ui,sans-serif" font-size="${Math.round(iconSize * 0.52)}" font-weight="700" fill="white" text-anchor="middle" letter-spacing="-1">Pomodash</text>
  <text x="${cx}" y="${textY + Math.round(iconSize * 0.36)}" font-family="system-ui,sans-serif" font-size="${Math.round(iconSize * 0.26)}" fill="#94a3b8" text-anchor="middle">포모도로 타이머 — 작업 계획 · 집중 · 기록</text>
</svg>`)
}

// --- 아이콘 ---
await makeIcon(512, 'public/icon-512.png')
await makeIcon(192, 'public/icon-192.png')
await makeIcon(180, 'public/apple-touch-icon.png')
await makeMaskableIcon(512, 'public/icon-maskable-512.png')
await makeMaskableIcon(192, 'public/icon-maskable-192.png')

// --- 스크린샷 ---
await sharp(screenshotSvg(1280, 800)).png().toFile(join(root, 'public/screenshot-wide.png'))
console.log('✓ public/screenshot-wide.png')

await sharp(screenshotSvg(390, 844)).png().toFile(join(root, 'public/screenshot-narrow.png'))
console.log('✓ public/screenshot-narrow.png')

console.log('\nAll assets generated.')
