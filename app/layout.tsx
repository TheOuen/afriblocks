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
  title: "BrickDreams — Build Your Future One Block at a Time",
  description: "Create amazing LEGO creations, share them with the world, and vote for your favorites!",
  openGraph: {
    siteName: "BrickDreams",
    title: "Build Your Future One Block at a Time | BrickDreams",
    description: "Create amazing LEGO creations, share them with the world, and vote for your favorites!",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Build Your Future One Block at a Time | BrickDreams",
    description: "Create amazing LEGO creations, share them with the world, and vote for your favorites!",
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
