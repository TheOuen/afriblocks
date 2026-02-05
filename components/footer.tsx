"use client"
import { motion } from "framer-motion"
import { Instagram, Twitter, Youtube } from "lucide-react"

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
    Create: [
      { name: "Start Building", href: "#builder" },
      { name: "Daily Challenge", href: "#challenge" },
      { name: "Inspiration Gallery", href: "#gallery" },
    ],
    Community: [
      { name: "Leaderboard", href: "#" },
      { name: "Past Winners", href: "#" },
      { name: "African Builders", href: "#" },
    ],
    About: [
      { name: "Our Mission", href: "#" },
      { name: "Prize Info", href: "#" },
      { name: "FAQ", href: "#" },
    ],
  }

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ]

  return (
    <footer className="bg-gradient-to-b from-amber-900 to-amber-950 text-white">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <AfriBlocksLogo className="w-9 h-9" />
              <h3 className="text-xl font-bold">AfriBlocks</h3>
            </div>
            <p className="text-amber-200/60 mb-5 text-sm leading-relaxed">
              Build Africa, one block at a time. Create builds, compete in daily challenges, and celebrate African creativity with builders across the continent.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-9 h-9 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-400 hover:text-white hover:bg-amber-500/20 transition-all"
                >
                  <social.icon size={16} />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-3 gap-6 lg:gap-12">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4 className="font-semibold text-white text-sm mb-3">{category}</h4>
                  <ul className="space-y-2">
                    {links.map((link) => (
                      <li key={link.name}>
                        <a href={link.href} className="text-amber-200/60 hover:text-white transition-colors text-sm">
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-amber-300/50">
          <p>&copy; {currentYear} AfriBlocks. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
