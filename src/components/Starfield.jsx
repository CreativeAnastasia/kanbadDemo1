import { useEffect, useRef } from 'react'

export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let animId

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    // Three depth layers: distant (tiny/dim), mid, close (bright/twinkly)
    const layers = [
      { count: 180, rMin: 0.2, rMax: 0.6,  opMin: 0.15, opMax: 0.45, twinkleAmt: 0.08, speedMult: 0.4 },
      { count: 80,  rMin: 0.5, rMax: 0.9,  opMin: 0.35, opMax: 0.7,  twinkleAmt: 0.18, speedMult: 0.9 },
      { count: 28,  rMin: 0.8, rMax: 1.4,  opMin: 0.6,  opMax: 0.95, twinkleAmt: 0.3,  speedMult: 1.5 },
    ]

    const stars = layers.flatMap(({ count, rMin, rMax, opMin, opMax, twinkleAmt, speedMult }) =>
      Array.from({ length: count }, () => ({
        x: Math.random(),
        y: Math.random(),
        r: rMin + Math.random() * (rMax - rMin),
        baseOp: opMin + Math.random() * (opMax - opMin),
        twinkleAmt,
        speed: (0.0004 + Math.random() * 0.0008) * speedMult,
        phase: Math.random() * Math.PI * 2,
        glow: Math.random() > 0.85, // ~15% of bright stars get a halo
      }))
    )

    // Nebula patches — subtle atmospheric depth
    const nebulae = [
      { x: 0.72, y: 0.18, r: 0.28, color: [60, 30, 120] },    // indigo top-right
      { x: 0.15, y: 0.65, r: 0.22, color: [20, 60, 100] },    // blue mid-left
      { x: 0.5,  y: 0.85, r: 0.18, color: [80, 20, 80] },     // deep purple bottom
    ]

    let frame = 0

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw nebulae
      for (const neb of nebulae) {
        const grd = ctx.createRadialGradient(
          neb.x * canvas.width, neb.y * canvas.height, 0,
          neb.x * canvas.width, neb.y * canvas.height, neb.r * Math.min(canvas.width, canvas.height)
        )
        const [r, g, b] = neb.color
        grd.addColorStop(0, `rgba(${r},${g},${b},0.055)`)
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`)
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Draw stars
      for (const star of stars) {
        const twinkle = Math.sin(frame * star.speed * 60 + star.phase) * star.twinkleAmt
        const alpha = Math.max(0.03, star.baseOp + twinkle)
        const x = star.x * canvas.width
        const y = star.y * canvas.height

        if (star.glow && star.r > 0.9) {
          // Soft halo for bright stars
          const halo = ctx.createRadialGradient(x, y, 0, x, y, star.r * 5)
          halo.addColorStop(0, `rgba(220, 220, 255, ${alpha * 0.35})`)
          halo.addColorStop(1, `rgba(220, 220, 255, 0)`)
          ctx.fillStyle = halo
          ctx.beginPath()
          ctx.arc(x, y, star.r * 5, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(x, y, star.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 225, 255, ${alpha})`
        ctx.fill()
      }

      frame++
      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
