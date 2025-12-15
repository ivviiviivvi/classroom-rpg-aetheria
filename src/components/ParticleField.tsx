import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

interface ParticleFieldProps {
  count?: number
  speed?: number
}

export function ParticleField({ count = 50, speed = 0.3 }: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const dimensionsRef = useRef({ width: 0, height: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let isMounted = true
    let animationId: number

    const updateDimensions = () => {
      if (!isMounted || !canvas) return
      dimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight
      }
      canvas.width = dimensionsRef.current.width
      canvas.height = dimensionsRef.current.height

      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * dimensionsRef.current.width,
        y: Math.random() * dimensionsRef.current.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2
      }))
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Optimization: Pre-calculate squared distance to avoid Math.sqrt in the loop
    const CONNECTION_DISTANCE = 150
    const CONNECTION_DISTANCE_SQ = CONNECTION_DISTANCE * CONNECTION_DISTANCE

    const animate = () => {
      if (!isMounted || !canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Optimization: Use for loop instead of forEach to avoid callback allocation per frame
      for (let i = 0; i < particlesRef.current.length; i++) {
        const particle = particlesRef.current[i]
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off walls
        if (particle.x < 0 || particle.x > dimensionsRef.current.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > dimensionsRef.current.height) particle.vy *= -1

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()
      }

      // Draw connections
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]

          const dx = p1.x - p2.x

          // Optimization: Early exit if horizontal distance is too large
          if (dx > CONNECTION_DISTANCE || dx < -CONNECTION_DISTANCE) continue

          const dy = p1.y - p2.y

          // Optimization: Early exit if vertical distance is too large
          if (dy > CONNECTION_DISTANCE || dy < -CONNECTION_DISTANCE) continue

          // Optimization: Compare squared distance to avoid expensive Math.sqrt()
          const distSq = dx * dx + dy * dy

          if (distSq < CONNECTION_DISTANCE_SQ) {
            const distance = Math.sqrt(distSq)
            const opacity = (1 - distance / CONNECTION_DISTANCE) * 0.15
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      isMounted = false
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [count, speed])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none opacity-30"
      style={{ zIndex: 0 }}
    />
  )
}
