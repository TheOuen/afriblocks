"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Trophy, Gift, Users, Heart, Calendar } from "lucide-react"
import { BRICK_COLORS } from "@/lib/lego-pieces"

// Daily challenges - African themed
const DAILY_CHALLENGES = [
  {
    id: "elephant",
    title: "Build an Elephant",
    description: "Create your best African elephant using any colors. Show us the majesty of Africa's gentle giants!",
    prize: "Building Set + 500 Bonus Bricks",
    difficulty: "Medium",
  },
  {
    id: "baobab",
    title: "Create a Baobab Tree",
    description: "Build the iconic tree of life - the magnificent Baobab that dots the African savanna!",
    prize: "Building Set + 300 Bonus Bricks",
    difficulty: "Easy",
  },
  {
    id: "safari-jeep",
    title: "Design a Safari Jeep",
    description: "Create the ultimate safari vehicle for exploring the African wilderness!",
    prize: "Building Set + 400 Bonus Bricks",
    difficulty: "Medium",
  },
  {
    id: "lion",
    title: "Build a Lion",
    description: "The king of the jungle! Build a majestic lion in your own creative style.",
    prize: "Building Set + 600 Bonus Bricks",
    difficulty: "Hard",
  },
  {
    id: "hut",
    title: "Create a Traditional Hut",
    description: "Build a traditional African round hut with your own creative touches!",
    prize: "Building Set + 350 Bonus Bricks",
    difficulty: "Easy",
  },
  {
    id: "giraffe",
    title: "Build a Giraffe",
    description: "Create the tallest animal on Earth - the graceful African giraffe!",
    prize: "Building Set + 450 Bonus Bricks",
    difficulty: "Medium",
  },
  {
    id: "sunset",
    title: "African Sunset Scene",
    description: "Capture the beauty of an African sunset with silhouettes and warm colors!",
    prize: "Premium Building Set + 700 Bonus Bricks",
    difficulty: "Hard",
  },
]

// Get today's challenge based on date
function getTodayChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length]
}

// Calculate time until midnight (next challenge)
function getTimeUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight.getTime() - now.getTime()
}

const CURRENT_CHALLENGE = {
  ...getTodayChallenge(),
  endDate: new Date(Date.now() + getTimeUntilMidnight()),
  submissions: 47,
}

// Sample submissions for voting - African themed names
const SUBMISSIONS = [
  {
    id: "1",
    name: "Savanna Sunset",
    creator: "KenyaBuilder",
    votes: 234,
    bricks: generateMockBricks(12),
  },
  {
    id: "2",
    name: "Golden Safari",
    creator: "AfricanDreamer",
    votes: 189,
    bricks: generateMockBricks(15),
  },
  {
    id: "3",
    name: "Ubuntu Spirit",
    creator: "MasaiBricks",
    votes: 312,
    bricks: generateMockBricks(18),
  },
  {
    id: "4",
    name: "Serengeti Dreams",
    creator: "TanzaniaArt",
    votes: 156,
    bricks: generateMockBricks(10),
  },
  {
    id: "5",
    name: "Cape Town Glory",
    creator: "SouthAfricaFan",
    votes: 278,
    bricks: generateMockBricks(20),
  },
  {
    id: "6",
    name: "Nile Wonder",
    creator: "EgyptBuilder",
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
          <div className="bg-amber-950 text-white text-2xl md:text-3xl font-mono font-bold px-4 py-2 rounded-lg min-w-[60px]">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-xs text-amber-200/60 mt-1 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors = {
    Easy: "bg-green-500/20 text-green-100",
    Medium: "bg-yellow-500/20 text-yellow-100",
    Hard: "bg-red-500/20 text-red-100",
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[difficulty as keyof typeof colors] || colors.Medium}`}>
      {difficulty}
    </span>
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
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-200 hover:shadow-lg hover:border-amber-300 transition-all"
    >
      {/* Preview area */}
      <div className="relative h-40 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
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
                ? "bg-amber-500"
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
        <h3 className="font-bold text-amber-900 mb-1">{submission.name}</h3>
        <p className="text-sm text-amber-700/70 mb-4">by {submission.creator}</p>

        {/* Vote button */}
        <button
          onClick={onVote}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
            hasVoted
              ? "bg-amber-500 text-white"
              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
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
    <section id="challenge" className="py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container-custom">
        {/* Challenge header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-3xl p-8 md:p-12 text-white mb-12 relative overflow-hidden"
        >
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20l10-10v20L20 20zm0 0L10 10v20l10-10z' fill='%23fff' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Daily Challenge
                </div>
                <DifficultyBadge difficulty={CURRENT_CHALLENGE.difficulty} />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4">
                {CURRENT_CHALLENGE.title}
              </h2>
              <p className="text-amber-100/80 text-lg max-w-xl mb-6">
                {CURRENT_CHALLENGE.description}
              </p>

              {/* Prize */}
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-4">
                <Gift className="w-8 h-8 text-yellow-300" />
                <div>
                  <div className="text-xs text-amber-200/60 uppercase tracking-wide">Prize</div>
                  <div className="font-semibold">{CURRENT_CHALLENGE.prize}</div>
                </div>
              </div>
            </div>

            {/* Timer and stats */}
            <div className="flex flex-col items-start lg:items-end gap-6">
              <div>
                <div className="flex items-center gap-2 text-amber-200/60 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  New challenge in
                </div>
                <CountdownTimer endDate={CURRENT_CHALLENGE.endDate} />
              </div>

              <div className="flex items-center gap-2 text-amber-100/80">
                <Users className="w-5 h-5" />
                <span className="font-semibold">{CURRENT_CHALLENGE.submissions}</span>
                <span>submissions today</span>
              </div>

              <a
                href="#builder"
                className="px-6 py-3 bg-white text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-colors"
              >
                Submit Your Build
              </a>
            </div>
          </div>
        </motion.div>

        {/* Winner info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-800">How Winners Are Chosen</h3>
              <p className="text-green-700/80 text-sm">
                The creator with the most votes each day is entered into our monthly draw to win real building sets shipped anywhere in Africa!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Submissions grid */}
        <div id="gallery" className="mb-8">
          <h3 className="text-2xl font-bold text-amber-900 mb-2">Vote for Your Favorite</h3>
          <p className="text-amber-700/70 mb-8">The build with the most votes wins today's challenge!</p>

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
