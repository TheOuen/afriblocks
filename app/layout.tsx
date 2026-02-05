import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "AfriBlocks — Build Africa, One Block at a Time",
  description: "Create stunning African-inspired builds, compete in daily challenges, vote for your favorites, and win real prizes!",
  openGraph: {
    siteName: "AfriBlocks",
    title: "Build Africa, One Block at a Time | AfriBlocks",
    description: "Create stunning African-inspired builds, compete in daily challenges, vote for your favorites, and win real prizes!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Africa, One Block at a Time | AfriBlocks",
    description: "Create stunning African-inspired builds, compete in daily challenges, vote for your favorites, and win real prizes!",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans bg-neutral-50 text-neutral-900 overflow-x-hidden">{children}</body>
    </html>
  )
}
