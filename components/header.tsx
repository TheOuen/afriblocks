"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Blocks } from "lucide-react"

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
          ? "bg-white/90 border-gray-200/50"
          : "bg-gray-900/20 border-white/10",
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
                isScrolled ? "text-gray-800 hover:text-red-600" : "text-white hover:text-red-200",
              )}
              aria-label="BrickDreams Home"
            >
              <Blocks className="w-7 h-7 lg:w-8 lg:h-8" />
              <span className="text-xl lg:text-2xl font-bold tracking-tight">BrickDreams</span>
            </a>
          </motion.div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#featured"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-gray-600 hover:text-red-600" : "text-white/80 hover:text-white",
              )}
            >
              Featured
            </a>
            <a
              href="#builder"
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled ? "text-gray-600 hover:text-red-600" : "text-white/80 hover:text-white",
              )}
            >
              Build
            </a>
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold transition-all",
              isScrolled
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                : "bg-white text-gray-800 hover:bg-gray-100",
            )}
          >
            Start Building
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
