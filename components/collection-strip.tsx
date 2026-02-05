"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { Reveal } from "./reveal"

const categories = [
  {
    id: "remote-freedom",
    name: "REMOTE FREEDOM",
    tagline: "Work from anywhere",
    image: "/modern-armchair-pillows.png",
    count: "234 roles",
  },
  {
    id: "big-picture",
    name: "BIG PICTURE",
    tagline: "Shape the vision",
    image: "/modular-cushion-bench.png",
    count: "89 roles",
  },
  {
    id: "structured-growth",
    name: "STRUCTURED GROWTH",
    tagline: "Clear paths forward",
    image: "/cloud-white-sofa.png",
    count: "156 roles",
  },
  {
    id: "flex-life",
    name: "FLEX LIFE",
    tagline: "Balance on your terms",
    image: "/distressed-artistic-chair.png",
    count: "312 roles",
  },
  {
    id: "impact-driven",
    name: "IMPACT DRIVEN",
    tagline: "Work that matters",
    image: "/green-modular-loveseat.png",
    count: "178 roles",
  },
  {
    id: "creative-space",
    name: "CREATIVE SPACE",
    tagline: "Express yourself",
    image: "/braided-rope-loveseat.png",
    count: "94 roles",
  },
  {
    id: "team-builders",
    name: "TEAM BUILDERS",
    tagline: "Lead & grow others",
    image: "/colorful-patchwork-sofa.png",
    count: "67 roles",
  },
  {
    id: "deep-focus",
    name: "DEEP FOCUS",
    tagline: "Master your craft",
    image: "/minimalist-boucle-loveseat.png",
    count: "143 roles",
  },
]

export function CollectionStrip() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -100])

  const itemWidth = 320 // 320px (w-80) + 32px gap = 352px per item
  const totalWidth = categories.length * (itemWidth + 32) - 32 // subtract last gap
  const containerWidth = typeof window !== "undefined" ? window.innerWidth : 1200
  const maxDrag = Math.max(0, totalWidth - containerWidth + 48) // add padding

  return (
    <section ref={containerRef} className="py-20 lg:py-32 overflow-hidden">
      <div className="mb-12">
        <Reveal>
          <div className="container-custom text-center">
            <h2 className="text-neutral-900 mb-4 text-6xl font-normal">Find your fit</h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Browse roles by how you want to work, not just what you do.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-8 px-6"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0.1}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              className="flex-shrink-0 w-80 group cursor-pointer"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
                <motion.div
                  className="relative w-full h-full"
                  whileHover={{ filter: "blur(1px)" }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    className="text-center text-white"
                    initial={{ opacity: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold tracking-wider mb-1">{category.name}</h3>
                    <p className="text-sm font-light opacity-90 mb-2">{category.tagline}</p>
                    <p className="text-xs opacity-70">{category.count}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-neutral-500">← Drag to explore categories →</p>
      </div>
    </section>
  )
}
