"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { Blocks, ChevronDown } from "lucide-react"

// Standard LEGO brick colors
const BRICK_COLORS = [
  "#C91A09", // red
  "#0055BF", // blue
  "#F2CD37", // yellow
  "#237841", // green
  "#FE8A18", // orange
  "#81007B", // purple
  "#00BCD4", // cyan
  "#BBE90B", // lime
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
        {/* Top face */}
        <polygon points="20,4 38,14 20,24 2,14" fill={light} />
        {/* Left face */}
        <polygon points="2,14 20,24 20,44 2,34" fill={dark} />
        {/* Right face */}
        <polygon points="38,14 20,24 20,44 38,34" fill={color} />
        {/* Stud */}
        <ellipse cx="20" cy="10" rx="6" ry="3" fill={color} />
        <ellipse cx="20" cy="8" rx="6" ry="3" fill={light} />
      </svg>
    )
  }

  if (size === "1x2") {
    return (
      <svg viewBox="0 0 60 52" className={className} style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))" }}>
        {/* Top face */}
        <polygon points="30,4 56,17 30,30 4,17" fill={light} />
        {/* Left face */}
        <polygon points="4,17 30,30 30,48 4,35" fill={dark} />
        {/* Right face */}
        <polygon points="56,17 30,30 30,48 56,35" fill={color} />
        {/* Studs */}
        <ellipse cx="22" cy="12" rx="5" ry="2.5" fill={color} />
        <ellipse cx="22" cy="10" rx="5" ry="2.5" fill={light} />
        <ellipse cx="38" cy="12" rx="5" ry="2.5" fill={color} />
        <ellipse cx="38" cy="10" rx="5" ry="2.5" fill={light} />
      </svg>
    )
  }

  // 2x2
  return (
    <svg viewBox="0 0 70 56" className={className} style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.3))" }}>
      {/* Top face */}
      <polygon points="35,4 66,20 35,36 4,20" fill={light} />
      {/* Left face */}
      <polygon points="4,20 35,36 35,52 4,36" fill={dark} />
      {/* Right face */}
      <polygon points="66,20 35,36 35,52 66,36" fill={color} />
      {/* Studs */}
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
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate falling bricks
    const sizes: ("1x1" | "1x2" | "2x2")[] = ["1x1", "1x2", "2x2"]
    const newBricks: FallingBrick[] = []

    for (let i = 0; i < 20; i++) {
      newBricks.push({
        id: i,
        x: Math.random() * 100,
        color: BRICK_COLORS[Math.floor(Math.random() * BRICK_COLORS.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 6,
        rotation: Math.random() * 40 - 20,
      })
    }

    setBricks(newBricks)
  }, [])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-gradient-to-b from-yellow-50 via-red-50 to-blue-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C91A09' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Falling LEGO bricks */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bricks.map((brick) => (
          <motion.div
            key={brick.id}
            className="absolute"
            style={{
              left: `${brick.x}%`,
              rotate: brick.rotation,
            }}
            initial={{ y: "-100px", opacity: 0 }}
            animate={{
              y: ["0vh", "110vh"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: brick.duration,
              delay: brick.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <LegoBrickSVG
              color={brick.color}
              size={brick.size}
              className={brick.size === "1x1" ? "w-8 h-10" : brick.size === "1x2" ? "w-12 h-10" : "w-14 h-11"}
            />
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl mb-8 shadow-lg"
          >
            <Blocks className="w-10 h-10 text-white" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-800 tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Build Your Dreams
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl lg:text-4xl font-light text-red-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            One Brick at a Time
          </motion.p>

          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Join our creative community. Build stunning LEGO creations,
            compete in weekly challenges, and win amazing prizes.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a
              href="#challenge"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg shadow-red-500/30"
            >
              See This Week's Challenge
            </a>
            <a
              href="#builder"
              className="px-8 py-4 bg-gray-800 text-white font-bold rounded-xl hover:bg-gray-900 transition-colors"
            >
              Start Building
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown className="w-8 h-8 text-red-500" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
