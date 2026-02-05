"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Trophy, Sparkles, ArrowDown } from "lucide-react"

const BRICK_COLORS = [
  "#D97706", "#B45309", "#16A34A", "#DC2626",
  "#F59E0B", "#92400E", "#EAB308", "#7C2D12",
]

interface FallingBrick {
  id: number
  x: number
  color: string
  size: "1x1" | "1x2" | "2x2"
  delay: number
  duration: number
  rotation: number
}

function LegoBrickSVG({ color, size, className = "" }: { color: string; size: string; className?: string }) {
  const darken = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16)
    const r = Math.max(0, (num >> 16) - amount)
    const g = Math.max(0, ((num >> 8) & 0x00ff) - amount)
    const b = Math.max(0, (num & 0x0000ff) - amount)
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
  }
  const lighten = (hex: string, amount: number) => {
    const num = parseInt(hex.replace("#", ""), 16)
    const r = Math.min(255, (num >> 16) + amount)
    const g = Math.min(255, ((num >> 8) & 0x00ff) + amount)
    const b = Math.min(255, (num & 0x0000ff) + amount)
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`
  }
  const dark = darken(color, 40)
  const light = lighten(color, 30)

  if (size === "1x1") {
    return (
      <svg viewBox="0 0 40 48" className={className} style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))" }}>
        <polygon points="20,4 38,14 20,24 2,14" fill={light} />
        <polygon points="2,14 20,24 20,44 2,34" fill={dark} />
        <polygon points="38,14 20,24 20,44 38,34" fill={color} />
        <ellipse cx="20" cy="10" rx="6" ry="3" fill={color} />
        <ellipse cx="20" cy="8" rx="6" ry="3" fill={light} />
      </svg>
    )
  }
  if (size === "1x2") {
    return (
      <svg viewBox="0 0 60 52" className={className} style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))" }}>
        <polygon points="30,4 56,17 30,30 4,17" fill={light} />
        <polygon points="4,17 30,30 30,48 4,35" fill={dark} />
        <polygon points="56,17 30,30 30,48 56,35" fill={color} />
        <ellipse cx="22" cy="12" rx="5" ry="2.5" fill={color} />
        <ellipse cx="22" cy="10" rx="5" ry="2.5" fill={light} />
        <ellipse cx="38" cy="12" rx="5" ry="2.5" fill={color} />
        <ellipse cx="38" cy="10" rx="5" ry="2.5" fill={light} />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 70 56" className={className} style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))" }}>
      <polygon points="35,4 66,20 35,36 4,20" fill={light} />
      <polygon points="4,20 35,36 35,52 4,36" fill={dark} />
      <polygon points="66,20 35,36 35,52 66,36" fill={color} />
      <ellipse cx="25" cy="14" rx="5" ry="2.5" fill={color} />
      <ellipse cx="25" cy="12" rx="5" ry="2.5" fill={light} />
      <ellipse cx="45" cy="14" rx="5" ry="2.5" fill={color} />
      <ellipse cx="45" cy="12" rx="5" ry="2.5" fill={light} />
      <ellipse cx="25" cy="24" rx="5" ry="2.5" fill={color} />
      <ellipse cx="25" cy="22" rx="5" ry="2.5" fill={light} />
      <ellipse cx="45" cy="24" rx="5" ry="2.5" fill={color} />
      <ellipse cx="45" cy="22" rx="5" ry="2.5" fill={light} />
    </svg>
  )
}

export function HeroSection() {
  const [bricks, setBricks] = useState<FallingBrick[]>([])

  useEffect(() => {
    const sizes: ("1x1" | "1x2" | "2x2")[] = ["1x1", "1x2", "2x2"]
    const newBricks: FallingBrick[] = []
    for (let i = 0; i < 12; i++) {
      newBricks.push({
        id: i,
        x: Math.random() * 100,
        color: BRICK_COLORS[Math.floor(Math.random() * BRICK_COLORS.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        delay: Math.random() * 6,
        duration: 12 + Math.random() * 6,
        rotation: Math.random() * 30 - 15,
      })
    }
    setBricks(newBricks)
  }, [])

  return (
    <section className="relative pt-14 overflow-hidden bg-gradient-to-b from-amber-100 via-orange-100 to-amber-50">
      {/* Falling bricks (reduced count for performance) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bricks.map((brick) => (
          <motion.div
            key={brick.id}
            className="absolute"
            style={{ left: `${brick.x}%`, rotate: brick.rotation }}
            initial={{ y: "-60px", opacity: 0 }}
            animate={{ y: ["0vh", "110vh"], opacity: [0, 0.7, 0.7, 0] }}
            transition={{ duration: brick.duration, delay: brick.delay, repeat: Infinity, ease: "linear" }}
          >
            <LegoBrickSVG
              color={brick.color}
              size={brick.size}
              className={brick.size === "1x1" ? "w-6 h-8" : brick.size === "1x2" ? "w-10 h-8" : "w-11 h-9"}
            />
          </motion.div>
        ))}
      </div>

      {/* Content - compact hero */}
      <div className="relative z-10 px-6 py-16 md:py-24 max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1, type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 bg-amber-900/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-amber-900 text-sm font-medium mb-5"
        >
          <Sparkles className="w-4 h-4" />
          Celebrating African Creativity
        </motion.div>

        <motion.h1
          className="text-4xl md:text-6xl lg:text-7xl font-black text-amber-900 tracking-tight mb-3"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Build Africa
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl font-light text-orange-700 mb-6"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          One Block at a Time
        </motion.p>

        <motion.p
          className="text-amber-800/70 max-w-lg mx-auto mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Create African-inspired builds, compete in daily challenges, vote for favorites, and win real building sets!
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <a
            href="#builder"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/25"
          >
            Start Building
          </a>
          <a
            href="#challenge"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-900 text-white font-bold rounded-xl hover:bg-amber-800 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            Today's Challenge
          </a>
        </motion.div>

        <motion.div
          className="mt-6 inline-flex items-center gap-2 text-amber-700/70 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Winners entered to win real building sets
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="flex justify-center pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <ArrowDown className="w-5 h-5 text-amber-600/50" />
        </motion.div>
      </motion.div>
    </section>
  )
}
