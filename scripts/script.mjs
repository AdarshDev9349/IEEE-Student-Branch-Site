// scripts/generate-rings.mjs
// Run with: node scripts/generate-rings.mjs

import fs from 'fs'
import path from 'path'
import { createCanvas, loadImage } from 'canvas'

// ✅ PUT ALL YOUR IMAGES IN /public/posters/
const POSTERS_DIR = './public/posters'
const OUTPUT_DIR = './public/rings'

const rings = [
  { name: 'ring-outer.png', canvasSize: 2000, radius: 850, imgW: 150, imgH: 150, blur: 0 },
  { name: 'ring-mid.png',   canvasSize: 1500, radius: 650, imgW: 150, imgH: 150, blur: 0 },
  { name: 'ring-inner.png', canvasSize: 1200,  radius: 450, imgW: 150, imgH: 150, blur: 0 },
]

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const files = fs.readdirSync(POSTERS_DIR).filter(f =>
    /\.(jpg|jpeg|png|webp)$/i.test(f)
  )

  if (files.length === 0) {
    console.log('No images found in /public/posters/')
    return
  }

  console.log(`Found ${files.length} images`)

  // Distribute images across rings
  const third = Math.ceil(files.length / 3)
  const chunks = [
    files.slice(0, third),
    files.slice(third, third * 2),
    files.slice(third * 2),
  ]

  for (let r = 0; r < rings.length; r++) {
    const ring = rings[r]
    const imgs = chunks[r]
    if (!imgs || imgs.length === 0) continue

    const canvas = createCanvas(ring.canvasSize, ring.canvasSize)
    const ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, ring.canvasSize, ring.canvasSize)

    const cx = ring.canvasSize / 2
    const cy = ring.canvasSize / 2

    for (let i = 0; i < imgs.length; i++) {
      const angle = ((360 / imgs.length) * i * Math.PI) / 180
      const x = cx + Math.cos(angle) * ring.radius
      const y = cy + Math.sin(angle) * ring.radius

      try {
        const img = await loadImage(path.join(POSTERS_DIR, imgs[i]))

        const hw = ring.imgW / 2
        const hh = ring.imgH / 2

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle + Math.PI / 2)

        // rounded rect clip
        const r2 = 12
        ctx.beginPath()
        ctx.moveTo(-hw + r2, -hh)
        ctx.lineTo(hw - r2, -hh)
        ctx.quadraticCurveTo(hw, -hh, hw, -hh + r2)
        ctx.lineTo(hw, hh - r2)
        ctx.quadraticCurveTo(hw, hh, hw - r2, hh)
        ctx.lineTo(-hw + r2, hh)
        ctx.quadraticCurveTo(-hw, hh, -hw, hh - r2)
        ctx.lineTo(-hw, -hh + r2)
        ctx.quadraticCurveTo(-hw, -hh, -hw + r2, -hh)
        ctx.closePath()
        ctx.clip()

        ctx.drawImage(img, -hw, -hh, ring.imgW, ring.imgH)
        ctx.restore()

        // subtle border
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle + Math.PI / 2)
        ctx.strokeStyle = 'rgba(255,255,255,0.12)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(-hw + r2, -hh)
        ctx.lineTo(hw - r2, -hh)
        ctx.quadraticCurveTo(hw, -hh, hw, -hh + r2)
        ctx.lineTo(hw, hh - r2)
        ctx.quadraticCurveTo(hw, hh, hw - r2, hh)
        ctx.lineTo(-hw + r2, hh)
        ctx.quadraticCurveTo(-hw, hh, -hw, hh - r2)
        ctx.lineTo(-hw, -hh + r2)
        ctx.quadraticCurveTo(-hw, -hh, -hw + r2, -hh)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()

      } catch (e) {
        console.warn(`Could not load ${imgs[i]}:`, e.message)
      }
    }

    const out = path.join(OUTPUT_DIR, ring.name)
    fs.writeFileSync(out, canvas.toBuffer('image/png'))
    console.log(`✅ Saved ${ring.name}`)
  }

  console.log('Done! Ring images saved to /public/rings/')
}

main()