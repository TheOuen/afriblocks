"use client"

import { useState, useCallback, Suspense, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2, Undo2, Send, Palette, X, RotateCw, ChevronUp, ChevronDown, Minus, Plus } from "lucide-react"
import * as THREE from "three"
import {
  BrickColor,
  BrickSize,
  BRICK_COLORS,
  generateBrickId,
  STARTER_PACK,
} from "@/lib/lego-pieces"
import { useIsMobile } from "@/hooks/use-mobile"

// ============================================================================
// LEGO BRICK SPECIFICATIONS
// ============================================================================
const STUD_PITCH = 0.8
const BRICK_HEIGHT = 0.96
const PLATE_HEIGHT = 0.32
const STUD_DIAMETER = 0.48
const STUD_RADIUS = STUD_DIAMETER / 2
const STUD_HEIGHT = 0.16
const TOLERANCE = 0.01

interface PlacedBrick {
  id: string
  color: BrickColor
  size: BrickSize
  gridX: number
  gridZ: number
  stackLevel: number
  rotation: 0 | 90
}

const AVAILABLE_COLORS: BrickColor[] = ["red", "blue", "yellow", "green", "orange", "white", "black", "purple", "pink", "cyan", "lime", "brown"]
const AVAILABLE_SIZES: BrickSize[] = ["1x1", "1x2", "2x2", "2x4", "1x4", "2x3"]
const BASEPLATE_SIZE = 16

function parseBrickSize(size: BrickSize, rotation: 0 | 90 = 0): { width: number; depth: number } {
  const [w, d] = size.split("x").map(Number)
  return rotation === 90 ? { width: d, depth: w } : { width: w, depth: d }
}

function gridToWorld(gridX: number, gridZ: number, size: BrickSize, rotation: 0 | 90 = 0): { x: number; z: number } {
  const { width, depth } = parseBrickSize(size, rotation)
  const x = (gridX + (width - 1) / 2 - (BASEPLATE_SIZE - 1) / 2) * STUD_PITCH
  const z = (gridZ + (depth - 1) / 2 - (BASEPLATE_SIZE - 1) / 2) * STUD_PITCH
  return { x, z }
}

// ============================================================================
// 3D LEGO BRICK
// ============================================================================
function LegoBrick3D({
  color,
  size,
  position,
  rotation = 0,
  onClick,
  isPreview = false,
  isSelected = false,
}: {
  color: BrickColor
  size: BrickSize
  position: [number, number, number]
  rotation?: 0 | 90
  onClick?: () => void
  isPreview?: boolean
  isSelected?: boolean
}) {
  const colors = BRICK_COLORS[color]
  const { width, depth } = parseBrickSize(size, rotation)
  const [hovered, setHovered] = useState(false)

  const brickWidth = width * STUD_PITCH - TOLERANCE
  const brickDepth = depth * STUD_PITCH - TOLERANCE
  const bodyHeight = BRICK_HEIGHT - STUD_HEIGHT

  const studs: [number, number][] = []
  for (let x = 0; x < width; x++) {
    for (let z = 0; z < depth; z++) {
      studs.push([
        (x - (width - 1) / 2) * STUD_PITCH,
        (z - (depth - 1) / 2) * STUD_PITCH,
      ])
    }
  }

  const materialProps = {
    color: colors.main,
    transparent: isPreview,
    opacity: isPreview ? 0.5 : 1,
    roughness: 0.4,
    metalness: 0.05,
    emissive: isSelected ? "#FFD700" : hovered ? "#222222" : "#000000",
    emissiveIntensity: isSelected ? 0.4 : hovered ? 0.08 : 0,
  }

  return (
    <group
      position={position}
      onClick={(e) => { e.stopPropagation(); onClick?.() }}
      onPointerOver={(e) => {
        if (!isPreview) { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer" }
      }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default" }}
    >
      <mesh position={[0, bodyHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[brickWidth, bodyHeight, brickDepth]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {studs.map(([sx, sz], i) => (
        <group key={i} position={[sx, bodyHeight, sz]}>
          <mesh position={[0, STUD_HEIGHT / 2, 0]} castShadow>
            <cylinderGeometry args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 16]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          <mesh position={[0, STUD_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[STUD_RADIUS * 0.5, STUD_RADIUS * 0.95, 16]} />
            <meshStandardMaterial color={colors.light} transparent={isPreview} opacity={isPreview ? 0.5 : 1} />
          </mesh>
        </group>
      ))}

      {isSelected && (
        <mesh position={[0, bodyHeight / 2, 0]}>
          <boxGeometry args={[brickWidth + 0.06, bodyHeight + 0.06, brickDepth + 0.06]} />
          <meshBasicMaterial color="#FFD700" transparent opacity={0.3} wireframe />
        </mesh>
      )}
    </group>
  )
}

// ============================================================================
// BASEPLATE (optimized: fewer segments on studs)
// ============================================================================
function Baseplate({ size }: { size: number }) {
  const studs: [number, number][] = []
  for (let x = 0; x < size; x++) {
    for (let z = 0; z < size; z++) {
      studs.push([
        (x - (size - 1) / 2) * STUD_PITCH,
        (z - (size - 1) / 2) * STUD_PITCH,
      ])
    }
  }
  const baseplateThickness = PLATE_HEIGHT * 0.5

  return (
    <group>
      <mesh receiveShadow position={[0, -baseplateThickness / 2, 0]}>
        <boxGeometry args={[size * STUD_PITCH, baseplateThickness, size * STUD_PITCH]} />
        <meshStandardMaterial color="#2E8B2E" roughness={0.5} />
      </mesh>
      {studs.map(([sx, sz], i) => (
        <group key={i} position={[sx, 0, sz]}>
          <mesh position={[0, STUD_HEIGHT / 2, 0]} castShadow>
            <cylinderGeometry args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 12]} />
            <meshStandardMaterial color="#2E8B2E" roughness={0.4} />
          </mesh>
          <mesh position={[0, STUD_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[STUD_RADIUS * 0.5, STUD_RADIUS * 0.9, 12]} />
            <meshStandardMaterial color="#3CB371" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ============================================================================
// CLICKABLE PLANE
// ============================================================================
function ClickablePlane({
  size,
  onPlaceClick,
}: {
  size: number
  onPlaceClick: (gridX: number, gridZ: number) => void
}) {
  return (
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}
      onClick={(e) => {
        e.stopPropagation()
        const point = e.point
        const gridX = Math.round(point.x / STUD_PITCH + (size - 1) / 2)
        const gridZ = Math.round(point.z / STUD_PITCH + (size - 1) / 2)
        if (gridX >= 0 && gridX < size && gridZ >= 0 && gridZ < size) {
          onPlaceClick(gridX, gridZ)
        }
      }}
    >
      <planeGeometry args={[size * STUD_PITCH, size * STUD_PITCH]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

// ============================================================================
// SCENE
// ============================================================================
function Scene({
  bricks,
  selectedBrickId,
  onBrickClick,
  onPlaceClick,
}: {
  bricks: PlacedBrick[]
  selectedBrickId: string | null
  onBrickClick: (id: string) => void
  onPlaceClick: (gridX: number, gridZ: number) => void
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
      <directionalLight position={[-5, 10, -5]} intensity={0.3} />
      <Environment preset="city" />

      <Baseplate size={BASEPLATE_SIZE} />
      <ClickablePlane size={BASEPLATE_SIZE} onPlaceClick={onPlaceClick} />

      {bricks.map((brick) => {
        const { x, z } = gridToWorld(brick.gridX, brick.gridZ, brick.size, brick.rotation)
        return (
          <LegoBrick3D
            key={brick.id}
            color={brick.color}
            size={brick.size}
            rotation={brick.rotation}
            position={[x, brick.stackLevel * BRICK_HEIGHT, z]}
            onClick={() => onBrickClick(brick.id)}
            isSelected={brick.id === selectedBrickId}
          />
        )
      })}

      <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={15} blur={2} far={10} />

      <OrbitControls
        makeDefault
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 2.1}
        minDistance={5}
        maxDistance={20}
        enablePan={true}
        target={[0, 1, 0]}
      />
    </>
  )
}

// ============================================================================
// ISOMETRIC BRICK PREVIEW (SVG)
// ============================================================================
function IsometricBrickPreview({ color, size }: { color: BrickColor; size: BrickSize }) {
  const colors = BRICK_COLORS[color]
  if (!colors) return null
  const { width, depth } = parseBrickSize(size)
  const brickW = width * 16
  const brickD = depth * 16
  const brickH = 20

  const isoX = (x: number, z: number) => 50 + (x - z) * 0.866
  const isoY = (x: number, y: number, z: number) => 40 - y + (x + z) * 0.5

  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <polygon
        points={`${isoX(0, 0)},${isoY(0, brickH, 0)} ${isoX(brickW, 0)},${isoY(brickW, brickH, 0)} ${isoX(brickW, brickD)},${isoY(brickW, brickH, brickD)} ${isoX(0, brickD)},${isoY(0, brickH, brickD)}`}
        fill={colors.light}
      />
      <polygon
        points={`${isoX(brickW, 0)},${isoY(brickW, brickH, 0)} ${isoX(brickW, 0)},${isoY(brickW, 0, 0)} ${isoX(brickW, brickD)},${isoY(brickW, 0, brickD)} ${isoX(brickW, brickD)},${isoY(brickW, brickH, brickD)}`}
        fill={colors.main}
      />
      <polygon
        points={`${isoX(0, brickD)},${isoY(0, brickH, brickD)} ${isoX(brickW, brickD)},${isoY(brickW, brickH, brickD)} ${isoX(brickW, brickD)},${isoY(brickW, 0, brickD)} ${isoX(0, brickD)},${isoY(0, 0, brickD)}`}
        fill={colors.dark}
      />
      {Array.from({ length: width }).map((_, i) =>
        Array.from({ length: depth }).map((_, j) => {
          const sx = (i + 0.5) * 16 - 2
          const sz = (j + 0.5) * 16 - 2
          const cx = isoX(sx, sz)
          const cy = isoY(sx, brickH + 4, sz)
          return (
            <g key={`${i}-${j}`}>
              <ellipse cx={cx} cy={cy} rx={6 * 0.6} ry={6 * 0.3} fill={colors.main} />
              <ellipse cx={cx} cy={cy - 2} rx={6 * 0.6} ry={6 * 0.3} fill={colors.light} />
            </g>
          )
        })
      )}
    </svg>
  )
}

// ============================================================================
// COLOR PICKER MODAL
// ============================================================================
function ColorPicker({
  currentColor,
  onSelect,
  onClose,
}: {
  currentColor: BrickColor
  onSelect: (color: BrickColor) => void
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute z-50 bg-white rounded-2xl shadow-2xl border border-amber-200 p-4"
      style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-amber-900">Change Color</h4>
        <button onClick={onClose} className="p-1 hover:bg-amber-100 rounded-lg">
          <X className="w-4 h-4 text-amber-600" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {AVAILABLE_COLORS.map((color) => {
          const c = BRICK_COLORS[color]
          if (!c) return null
          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`w-10 h-10 rounded-lg transition-all ${
                currentColor === color ? "ring-3 ring-amber-500 scale-110" : "hover:scale-105"
              }`}
              style={{
                background: `linear-gradient(135deg, ${c.light} 0%, ${c.main} 50%, ${c.dark} 100%)`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
              }}
              title={color}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

// ============================================================================
// MAIN BUILDER COMPONENT
// ============================================================================
export function LegoBuilder() {
  const isMobile = useIsMobile()
  const [bricks, setBricks] = useState<PlacedBrick[]>([])
  const [selectedBrickId, setSelectedBrickId] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState<BrickColor>("red")
  const [selectedSize, setSelectedSize] = useState<BrickSize>("2x2")
  const [rotation, setRotation] = useState<0 | 90>(0)
  const [paletteOpen, setPaletteOpen] = useState(true)
  const [activeMode, setActiveMode] = useState<"place" | "select">("place")

  // On mobile, start with palette collapsed
  useEffect(() => {
    if (isMobile) setPaletteOpen(false)
  }, [isMobile])

  const usedBricks = bricks.reduce((acc, brick) => {
    acc[brick.size] = (acc[brick.size] || 0) + 1
    return acc
  }, {} as Record<BrickSize, number>)

  const getRemaining = (size: BrickSize) => (STARTER_PACK[size] || 0) - (usedBricks[size] || 0)

  const totalRemaining = AVAILABLE_SIZES.reduce((sum, s) => sum + Math.max(0, getRemaining(s)), 0)
  const totalUsed = bricks.length

  const getStackLevel = useCallback((gridX: number, gridZ: number, size: BrickSize, rot: 0 | 90): number => {
    const { width, depth } = parseBrickSize(size, rot)
    let maxLevel = 0
    for (const brick of bricks) {
      const brickDims = parseBrickSize(brick.size, brick.rotation)
      const overlapX = gridX < brick.gridX + brickDims.width && gridX + width > brick.gridX
      const overlapZ = gridZ < brick.gridZ + brickDims.depth && gridZ + depth > brick.gridZ
      if (overlapX && overlapZ) {
        maxLevel = Math.max(maxLevel, brick.stackLevel + 1)
      }
    }
    return maxLevel
  }, [bricks])

  const isValidPlacement = (gridX: number, gridZ: number, size: BrickSize, rot: 0 | 90): boolean => {
    const { width, depth } = parseBrickSize(size, rot)
    return gridX >= 0 && gridX + width <= BASEPLATE_SIZE && gridZ >= 0 && gridZ + depth <= BASEPLATE_SIZE
  }

  const addBrickAtPosition = useCallback((gridX: number, gridZ: number) => {
    if (activeMode !== "place") return
    if (getRemaining(selectedSize) <= 0) return
    if (!isValidPlacement(gridX, gridZ, selectedSize, rotation)) return

    const stackLevel = getStackLevel(gridX, gridZ, selectedSize, rotation)
    setBricks((prev) => [
      ...prev,
      {
        id: generateBrickId(),
        color: selectedColor,
        size: selectedSize,
        gridX,
        gridZ,
        stackLevel,
        rotation,
      },
    ])
  }, [selectedColor, selectedSize, rotation, activeMode, getStackLevel])

  const handleBrickClick = (id: string) => {
    if (selectedBrickId === id) {
      setShowColorPicker(true)
    } else {
      setSelectedBrickId(id)
      setShowColorPicker(false)
    }
  }

  const changeSelectedBrickColor = (newColor: BrickColor) => {
    if (!selectedBrickId) return
    setBricks((prev) =>
      prev.map((brick) => (brick.id === selectedBrickId ? { ...brick, color: newColor } : brick))
    )
    setShowColorPicker(false)
  }

  const deleteSelectedBrick = () => {
    if (!selectedBrickId) return
    setBricks((prev) => prev.filter((b) => b.id !== selectedBrickId))
    setSelectedBrickId(null)
    setShowColorPicker(false)
  }

  const selectedBrick = bricks.find((b) => b.id === selectedBrickId)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") setRotation((r) => (r === 0 ? 90 : 0))
      if (e.key === "Escape") { setSelectedBrickId(null); setShowColorPicker(false) }
      if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setBricks((prev) => prev.slice(0, -1))
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedBrickId) {
        deleteSelectedBrick()
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [selectedBrickId])

  return (
    <section id="builder" className="py-10 md:py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="container-custom">
        {/* Section header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-4xl font-black text-amber-900 mb-2">
            Build Your Creation
          </h2>
          <p className="text-amber-700/60 text-sm md:text-base max-w-md mx-auto">
            Pick a color and brick, tap the baseplate to place. {!isMobile && "Press R to rotate, Ctrl+Z to undo."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
          {/* ============ PALETTE PANEL ============ */}
          <div className={`lg:w-72 ${isMobile ? "order-2" : ""}`}>
            {/* Mobile toggle */}
            {isMobile && (
              <button
                onClick={() => setPaletteOpen(!paletteOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-xl shadow border border-amber-200 mb-2"
              >
                <span className="font-semibold text-amber-900 text-sm">Brick Palette</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-amber-600">{totalRemaining} left</span>
                  {paletteOpen ? <ChevronUp className="w-4 h-4 text-amber-600" /> : <ChevronDown className="w-4 h-4 text-amber-600" />}
                </div>
              </button>
            )}

            <AnimatePresence>
              {(paletteOpen || !isMobile) && (
                <motion.div
                  initial={isMobile ? { height: 0, opacity: 0 } : false}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={isMobile ? { height: 0, opacity: 0 } : undefined}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden"
                >
                  <div className="p-4 md:p-5">
                    {!isMobile && (
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-amber-900">Brick Palette</h3>
                        <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">{totalRemaining} left</span>
                      </div>
                    )}

                    {/* Color selector */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2 block">
                        Color
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {AVAILABLE_COLORS.map((color) => {
                          const c = BRICK_COLORS[color]
                          if (!c) return null
                          return (
                            <button
                              key={color}
                              onClick={() => setSelectedColor(color)}
                              className={`w-8 h-8 rounded-lg transition-all ${
                                selectedColor === color
                                  ? "ring-2 ring-offset-1 ring-amber-500 scale-110"
                                  : "hover:scale-105"
                              }`}
                              style={{
                                background: `linear-gradient(135deg, ${c.light} 0%, ${c.main} 50%, ${c.dark} 100%)`,
                                boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                              }}
                              title={color}
                            />
                          )
                        })}
                      </div>
                    </div>

                    {/* Size selector */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                          Size
                        </label>
                        <button
                          onClick={() => setRotation((r) => (r === 0 ? 90 : 0))}
                          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors ${
                            rotation === 90
                              ? "bg-amber-500 text-white"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          }`}
                          title="Rotate brick (R)"
                        >
                          <RotateCw className="w-3 h-3" />
                          {rotation === 90 ? "90°" : "0°"}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {AVAILABLE_SIZES.map((size) => {
                          const remaining = getRemaining(size)
                          const isActive = selectedSize === size
                          return (
                            <button
                              key={size}
                              onClick={() => { setSelectedSize(size); setActiveMode("place") }}
                              disabled={remaining <= 0}
                              className={`relative rounded-xl p-2 transition-all ${
                                isActive
                                  ? "bg-amber-500 shadow-md ring-2 ring-amber-300"
                                  : remaining > 0
                                  ? "bg-white border border-amber-200 hover:border-amber-400"
                                  : "bg-amber-50 border border-amber-100 opacity-40 cursor-not-allowed"
                              }`}
                            >
                              <div className="w-12 h-9 mx-auto">
                                <IsometricBrickPreview color={isActive ? selectedColor : selectedColor} size={size} />
                              </div>
                              <div className="text-center mt-0.5">
                                <span className={`text-xs font-bold ${isActive ? "text-white" : "text-amber-900"}`}>{size}</span>
                                <span className={`text-xs ml-1 ${
                                  isActive ? "text-amber-100" : remaining > 3 ? "text-green-600" : remaining > 0 ? "text-orange-600" : "text-red-600"
                                }`}>
                                  ({remaining})
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBricks((prev) => prev.slice(0, -1))}
                        disabled={bricks.length === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors disabled:opacity-40 font-semibold text-sm"
                      >
                        <Undo2 className="w-3.5 h-3.5" />
                        Undo
                      </button>
                      <button
                        onClick={() => { setBricks([]); setSelectedBrickId(null) }}
                        disabled={bricks.length === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-40 font-semibold text-sm"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ============ 3D BUILD AREA ============ */}
          <div className={`flex-1 ${isMobile ? "order-1" : ""}`}>
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-amber-100 bg-amber-50/50">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-amber-900 text-sm">Build Area</h3>
                  <span className="text-xs text-amber-600 bg-white px-2 py-0.5 rounded-full border border-amber-200">
                    {totalUsed} placed
                  </span>
                </div>

                {selectedBrick && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-amber-700 mr-1 hidden sm:inline">
                      {selectedBrick.size} {selectedBrick.color}
                    </span>
                    <button
                      onClick={() => setShowColorPicker(true)}
                      className="p-1.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                      title="Change color"
                    >
                      <Palette className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={deleteSelectedBrick}
                      className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      title="Delete brick"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => { setSelectedBrickId(null); setShowColorPicker(false) }}
                      className="p-1.5 bg-amber-200 rounded-lg hover:bg-amber-300 transition-colors"
                      title="Deselect"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Canvas */}
              <div
                className="relative"
                style={{
                  height: isMobile ? "min(55vh, 400px)" : "min(65vh, 550px)",
                  background: "linear-gradient(180deg, #FEF3C7 0%, #FDE68A 50%, #D97706 100%)",
                }}
              >
                <Canvas
                  shadows
                  camera={{ position: [8, 8, 8], fov: 45 }}
                  onPointerMissed={() => { setSelectedBrickId(null); setShowColorPicker(false) }}
                >
                  <Suspense fallback={null}>
                    <Scene
                      bricks={bricks}
                      selectedBrickId={selectedBrickId}
                      onBrickClick={handleBrickClick}
                      onPlaceClick={addBrickAtPosition}
                    />
                  </Suspense>
                </Canvas>

                {/* Color picker overlay */}
                <AnimatePresence>
                  {showColorPicker && selectedBrick && (
                    <>
                      <div className="absolute inset-0 bg-black/20" onClick={() => setShowColorPicker(false)} />
                      <ColorPicker
                        currentColor={selectedBrick.color}
                        onSelect={changeSelectedBrickColor}
                        onClose={() => setShowColorPicker(false)}
                      />
                    </>
                  )}
                </AnimatePresence>

                {/* Active brick indicator */}
                {activeMode === "place" && !selectedBrickId && (
                  <div className="absolute top-3 left-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm border border-amber-200">
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        background: `linear-gradient(135deg, ${BRICK_COLORS[selectedColor].light}, ${BRICK_COLORS[selectedColor].main})`,
                      }}
                    />
                    <span className="text-xs font-medium text-amber-900">
                      {selectedSize} {rotation === 90 ? "(rotated)" : ""}
                    </span>
                  </div>
                )}

                {/* Empty state */}
                {bricks.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center bg-white/85 backdrop-blur-sm rounded-2xl p-5 shadow border border-amber-200">
                      <p className="text-amber-900 font-semibold mb-0.5">Tap the baseplate to start building</p>
                      <p className="text-amber-700/60 text-sm">
                        {isMobile ? "Pinch to zoom, drag to rotate" : "Drag to rotate, scroll to zoom, R to rotate brick"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit bar */}
              <div className="p-3 md:p-4 border-t border-amber-100 bg-amber-50/50">
                <button
                  disabled={bricks.length === 0}
                  className="w-full flex items-center justify-center gap-2 py-3 md:py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-colors disabled:opacity-40 font-bold text-sm md:text-base shadow-lg"
                >
                  <Send className="w-4 h-4" />
                  Submit to Today's Challenge
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
