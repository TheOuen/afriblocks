"use client"
import { motion } from "framer-motion"
import { Instagram, Twitter, Youtube } from "lucide-react"

// Custom AfriBlocks Logo
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

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    "Create": [
      { name: "Start Building", href: "#builder" },
      { name: "Daily Challenge", href: "#challenge" },
      { name: "Building Tips", href: "#" },
      { name: "Inspiration Gallery", href: "#gallery" },
    ],
    "Community": [
      { name: "Leaderboard", href: "#" },
      { name: "Past Winners", href: "#" },
      { name: "Share Your Build", href: "#" },
      { name: "African Builders", href: "#" },
    ],
    "About": [
      { name: "Our Mission", href: "#" },
      { name: "Prize Info", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Contact", href: "#" },
    ],
  }

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ]

  return (
    <footer className="bg-gradient-to-b from-amber-900 to-amber-950 text-white">
      <div className="container-custom py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-4">
                <AfriBlocksLogo className="w-10 h-10" />
                <h3 className="text-2xl font-bold">AfriBlocks</h3>
              </div>
              <p className="text-amber-200/70 mb-6 leading-relaxed">
                Build Africa, one block at a time. Create amazing builds, compete in daily challenges, and celebrate African creativity with builders across the continent!
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 hover:text-white hover:bg-amber-500/20 transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon size={18} />
                    <span className="sr-only">{social.name}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
              {Object.entries(footerLinks).map(([category, links], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h4 className="font-semibold text-white mb-4">{category}</h4>
                  <ul className="space-y-3">
                    {links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className="text-amber-200/70 hover:text-white transition-colors duration-200"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative African-inspired pattern */}
        <div className="flex justify-center mb-8">
          <svg width="200" height="20" viewBox="0 0 200 20" className="opacity-30">
            <pattern id="footerPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 L5,0 L10,10 L5,20 Z" fill="#D97706" />
              <path d="M10,10 L15,0 L20,10 L15,20 Z" fill="#16A34A" />
            </pattern>
            <rect width="200" height="20" fill="url(#footerPattern)" />
          </svg>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="pt-8 border-t border-amber-800 flex justify-center items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-amber-300/60 text-center">
            <p>&copy; {currentYear} AfriBlocks. All rights reserved.</p>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Guidelines
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
