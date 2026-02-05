"use client"

import { motion } from "framer-motion"
import { useRef, useEffect, useState } from "react"
import { ChevronDown, Trophy, Sparkles } from "lucide-react"

// African-inspired warm color palette
const BRICK_COLORS = [
  "#D97706", // Amber/Sunset
  "#B45309", // Earth Brown
  "#16A34A", // Safari Green
  "#DC2626", // Maasai Red
  "#F59E0B", // Gold
  "#92400E", // Deep Earth
  "#EAB308", // Savanna Yellow
  "#7C2D12", // Rich Brown
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

  // 2x2
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

// African landscape silhouette
function AfricanLandscape() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none">
      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
        {/* Background mountains/hills */}
        <path
          d="M0,200 L0,140 Q100,100 200,130 Q350,80 500,120 Q650,70 800,110 Q950,60 1100,100 Q1250,70 1350,90 Q1400,80 1440,100 L1440,200 Z"
          fill="#78350F"
          opacity="0.3"
        />
        {/* Acacia trees silhouette */}
        <g fill="#451A03" opacity="0.6">
          {/* Tree 1 */}
          <rect x="150" y="140" width="4" height="40" />
          <ellipse cx="152" cy="130" rx="25" ry="12" />
          {/* Tree 2 */}
          <rect x="400" y="150" width="3" height="30" />
          <ellipse cx="401" cy="142" rx="20" ry="10" />
          {/* Tree 3 */}
          <rect x="750" y="135" width="5" height="45" />
          <ellipse cx="752" cy="125" rx="30" ry="14" />
          {/* Tree 4 */}
          <rect x="1100" y="145" width="4" height="35" />
          <ellipse cx="1102" cy="137" rx="22" ry="11" />
          {/* Tree 5 */}
          <rect x="1300" y="155" width="3" height="25" />
          <ellipse cx="1301" cy="148" rx="18" ry="9" />
        </g>
        {/* Foreground savanna */}
        <path
          d="M0,200 L0,170 Q200,150 400,165 Q600,145 800,160 Q1000,140 1200,155 Q1350,145 1440,160 L1440,200 Z"
          fill="#92400E"
          opacity="0.4"
        />
      </svg>
    </div>
  )
}

// Sun/Moon element
function AfricanSun() {
  return (
    <motion.div
      className="absolute top-20 right-[15%] w-32 h-32 md:w-40 md:h-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="relative w-full h-full">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 blur-xl opacity-60" />
        <div className="absolute inset-4 rounded-full bg-gradient-to-br from-yellow-200 via-orange-300 to-orange-500" />
      </div>
    </motion.div>
  )
}

export function HeroSection() {
  const [bricks, setBricks] = useState<FallingBrick[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sizes: ("1x1" | "1x2" | "2x2")[] = ["1x1", "1x2", "2x2"]
    const newBricks: FallingBrick[] = []

    for (let i = 0; i < 18; i++) {
      newBricks.push({
        id: i,
        x: Math.random() * 100,
        color: BRICK_COLORS[Math.floor(Math.random() * BRICK_COLORS.length)],
        size: sizes[Math.floor(Math.random() * sizes.length)],
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 6,
        rotation: Math.random() * 40 - 20,
      })
    }

    setBricks(newBricks)
  }, [])

  return (
    <section ref={containerRef} className="relative h-screen overflow-hidden bg-gradient-to-b from-amber-100 via-orange-200 to-amber-300">
      {/* African-inspired pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2378350F' fill-opacity='0.8'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* African Sun */}
      <AfricanSun />

      {/* African Landscape silhouette */}
      <AfricanLandscape />

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
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-amber-900/20 backdrop-blur-sm rounded-full px-4 py-2 text-amber-900 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Celebrating African Creativity
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-amber-900 tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Build Africa
          </motion.h1>

          <motion.p
            className="text-2xl md:text-3xl lg:text-4xl font-light text-orange-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            One Block at a Time
          </motion.p>

          <motion.p
            className="text-lg text-amber-800/80 max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            Join our creative community. Build stunning African-inspired creations,
            compete in daily challenges, and win amazing prizes including real building sets!
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-500/30"
            >
              <Trophy className="w-5 h-5" />
              Today's Challenge
            </a>
            <a
              href="#builder"
              className="px-8 py-4 bg-amber-900 text-white font-bold rounded-xl hover:bg-amber-800 transition-colors"
            >
              Start Building
            </a>
          </motion.div>

          {/* Prize callout */}
          <motion.div
            className="mt-8 inline-flex items-center gap-2 text-amber-700 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Winners entered to win real building sets!
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
            <ChevronDown className="w-8 h-8 text-amber-700" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
