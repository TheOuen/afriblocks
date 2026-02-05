"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { WeeklyChallenge } from "@/components/weekly-challenge"
import { LegoBuilder } from "@/components/lego-builder"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      <WeeklyChallenge />
      <LegoBuilder />
      <Footer />
    </main>
  )
}
