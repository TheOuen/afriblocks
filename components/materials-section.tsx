"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Reveal } from "./reveal"
import { cn } from "@/lib/utils"

const differentiators = [
  {
    id: "voice",
    name: "Voice first",
    description: "Talk naturally into your mic. We capture the real you — your tone, your pauses, your authenticity. No more polished CVs hiding the person.",
    image: "/material-oak-macro.png",
    backgroundImage:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/new-source_bloom_max_1x.jpg-t1V6yfeAZKKcEvWEkPn7Pfx7hkHDMf.jpeg",
    tint: "bg-green-50",
  },
  {
    id: "purpose",
    name: "Purpose driven",
    description: "We go beyond skills and experience. We help you find work that actually matters to you — roles where you'll grow, contribute, and belong.",
    image: "/material-walnut-macro.png",
    backgroundImage: "/lunar-gray-interior.png",
    tint: "bg-gray-100",
  },
  {
    id: "transparency",
    name: "Radical transparency",
    description: "Know the real culture before you apply. Career progression reality. Team dynamics. Management style. No more interview surprises.",
    image: "/material-steel-macro.png",
    backgroundImage: "/martian-red-interior.png",
    tint: "bg-red-50",
  },
]

export function MaterialsSection() {
  const [activeDiff, setActiveDiff] = useState("voice")

  const activeDiffData = differentiators.find((m) => m.id === activeDiff) || differentiators[0]

  const AnimatedText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
    return (
      <span>
        {text.split("").map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.03,
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            style={{ display: char === " " ? "inline" : "inline-block" }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id="why-different">
      <div className="absolute inset-0 z-0">
        {differentiators.map((diff) => (
          <motion.div
            key={diff.id}
            className="absolute inset-0"
            initial={{ opacity: diff.id === activeDiff ? 1 : 0 }}
            animate={{ opacity: diff.id === activeDiff ? 1 : 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <Image
              src={diff.backgroundImage || "/placeholder.svg"}
              alt={`${diff.name} background`}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="absolute top-[120px] left-0 right-0 z-10">
        <div className="container-custom text-white">
          <Reveal>
            <div>
              <AnimatePresence mode="wait">
                <motion.h2
                  key={activeDiff}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="font-bold mb-6 text-7xl"
                >
                  <AnimatedText text={activeDiffData.name} delay={0.2} />
                </motion.h2>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeDiff + "-desc"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-lg text-white/90 leading-relaxed max-w-2xl"
                >
                  {activeDiffData.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="container-custom">
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3">
              {differentiators.map((diff) => (
                <motion.button
                  key={diff.id}
                  className={cn(
                    "px-6 py-3 rounded-full font-medium transition-all duration-300 backdrop-blur-md",
                    activeDiff === diff.id
                      ? "bg-white text-neutral-900"
                      : "bg-white/20 text-white hover:bg-white/30",
                  )}
                  onClick={() => setActiveDiff(diff.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {diff.name}
                </motion.button>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
