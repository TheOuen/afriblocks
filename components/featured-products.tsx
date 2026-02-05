"use client"

import { motion } from "framer-motion"
import { Reveal } from "./reveal"
import { Mic, Brain, Users, Sparkles, ArrowRight } from "lucide-react"

const journeySteps = [
  {
    id: "1",
    step: "01",
    title: "Tell us who you are",
    description: "Speak naturally into your mic. We ask questions rooted in psychology to understand the real you — not just your CV.",
    icon: Mic,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    id: "2",
    step: "02",
    title: "We find your fit",
    description: "We match you with roles and cultures where you'll actually thrive — based on who you are, not just what's on paper.",
    icon: Brain,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    id: "3",
    step: "03",
    title: "Meet your people",
    description: "Get matched with employers who value what you bring. We give soft hints to both sides for transparent, purposeful connections.",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
]

export function FeaturedProducts() {
  return (
    <section className="py-20 lg:py-32 bg-neutral-50" id="how-it-works">
      <div className="container-custom">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl text-neutral-900 mb-4 lg:text-6xl">
              How it <span className="italic font-light">works</span>
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We don't match CVs to job descriptions. We match people to purpose.
            </p>
          </div>
        </Reveal>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.3,
              },
            },
          }}
        >
          {journeySteps.map((step, index) => (
            <motion.div
              key={step.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    ease: [0.21, 0.47, 0.32, 0.98],
                  },
                },
              }}
            >
              <Reveal delay={index * 0.1}>
                <div className="bg-white rounded-2xl p-8 h-full shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center mb-6`}>
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <span className="text-sm font-mono text-neutral-400 mb-2 block">{step.step}</span>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-3">{step.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.4}>
          <div className="mt-16 text-center">
            <motion.button
              className="inline-flex items-center gap-2 px-8 py-4 bg-neutral-900 text-white font-semibold rounded-full hover:bg-neutral-800 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start your journey
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
