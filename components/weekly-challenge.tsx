"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Trophy, Gift, Users, Heart } from "lucide-react"
import { BRICK_COLORS } from "@/lib/lego-pieces"

// This week's challenge
const CURRENT_CHALLENGE = {
  title: "Build a Space Rocket",
  description: "Create your best rocket ship using any colors. Show us your creativity and imagination!",
  prize: "LEGO Space Explorer Set + 500 Bonus Bricks",
  endDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  submissions: 47,
}

// Sample submissions for voting
const SUBMISSIONS = [
  {
    id: "1",
    name: "Galaxy Explorer",
    creator: "BrickMaster42",
    votes: 234,
    bricks: generateMockBricks(12),
  },
  {
    id: "2",
    name: "Red Rocket",
    creator: "LegoLegend",
    votes: 189,
    bricks: generateMockBricks(15),
  },
  {
    id: "3",
    name: "Star Voyager",
    creator: "CoolBuilder",
    votes: 312,
    bricks: generateMockBricks(18),
  },
  {
    id: "4",
    name: "Moon Shuttle",
    creator: "BrickArtist",
    votes: 156,
    bricks: generateMockBricks(10),
  },
  {
    id: "5",
    name: "Solar Flyer",
    creator: "BuilderPro",
    votes: 278,
    bricks: generateMockBricks(20),
  },
  {
    id: "6",
    name: "Mini Rocket",
    creator: "LegoFan99",
    votes: 145,
    bricks: generateMockBricks(8),
  },
]

function generateMockBricks(count: number) {
  const bricks = []
  const colorKeys = Object.keys(BRICK_COLORS) as (keyof typeof BRICK_COLORS)[]
  for (let i = 0; i < count; i++) {
    bricks.push({
      id: `${i}`,
      color: colorKeys[Math.floor(Math.random() * colorKeys.length)],
      x: Math.floor(Math.random() * 4),
      y: Math.floor(i / 4),
      z: Math.floor(Math.random() * 4),
    })
  }
  return bricks
}

function CountdownTimer({ endDate }: { endDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }, 1000)

    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="flex gap-3">
      {[
        { value: timeLeft.hours, label: "HRS" },
        { value: timeLeft.minutes, label: "MIN" },
        { value: timeLeft.seconds, label: "SEC" },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-gray-900 text-white text-2xl md:text-3xl font-mono font-bold px-4 py-2 rounded-lg min-w-[60px]">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-xs text-red-200/60 mt-1 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

function SubmissionCard({
  submission,
  rank,
  hasVoted,
  onVote,
}: {
  submission: typeof SUBMISSIONS[0]
  rank: number
  hasVoted: boolean
  onVote: () => void
}) {
  const colors = BRICK_COLORS

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
    >
      {/* Preview area */}
      <div className="relative h-40 bg-gradient-to-br from-gray-100 to-blue-50 overflow-hidden">
        {/* Simple isometric brick preview */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ transform: "scale(0.6)" }}>
            {submission.bricks.slice(0, 12).map((brick, idx) => {
              const color = colors[brick.color] || colors.red
              return (
                <div
                  key={idx}
                  className="absolute"
                  style={{
                    left: brick.x * 18 + brick.z * -9 + 60,
                    top: brick.z * 10 - brick.y * 14 + 40,
                    zIndex: brick.y * 10 + brick.x + brick.z,
                  }}
                >
                  <svg viewBox="0 0 40 32" className="w-8 h-7">
                    <polygon points="20,2 38,11 20,20 2,11" fill={color.light} />
                    <polygon points="2,11 20,20 20,30 2,21" fill={color.dark} />
                    <polygon points="38,11 20,20 20,30 38,21" fill={color.main} />
                    <ellipse cx="20" cy="8" rx="5" ry="2.5" fill={color.light} />
                  </svg>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rank badge */}
        {rank <= 3 && (
          <div
            className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow ${
              rank === 1
                ? "bg-yellow-500"
                : rank === 2
                ? "bg-gray-400"
                : "bg-orange-600"
            }`}
          >
            {rank}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-gray-800 mb-1">{submission.name}</h3>
        <p className="text-sm text-gray-500 mb-4">by {submission.creator}</p>

        {/* Vote button */}
        <button
          onClick={onVote}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            hasVoted
              ? "bg-red-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <Heart className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`} />
          {submission.votes.toLocaleString()}
        </button>
      </div>
    </motion.div>
  )
}

export function WeeklyChallenge() {
  const [submissions, setSubmissions] = useState(SUBMISSIONS)
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set())

  const handleVote = (id: string) => {
    if (votedIds.has(id)) {
      setVotedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, votes: s.votes - 1 } : s))
      )
    } else {
      setVotedIds((prev) => new Set(prev).add(id))
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s))
      )
    }
  }

  const sortedSubmissions = [...submissions].sort((a, b) => b.votes - a.votes)

  return (
    <section id="challenge" className="py-20 bg-gradient-to-b from-gray-100 to-white">
      <div className="container-custom">
        {/* Challenge header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 md:p-12 text-white mb-12"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
                <Trophy className="w-4 h-4" />
                Weekly Challenge
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                {CURRENT_CHALLENGE.title}
              </h2>
              <p className="text-red-100/80 text-lg max-w-xl mb-6">
                {CURRENT_CHALLENGE.description}
              </p>

              {/* Prize */}
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                <Gift className="w-8 h-8 text-yellow-300" />
                <div>
                  <div className="text-xs text-red-200/60 uppercase tracking-wide">Prize</div>
                  <div className="font-semibold">{CURRENT_CHALLENGE.prize}</div>
                </div>
              </div>
            </div>

            {/* Timer and stats */}
            <div className="flex flex-col items-start lg:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 text-red-200/60 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  Time remaining
                </div>
                <CountdownTimer endDate={CURRENT_CHALLENGE.endDate} />
              </div>

              <div className="flex items-center gap-2 text-red-100/80">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{CURRENT_CHALLENGE.submissions}</span>
                <span>submissions</span>
              </div>

              <a
                href="#builder"
                className="px-6 py-3 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors"
              >
                Submit Your Build
              </a>
            </div>
          </div>
        </motion.div>

        {/* Submissions grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Vote for Your Favorite</h3>
          <p className="text-gray-600 mb-8">The build with the most votes wins the prize!</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSubmissions.map((submission, index) => (
              <SubmissionCard
                key={submission.id}
                submission={submission}
                rank={index + 1}
                hasVoted={votedIds.has(submission.id)}
                onVote={() => handleVote(submission.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
