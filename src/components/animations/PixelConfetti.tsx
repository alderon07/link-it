"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"

const PIXEL_COLORS = [
  "var(--pixel-pink)",
  "var(--pixel-teal)",
  "var(--pixel-yellow)",
  "var(--pixel-mint)",
  "var(--pixel-coral)",
  "var(--pixel-purple)",
  "var(--pixel-blue)",
  "var(--pixel-orange)",
  "var(--pixel-green)",
]

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  velocityX: number
  velocityY: number
}

function generateParticles(count: number, originX: number, originY: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: originX,
    y: originY,
    color: PIXEL_COLORS[Math.floor(Math.random() * PIXEL_COLORS.length)],
    size: 4 + Math.random() * 8,
    rotation: Math.random() * 360,
    velocityX: (Math.random() - 0.5) * 400,
    velocityY: -200 - Math.random() * 300,
  }))
}

interface PixelConfettiProps {
  /** Whether to show the confetti */
  active: boolean
  /** Number of particles */
  particleCount?: number
  /** Origin X position (default: center) */
  originX?: number
  /** Origin Y position (default: center) */
  originY?: number
  /** Duration in ms before particles disappear */
  duration?: number
  /** Callback when animation completes */
  onComplete?: () => void
}

/**
 * PixelConfetti creates a burst of pixel-style confetti particles.
 * Trigger on success actions like form submissions or achievements.
 *
 * @example
 * ```tsx
 * const [showConfetti, setShowConfetti] = useState(false)
 *
 * <Button onClick={() => setShowConfetti(true)}>
 *   Celebrate!
 * </Button>
 * <PixelConfetti
 *   active={showConfetti}
 *   onComplete={() => setShowConfetti(false)}
 * />
 * ```
 */
export function PixelConfetti({
  active,
  particleCount = 30,
  originX,
  originY,
  duration = 2000,
  onComplete,
}: PixelConfettiProps) {
  const [particles, setParticles] = React.useState<Particle[]>([])
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (active) {
      const container = containerRef.current
      const centerX = originX ?? (container ? container.offsetWidth / 2 : window.innerWidth / 2)
      const centerY = originY ?? (container ? container.offsetHeight / 2 : window.innerHeight / 2)

      setParticles(generateParticles(particleCount, centerX, centerY))

      const timer = setTimeout(() => {
        setParticles([])
        onComplete?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [active, particleCount, originX, originY, duration, onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 1,
              rotate: 0,
            }}
            animate={{
              x: particle.x + particle.velocityX,
              y: particle.y + particle.velocityY + 600, // gravity effect
              opacity: [1, 1, 0],
              scale: [1, 1.2, 0.5],
              rotate: particle.rotation + (Math.random() > 0.5 ? 360 : -360),
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: duration / 1000,
              ease: "easeOut",
            }}
            style={{
              position: "absolute",
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Mini confetti burst for inline celebrations (smaller, contained).
 */
export function PixelConfettiMini({
  active,
  className,
}: {
  active: boolean
  className?: string
}) {
  const [particles, setParticles] = React.useState<Particle[]>([])

  React.useEffect(() => {
    if (active) {
      setParticles(generateParticles(12, 50, 50))
      const timer = setTimeout(() => setParticles([]), 1500)
      return () => clearTimeout(timer)
    }
  }, [active])

  return (
    <div className={`relative w-24 h-24 overflow-hidden ${className}`}>
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: 50,
              y: 50,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: 50 + particle.velocityX * 0.2,
              y: 50 + particle.velocityY * 0.3 + 80,
              opacity: [1, 1, 0],
              scale: [1, 1.2, 0.3],
            }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              position: "absolute",
              width: particle.size * 0.5,
              height: particle.size * 0.5,
              backgroundColor: particle.color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

/**
 * Sparkle effect - smaller, subtle celebration.
 */
export function PixelSparkle({
  active,
  className,
}: {
  active: boolean
  className?: string
}) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className={`absolute ${className}`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0],
            rotate: [0, 180],
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.6 }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="var(--pixel-yellow)"
          >
            <path d="M12 0h2v8h8v2h-8v8h-2v-8H4v-2h8V0z" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
