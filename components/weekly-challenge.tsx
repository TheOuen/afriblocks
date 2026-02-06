"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Trophy, Gift, Users, Heart, Calendar } from "lucide-react"
import { BRICK_COLORS, type BrickColor } from "@/lib/lego-pieces"

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

// ============================================================================
// STRUCTURED SUBMISSION BUILDS (hand-crafted, not random)
// ============================================================================
interface BuildBrick {
  x: number; y: number; z: number; w: number; d: number;
  color: BrickColor
}

// Tower build
const TOWER_BUILD: BuildBrick[] = [
  { x: 0, y: 0, z: 0, w: 2, d: 2, color: "red" },
  { x: 0, y: 0, z: 2, w: 2, d: 2, color: "orange" },
  { x: 0, y: 1, z: 0, w: 2, d: 2, color: "yellow" },
  { x: 0, y: 1, z: 2, w: 2, d: 2, color: "red" },
  { x: 0, y: 2, z: 0, w: 2, d: 4, color: "orange" },
  { x: 0, y: 3, z: 1, w: 2, d: 2, color: "yellow" },
  { x: 0, y: 4, z: 1, w: 1, d: 2, color: "red" },
  { x: 1, y: 4, z: 1, w: 1, d: 2, color: "orange" },
]

// House build
const HOUSE_BUILD: BuildBrick[] = [
  { x: 0, y: 0, z: 0, w: 4, d: 1, color: "brown" },
  { x: 0, y: 0, z: 1, w: 1, d: 2, color: "brown" },
  { x: 3, y: 0, z: 1, w: 1, d: 2, color: "brown" },
  { x: 0, y: 0, z: 3, w: 4, d: 1, color: "brown" },
  { x: 1, y: 0, z: 1, w: 2, d: 2, color: "green" },
  { x: 0, y: 1, z: 0, w: 4, d: 1, color: "white" },
  { x: 0, y: 1, z: 3, w: 4, d: 1, color: "white" },
  { x: 0, y: 1, z: 1, w: 1, d: 2, color: "white" },
  { x: 3, y: 1, z: 1, w: 1, d: 2, color: "white" },
  { x: 0, y: 2, z: 0, w: 4, d: 4, color: "red" },
  { x: 1, y: 3, z: 1, w: 2, d: 2, color: "red" },
]

// Pyramid build
const PYRAMID_BUILD: BuildBrick[] = [
  { x: 0, y: 0, z: 0, w: 4, d: 4, color: "yellow" },
  { x: 0, y: 0, z: 4, w: 4, d: 2, color: "orange" },
  { x: 4, y: 0, z: 0, w: 2, d: 4, color: "orange" },
  { x: 1, y: 1, z: 1, w: 4, d: 4, color: "yellow" },
  { x: 2, y: 2, z: 2, w: 2, d: 2, color: "orange" },
  { x: 2, y: 3, z: 2, w: 1, d: 1, color: "yellow" },
]

// Wall/Fort build
const FORT_BUILD: BuildBrick[] = [
  { x: 0, y: 0, z: 0, w: 1, d: 4, color: "blue" },
  { x: 3, y: 0, z: 0, w: 1, d: 4, color: "blue" },
  { x: 0, y: 0, z: 0, w: 4, d: 1, color: "cyan" },
  { x: 0, y: 0, z: 3, w: 4, d: 1, color: "cyan" },
  { x: 0, y: 1, z: 0, w: 1, d: 1, color: "blue" },
  { x: 3, y: 1, z: 0, w: 1, d: 1, color: "blue" },
  { x: 0, y: 1, z: 3, w: 1, d: 1, color: "blue" },
  { x: 3, y: 1, z: 3, w: 1, d: 1, color: "blue" },
  { x: 0, y: 2, z: 0, w: 1, d: 1, color: "cyan" },
  { x: 3, y: 2, z: 0, w: 1, d: 1, color: "cyan" },
  { x: 0, y: 2, z: 3, w: 1, d: 1, color: "cyan" },
  { x: 3, y: 2, z: 3, w: 1, d: 1, color: "cyan" },
  { x: 1, y: 1, z: 1, w: 2, d: 2, color: "white" },
]

// Tree build
const TREE_BUILD: BuildBrick[] = [
  { x: 1, y: 0, z: 1, w: 2, d: 2, color: "brown" },
  { x: 1, y: 1, z: 1, w: 2, d: 2, color: "brown" },
  { x: 0, y: 2, z: 0, w: 4, d: 4, color: "green" },
  { x: 0, y: 3, z: 0, w: 4, d: 4, color: "green" },
  { x: 0, y: 4, z: 1, w: 4, d: 2, color: "lime" },
  { x: 1, y: 4, z: 0, w: 2, d: 4, color: "green" },
  { x: 1, y: 5, z: 1, w: 2, d: 2, color: "lime" },
]

// Sunset scene
const SUNSET_BUILD: BuildBrick[] = [
  { x: 0, y: 0, z: 0, w: 6, d: 1, color: "brown" },
  { x: 0, y: 0, z: 1, w: 6, d: 1, color: "green" },
  { x: 1, y: 1, z: 0, w: 1, d: 1, color: "brown" },
  { x: 1, y: 2, z: 0, w: 1, d: 1, color: "brown" },
  { x: 0, y: 3, z: 0, w: 2, d: 1, color: "green" },
  { x: 4, y: 1, z: 0, w: 2, d: 2, color: "orange" },
  { x: 4, y: 2, z: 0, w: 2, d: 2, color: "yellow" },
  { x: 4, y: 3, z: 0, w: 1, d: 1, color: "red" },
  { x: 5, y: 3, z: 0, w: 1, d: 1, color: "orange" },
]

const SUBMISSIONS = [
  { id: "1", name: "Savanna Sunset", creator: "KenyaBuilder", votes: 234, build: SUNSET_BUILD, gradient: "from-orange-100 via-amber-50 to-yellow-100" },
  { id: "2", name: "Golden Safari", creator: "AfricanDreamer", votes: 189, build: PYRAMID_BUILD, gradient: "from-yellow-100 via-amber-50 to-orange-100" },
  { id: "3", name: "Ubuntu Spirit", creator: "MasaiBricks", votes: 312, build: TOWER_BUILD, gradient: "from-red-50 via-orange-50 to-amber-50" },
  { id: "4", name: "Serengeti Dreams", creator: "TanzaniaArt", votes: 156, build: TREE_BUILD, gradient: "from-green-50 via-emerald-50 to-lime-50" },
  { id: "5", name: "Cape Town Glory", creator: "SouthAfricaFan", votes: 278, build: HOUSE_BUILD, gradient: "from-sky-50 via-blue-50 to-indigo-50" },
  { id: "6", name: "Nile Wonder", creator: "EgyptBuilder", votes: 145, build: FORT_BUILD, gradient: "from-cyan-50 via-sky-50 to-blue-50" },
]

// ============================================================================
// ISOMETRIC BUILD RENDERER (large, clean)
// ============================================================================
function IsometricBuildPreview({ build }: { build: BuildBrick[] }) {
  const SCALE = 12
  const CX = 120
  const CY = 100

  const isoX = (x: number, z: number) => CX + (x - z) * SCALE * 0.866
  const isoY = (x: number, y: number, z: number) => CY - y * SCALE * 1.1 + (x + z) * SCALE * 0.5

  // Sort by y then z then x for proper layering
  const sorted = [...build].sort((a, b) => {
    if (a.y !== b.y) return a.y - b.y
    if (a.z !== b.z) return a.z - b.z
    return a.x - b.x
  })

  return (
    <svg viewBox="0 0 240 180" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      {sorted.map((brick, idx) => {
        const c = BRICK_COLORS[brick.color]
        const w = brick.w * SCALE
        const d = brick.d * SCALE
        const h = SCALE * 0.9

        const bx = brick.x * SCALE
        const by = brick.y * SCALE * 1.1
        const bz = brick.z * SCALE

        // Top face
        const topPoints = [
          `${isoX(bx, bz)},${isoY(bx, by + h, bz)}`,
          `${isoX(bx + w, bz)},${isoY(bx + w, by + h, bz)}`,
          `${isoX(bx + w, bz + d)},${isoY(bx + w, by + h, bz + d)}`,
          `${isoX(bx, bz + d)},${isoY(bx, by + h, bz + d)}`,
        ].join(" ")

        // Right face
        const rightPoints = [
          `${isoX(bx + w, bz)},${isoY(bx + w, by + h, bz)}`,
          `${isoX(bx + w, bz)},${isoY(bx + w, by, bz)}`,
          `${isoX(bx + w, bz + d)},${isoY(bx + w, by, bz + d)}`,
          `${isoX(bx + w, bz + d)},${isoY(bx + w, by + h, bz + d)}`,
        ].join(" ")

        // Left face
        const leftPoints = [
          `${isoX(bx, bz + d)},${isoY(bx, by + h, bz + d)}`,
          `${isoX(bx + w, bz + d)},${isoY(bx + w, by + h, bz + d)}`,
          `${isoX(bx + w, bz + d)},${isoY(bx + w, by, bz + d)}`,
          `${isoX(bx, bz + d)},${isoY(bx, by, bz + d)}`,
        ].join(" ")

        // Studs on top
        const studs = []
        for (let sx = 0; sx < brick.w; sx++) {
          for (let sz = 0; sz < brick.d; sz++) {
            const studX = (brick.x + sx + 0.5) * SCALE
            const studZ = (brick.z + sz + 0.5) * SCALE
            const cx = isoX(studX, studZ)
            const cy = isoY(studX, by + h + 2, studZ)
            studs.push(
              <g key={`${idx}-${sx}-${sz}`}>
                <ellipse cx={cx} cy={cy + 1.5} rx={SCALE * 0.28} ry={SCALE * 0.14} fill={c.main} />
                <ellipse cx={cx} cy={cy} rx={SCALE * 0.28} ry={SCALE * 0.14} fill={c.light} />
              </g>
            )
          }
        }

        return (
          <g key={idx}>
            <polygon points={leftPoints} fill={c.dark} stroke={c.dark} strokeWidth="0.3" />
            <polygon points={rightPoints} fill={c.main} stroke={c.main} strokeWidth="0.3" />
            <polygon points={topPoints} fill={c.light} stroke={c.light} strokeWidth="0.3" />
            {studs}
          </g>
        )
      })}
    </svg>
  )
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-neutral-200 hover:border-amber-300"
    >
      {/* Preview - large, colorful build */}
      <div className={`relative h-44 md:h-48 bg-gradient-to-br ${submission.gradient} overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-300">
          <IsometricBuildPreview build={submission.build} />
        </div>

        {/* Rank badge */}
        {rank <= 3 && (
          <div
            className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
              rank === 1 ? "bg-gradient-to-br from-amber-400 to-amber-600" : rank === 2 ? "bg-gradient-to-br from-gray-300 to-gray-500" : "bg-gradient-to-br from-orange-400 to-orange-600"
            }`}
          >
            {rank}
          </div>
        )}

        {/* Brick count */}
        <div className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
          {submission.build.length} bricks
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-neutral-900">{submission.name}</h3>
            <p className="text-xs text-neutral-500">by {submission.creator}</p>
          </div>
        </div>
        <button
          onClick={onVote}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            hasVoted
              ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          <Heart className={`w-4 h-4 ${hasVoted ? "fill-current" : ""}`} />
          {submission.votes.toLocaleString()} votes
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
    <section id="challenge" className="py-12 md:py-20 bg-gradient-to-b from-white via-amber-50/50 to-white">
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
          <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-1.5">Vote for Your Favorite</h3>
          <p className="text-neutral-500 text-sm mb-6">The build with the most votes wins today's challenge!</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
