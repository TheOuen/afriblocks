"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

// Custom AfriBlocks Logo
function AfriBlocksLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      {/* Stacked blocks forming Africa-inspired shape */}
      <rect x="8" y="24" width="12" height="8" rx="1" fill="#D97706" />
      <rect x="20" y="24" width="12" height="8" rx="1" fill="#B45309" />
      <rect x="14" y="16" width="12" height="8" rx="1" fill="#16A34A" />
      <rect x="11" y="8" width="8" height="8" rx="1" fill="#F59E0B" />
      <rect x="19" y="8" width="8" height="8" rx="1" fill="#DC2626" />
      {/* Studs */}
      <circle cx="14" cy="28" r="1.5" fill="#FCD34D" />
      <circle cx="26" cy="28" r="1.5" fill="#92400E" />
      <circle cx="20" cy="20" r="1.5" fill="#22C55E" />
      <circle cx="15" cy="12" r="1.5" fill="#FBBF24" />
      <circle cx="23" cy="12" r="1.5" fill="#EF4444" />
    </svg>
  )
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-md border-b",
        isScrolled
          ? "bg-white/90 border-amber-200/50"
          : "bg-amber-900/20 border-white/10",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-14 lg:h-16">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <a
              href="#"
              className={cn(
                "flex items-center gap-2 transition-colors",
                isScrolled ? "text-amber-900 hover:text-amber-700" : "text-white hover:text-amber-200",
              )}
              aria-label="AfriBlocks Home"
            >
              <AfriBlocksLogo className="w-8 h-8 lg:w-9 lg:h-9" />
              <span className="text-xl lg:text-2xl font-bold tracking-tight">AfriBlocks</span>
            </a>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#challenge"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-amber-800 hover:text-amber-600" : "text-white/80 hover:text-white",
              )}
            >
              Daily Challenge
            </a>
            <a
              href="#builder"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-amber-800 hover:text-amber-600" : "text-white/80 hover:text-white",
              )}
            >
              Build
            </a>
            <a
              href="#gallery"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-amber-800 hover:text-amber-600" : "text-white/80 hover:text-white",
              )}
            >
              Gallery
            </a>
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all",
              isScrolled
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                : "bg-white text-amber-900 hover:bg-amber-50",
            )}
          >
            Start Building
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
