"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

function AfriBlocksLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none">
      <rect x="8" y="24" width="12" height="8" rx="1" fill="#D97706" />
      <rect x="20" y="24" width="12" height="8" rx="1" fill="#B45309" />
      <rect x="14" y="16" width="12" height="8" rx="1" fill="#16A34A" />
      <rect x="11" y="8" width="8" height="8" rx="1" fill="#F59E0B" />
      <rect x="19" y="8" width="8" height="8" rx="1" fill="#DC2626" />
      <circle cx="14" cy="28" r="1.5" fill="#FCD34D" />
      <circle cx="26" cy="28" r="1.5" fill="#92400E" />
      <circle cx="20" cy="20" r="1.5" fill="#22C55E" />
      <circle cx="15" cy="12" r="1.5" fill="#FBBF24" />
      <circle cx="23" cy="12" r="1.5" fill="#EF4444" />
    </svg>
  )
}

const NAV_LINKS = [
  { label: "Challenge", href: "#challenge" },
  { label: "Build", href: "#builder" },
  { label: "Gallery", href: "#gallery" },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on anchor click
  const handleNavClick = () => setMobileOpen(false)

  return (
    <>
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
            <a
              href="#"
              className={cn(
                "flex items-center gap-2 transition-colors",
                isScrolled ? "text-amber-900 hover:text-amber-700" : "text-white hover:text-amber-200",
              )}
              aria-label="AfriBlocks Home"
            >
              <AfriBlocksLogo className="w-8 h-8" />
              <span className="text-xl font-bold tracking-tight">AfriBlocks</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isScrolled ? "text-amber-800 hover:text-amber-600" : "text-white/80 hover:text-white",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {/* CTA */}
              <a
                href="#builder"
                className={cn(
                  "hidden sm:inline-flex px-4 py-2 rounded-full text-sm font-semibold transition-all",
                  isScrolled
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700"
                    : "bg-white text-amber-900 hover:bg-amber-50",
                )}
              >
                Start Building
              </a>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "md:hidden p-2 rounded-lg transition-colors",
                  isScrolled ? "text-amber-900 hover:bg-amber-100" : "text-white hover:bg-white/10",
                )}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-amber-200 md:hidden"
          >
            <nav className="container-custom py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={handleNavClick}
                  className="px-4 py-3 text-amber-900 font-medium rounded-lg hover:bg-amber-50 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#builder"
                onClick={handleNavClick}
                className="mt-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl text-center"
              >
                Start Building
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
