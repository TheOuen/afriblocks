"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Trophy, Gift, Users, Heart, Calendar } from "lucide-react"
import { BRICK_COLORS } from "@/lib/lego-pieces"

const DAILY_CHALLENGES = [
  {
    id: "elephant",
    title: "Build an Elephant",
    description: "Create your best African elephant. Show us the majesty of Africa's gentle giants!",
    prize: "Building Set + 500 Bonus Bricks",
    difficulty: "Medium",
  },
  {
    id: "baobab",
    title: "Create a Baobab Tree",
    description: "Build the iconic tree of life - the magnificent Baobab of the African savanna!",
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

function getTodayChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length]
}

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

const SUBMISSIONS = [
  { id: "1", name: "Savanna Sunset", creator: "KenyaBuilder", votes: 234, bricks: generateMockBricks(12) },
  { id: "2", name: "Golden Safari", creator: "AfricanDreamer", votes: 189, bricks: generateMockBricks(15) },
  { id: "3", name: "Ubuntu Spirit", creator: "MasaiBricks", votes: 312, bricks: generateMockBricks(18) },
  { id: "4", name: "Serengeti Dreams", creator: "TanzaniaArt", votes: 156, bricks: generateMockBricks(10) },
  { id: "5", name: "Cape Town Glory", creator: "SouthAfricaFan", votes: 278, bricks: generateMockBricks(20) },
  { id: "6", name: "Nile Wonder", creator: "EgyptBuilder", votes: 145, bricks: generateMockBricks(8) },
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
      const diff = endDate.getTime() - Date.now()
      if (diff <= 0) { setTimeLeft({ hours: 0, minutes: 0, seconds: 0 }); return }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  return (
    <div className="flex gap-2">
      {[
        { value: timeLeft.hours, label: "HRS" },
        { value: timeLeft.minutes, label: "MIN" },
        { value: timeLeft.seconds, label: "SEC" },
      ].map((item, i) => (
        <div key={i} className="text-center">
          <div className="bg-amber-950 text-white text-xl md:text-2xl font-mono font-bold px-3 py-1.5 rounded-lg min-w-[48px]">
            {String(item.value).padStart(2, "0")}
          </div>
          <div className="text-[10px] text-amber-200/60 mt-1 font-medium">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    Easy: "bg-green-500/20 text-green-100",
    Medium: "bg-yellow-500/20 text-yellow-100",
    Hard: "bg-red-500/20 text-red-100",
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors[difficulty] || colors.Medium}`}>
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
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-200 hover:shadow-md hover:border-amber-300 transition-all"
    >
      <div className="relative h-36 bg-gradient-to-br from-amber-50 to-orange-50 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ transform: "scale(0.55)" }}>
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
        {rank <= 3 && (
          <div
            className={`absolute top-2.5 left-2.5 w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow ${
              rank === 1 ? "bg-amber-500" : rank === 2 ? "bg-gray-400" : "bg-orange-600"
            }`}
          >
            {rank}
          </div>
        )}
      </div>

      <div className="p-3.5">
        <h3 className="font-bold text-amber-900 text-sm mb-0.5">{submission.name}</h3>
        <p className="text-xs text-amber-700/60 mb-3">by {submission.creator}</p>
        <button
          onClick={onVote}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold text-sm transition-all ${
            hasVoted
              ? "bg-amber-500 text-white"
              : "bg-amber-100 text-amber-800 hover:bg-amber-200"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${hasVoted ? "fill-current" : ""}`} />
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
      setVotedIds((prev) => { const next = new Set(prev); next.delete(id); return next })
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, votes: s.votes - 1 } : s)))
    } else {
      setVotedIds((prev) => new Set(prev).add(id))
      setSubmissions((prev) => prev.map((s) => (s.id === id ? { ...s, votes: s.votes + 1 } : s)))
    }
  }

  const sortedSubmissions = [...submissions].sort((a, b) => b.votes - a.votes)

  return (
    <section id="challenge" className="py-12 md:py-20 bg-gradient-to-b from-amber-50 to-white">
      <div className="container-custom">
        {/* Challenge card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-amber-600 via-orange-600 to-amber-700 rounded-2xl md:rounded-3xl p-6 md:p-10 text-white mb-10 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20l10-10v20L20 20zm0 0L10 10v20l10-10z' fill='%23fff' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <div className="inline-flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
                  <Calendar className="w-3.5 h-3.5" />
                  Daily Challenge
                </div>
                <DifficultyBadge difficulty={CURRENT_CHALLENGE.difficulty} />
              </div>
              <h2 className="text-2xl md:text-4xl font-black mb-3">
                {CURRENT_CHALLENGE.title}
              </h2>
              <p className="text-amber-100/80 md:text-lg max-w-xl mb-5">
                {CURRENT_CHALLENGE.description}
              </p>
              <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                <Gift className="w-6 h-6 text-yellow-300 shrink-0" />
                <div>
                  <div className="text-[10px] text-amber-200/60 uppercase tracking-wide">Prize</div>
                  <div className="font-semibold text-sm">{CURRENT_CHALLENGE.prize}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-amber-200/60 text-sm mb-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  New challenge in
                </div>
                <CountdownTimer endDate={CURRENT_CHALLENGE.endDate} />
              </div>
              <div className="flex items-center gap-2 text-amber-100/80 text-sm">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{CURRENT_CHALLENGE.submissions}</span>
                <span>submissions</span>
              </div>
              <a
                href="#builder"
                className="px-5 py-2.5 bg-white text-amber-700 font-bold rounded-xl hover:bg-amber-50 transition-colors text-sm"
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
          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 md:p-5 mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-green-800 text-sm">How Winners Are Chosen</h3>
              <p className="text-green-700/80 text-sm">
                Most votes each day enters our monthly draw for real building sets shipped anywhere in Africa!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Gallery */}
        <div id="gallery">
          <h3 className="text-xl md:text-2xl font-bold text-amber-900 mb-1.5">Vote for Your Favorite</h3>
          <p className="text-amber-700/60 text-sm mb-6">Most votes wins today's challenge!</p>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
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
