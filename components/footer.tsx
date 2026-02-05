"use client"
import { motion } from "framer-motion"
import { Instagram, Twitter, Youtube, Blocks } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    "Create": [
      { name: "Start Building", href: "#builder" },
      { name: "Featured Creations", href: "#featured" },
      { name: "Building Tips", href: "#" },
      { name: "Inspiration Gallery", href: "#" },
    ],
    "Community": [
      { name: "Leaderboard", href: "#" },
      { name: "Challenges", href: "#" },
      { name: "Events", href: "#" },
      { name: "Forums", href: "#" },
    ],
    "About": [
      { name: "Our Story", href: "#" },
      { name: "Team", href: "#" },
      { name: "Prizes", href: "#" },
      { name: "Contact", href: "#" },
    ],
  }

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "YouTube", icon: Youtube, href: "#" },
  ]

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white">
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
                <Blocks className="w-8 h-8 text-red-500" />
                <h3 className="text-2xl font-bold">BrickDreams</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Build your dreams, one block at a time. Create amazing LEGO masterpieces, share with the world, and celebrate creativity!
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-red-500/10 rounded-full flex items-center justify-center text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-200"
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
                          className="text-gray-400 hover:text-white transition-colors duration-200"
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

        {/* Decorative element */}
        <div className="flex justify-center mb-8">
          <svg width="200" height="20" viewBox="0 0 200 20" className="opacity-30">
            <pattern id="footerPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 L5,0 L10,10 L5,20 Z" fill="#C91A09" />
              <path d="M10,10 L15,0 L20,10 L15,20 Z" fill="#0055BF" />
            </pattern>
            <rect width="200" height="20" fill="url(#footerPattern)" />
          </svg>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="pt-8 border-t border-gray-700 flex justify-center items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-500 text-center">
            <p>&copy; {currentYear} BrickDreams. All rights reserved.</p>
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
