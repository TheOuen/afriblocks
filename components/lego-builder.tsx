"use client"

import { useState, useRef, Suspense, useCallback } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import { motion } from "framer-motion"
import { Trash2, Undo2, Send, Gift, Palette, X } from "lucide-react"
import * as THREE from "three"
import {
  BrickColor,
  BrickSize,
  BRICK_COLORS,
  generateBrickId,
  STARTER_PACK,
} from "@/lib/lego-pieces"

// ============================================================================
// LEGO BRICK SPECIFICATIONS (Real measurements scaled to 3D units)
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
}

const AVAILABLE_COLORS: BrickColor[] = ["red", "blue", "yellow", "green", "orange", "white", "black", "purple", "pink", "cyan", "lime", "brown"]
const AVAILABLE_SIZES: BrickSize[] = ["1x1", "1x2", "2x2", "2x4", "1x4", "2x3"]
const BASEPLATE_SIZE = 16

function parseBrickSize(size: BrickSize): { width: number; depth: number } {
  const [w, d] = size.split("x").map(Number)
  return { width: w, depth: d }
}

function gridToWorld(gridX: number, gridZ: number, size: BrickSize): { x: number; z: number } {
  const { width, depth } = parseBrickSize(size)
  const x = (gridX + (width - 1) / 2 - (BASEPLATE_SIZE - 1) / 2) * STUD_PITCH
  const z = (gridZ + (depth - 1) / 2 - (BASEPLATE_SIZE - 1) / 2) * STUD_PITCH
  return { x, z }
}

// ============================================================================
// 3D LEGO BRICK COMPONENT
// ============================================================================
function LegoBrick3D({
  color,
  size,
  position,
  onClick,
  isPreview = false,
  isSelected = false,
}: {
  color: BrickColor
  size: BrickSize
  position: [number, number, number]
  onClick?: () => void
  isPreview?: boolean
  isSelected?: boolean
}) {
  const colors = BRICK_COLORS[color]
  const { width, depth } = parseBrickSize(size)
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
    opacity: isPreview ? 0.6 : 1,
    roughness: 0.4,
    metalness: 0.05,
    emissive: isSelected ? "#FFD700" : hovered ? "#222222" : "#000000",
    emissiveIntensity: isSelected ? 0.4 : hovered ? 0.1 : 0,
  }

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation()
        onClick?.()
      }}
      onPointerOver={(e) => {
        if (!isPreview) {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      <mesh position={[0, bodyHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[brickWidth, bodyHeight, brickDepth]} />
        <meshStandardMaterial {...materialProps} />
      </mesh>

      {studs.map(([sx, sz], i) => (
        <group key={i} position={[sx, bodyHeight, sz]}>
          <mesh position={[0, STUD_HEIGHT / 2, 0]} castShadow>
            <cylinderGeometry args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 24]} />
            <meshStandardMaterial {...materialProps} />
          </mesh>
          <mesh position={[0, STUD_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[STUD_RADIUS * 0.5, STUD_RADIUS * 0.95, 24]} />
            <meshStandardMaterial color={colors.light} transparent={isPreview} opacity={isPreview ? 0.6 : 1} />
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
// BASEPLATE COMPONENT
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
            <cylinderGeometry args={[STUD_RADIUS, STUD_RADIUS, STUD_HEIGHT, 24]} />
            <meshStandardMaterial color="#2E8B2E" roughness={0.4} />
          </mesh>
          <mesh position={[0, STUD_HEIGHT, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[STUD_RADIUS * 0.5, STUD_RADIUS * 0.9, 24]} />
            <meshStandardMaterial color="#3CB371" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ============================================================================
// CLICKABLE BASEPLATE PLANE
// ============================================================================
function ClickablePlane({
  size,
  onPlaceClick,
}: {
  size: number
  onPlaceClick: (gridX: number, gridZ: number) => void
}) {
  return (
    <mesh
      position={[0, 0.01, 0]}
      rotation={[-Math.PI / 2, 0, 0]}
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
// SCENE COMPONENT
// ============================================================================
function Scene({
  bricks,
  previewBrick,
  selectedBrickId,
  onBrickClick,
  onPlaceClick,
}: {
  bricks: PlacedBrick[]
  previewBrick: { color: BrickColor; size: BrickSize; gridX: number; gridZ: number; stackLevel: number } | null
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
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
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
        const { x, z } = gridToWorld(brick.gridX, brick.gridZ, brick.size)
        return (
          <LegoBrick3D
            key={brick.id}
            color={brick.color}
            size={brick.size}
            position={[x, brick.stackLevel * BRICK_HEIGHT, z]}
            onClick={() => onBrickClick(brick.id)}
            isSelected={brick.id === selectedBrickId}
          />
        )
      })}

      {previewBrick && (
        <LegoBrick3D
          color={previewBrick.color}
          size={previewBrick.size}
          position={[
            gridToWorld(previewBrick.gridX, previewBrick.gridZ, previewBrick.size).x,
            previewBrick.stackLevel * BRICK_HEIGHT,
            gridToWorld(previewBrick.gridX, previewBrick.gridZ, previewBrick.size).z,
          ]}
          isPreview
        />
      )}

      <ContactShadows position={[0, -0.01, 0]} opacity={0.5} scale={15} blur={2} far={10} />

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
// ISOMETRIC BRICK PREVIEW (for palette)
// ============================================================================
function IsometricBrickPreview({ color, size }: { color: BrickColor; size: BrickSize }) {
  const colors = BRICK_COLORS[color]
  if (!colors) return null

  const { width, depth } = parseBrickSize(size)
  const brickW = width * 16
  const brickD = depth * 16
  const brickH = 20
  const studSize = 6

  const isoX = (x: number, z: number) => 50 + (x - z) * 0.866
  const isoY = (x: number, y: number, z: number) => 40 - y + (x + z) * 0.5

  return (
    <svg viewBox="0 0 100 80" className="w-full h-full">
      <polygon
        points={`
          ${isoX(0, 0)},${isoY(0, brickH, 0)}
          ${isoX(brickW, 0)},${isoY(brickW, brickH, 0)}
          ${isoX(brickW, brickD)},${isoY(brickW, brickH, brickD)}
          ${isoX(0, brickD)},${isoY(0, brickH, brickD)}
        `}
        fill={colors.light}
      />
      <polygon
        points={`
          ${isoX(brickW, 0)},${isoY(brickW, brickH, 0)}
          ${isoX(brickW, 0)},${isoY(brickW, 0, 0)}
          ${isoX(brickW, brickD)},${isoY(brickW, 0, brickD)}
          ${isoX(brickW, brickD)},${isoY(brickW, brickH, brickD)}
        `}
        fill={colors.main}
      />
      <polygon
        points={`
          ${isoX(0, brickD)},${isoY(0, brickH, brickD)}
          ${isoX(brickW, brickD)},${isoY(brickW, brickH, brickD)}
          ${isoX(brickW, brickD)},${isoY(brickW, 0, brickD)}
          ${isoX(0, brickD)},${isoY(0, 0, brickD)}
        `}
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
              <ellipse cx={cx} cy={cy} rx={studSize * 0.6} ry={studSize * 0.3} fill={colors.main} />
              <ellipse cx={cx} cy={cy - 2} rx={studSize * 0.6} ry={studSize * 0.3} fill={colors.light} />
            </g>
          )
        })
      )}
    </svg>
  )
}

// ============================================================================
// PALETTE BRICK (draggable)
// ============================================================================
function PaletteBrick({
  color,
  size,
  remaining,
  onDragStart,
  onClick,
}: {
  color: BrickColor
  size: BrickSize
  remaining: number
  onDragStart: (e: React.DragEvent) => void
  onClick: () => void
}) {
  return (
    <button
      type="button"
      draggable={remaining > 0}
      onDragStart={(e) => {
        if (remaining <= 0) {
          e.preventDefault()
          return
        }
        e.dataTransfer.setData('application/json', JSON.stringify({ color, size }))
        e.dataTransfer.effectAllowed = 'copy'
        onDragStart(e)
      }}
      onClick={() => {
        if (remaining > 0) onClick()
      }}
      className={`relative rounded-xl transition-all ${
        remaining > 0
          ? "bg-white border-2 border-amber-200 hover:border-amber-400 hover:shadow-lg cursor-grab active:cursor-grabbing"
          : "bg-amber-50 border-2 border-amber-100 opacity-40 cursor-not-allowed"
      }`}
      style={{ padding: '8px' }}
    >
      <div className="w-16 h-12 mx-auto">
        <IsometricBrickPreview color={color} size={size} />
      </div>
      <div className="text-center mt-1">
        <span className="text-xs font-bold text-amber-900">{size}</span>
        <span className={`text-xs ml-1 ${remaining > 0 ? 'text-green-600' : 'text-red-600'}`}>
          ({remaining})
        </span>
      </div>
    </button>
  )
}

// ============================================================================
// COLOR PICKER
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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute z-50 bg-white rounded-2xl shadow-2xl border border-amber-200 p-5"
      style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-amber-900 text-lg">Change Color</h4>
        <button onClick={onClose} className="p-1.5 hover:bg-amber-100 rounded-lg">
          <X className="w-5 h-5 text-amber-600" />
        </button>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {AVAILABLE_COLORS.map((color) => {
          const c = BRICK_COLORS[color]
          if (!c) return null
          return (
            <button
              key={color}
              onClick={() => onSelect(color)}
              className={`w-12 h-12 rounded-xl transition-all ${
                currentColor === color ? "ring-4 ring-amber-500 scale-110" : "hover:scale-110"
              }`}
              style={{
                background: `linear-gradient(135deg, ${c.light} 0%, ${c.main} 50%, ${c.dark} 100%)`,
                boxShadow: '0 4px 6px rgba(0,0,0,0.15)',
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
  const [bricks, setBricks] = useState<PlacedBrick[]>([])
  const [selectedBrickId, setSelectedBrickId] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [selectedColor, setSelectedColor] = useState<BrickColor>("red")
  const [selectedSize, setSelectedSize] = useState<BrickSize>("2x2")
  const [isDragOver, setIsDragOver] = useState(false)
  const [pendingDrop, setPendingDrop] = useState<{ color: BrickColor; size: BrickSize } | null>(null)

  const usedBricks = bricks.reduce((acc, brick) => {
    acc[brick.size] = (acc[brick.size] || 0) + 1
    return acc
  }, {} as Record<BrickSize, number>)

  const getRemaining = (size: BrickSize) => {
    const base = STARTER_PACK[size] || 0
    return base - (usedBricks[size] || 0)
  }

  const getStackLevel = useCallback((gridX: number, gridZ: number, size: BrickSize): number => {
    const { width, depth } = parseBrickSize(size)
    let maxLevel = 0

    for (const brick of bricks) {
      const brickDims = parseBrickSize(brick.size)
      const overlapX = gridX < brick.gridX + brickDims.width && gridX + width > brick.gridX
      const overlapZ = gridZ < brick.gridZ + brickDims.depth && gridZ + depth > brick.gridZ

      if (overlapX && overlapZ) {
        maxLevel = Math.max(maxLevel, brick.stackLevel + 1)
      }
    }

    return maxLevel
  }, [bricks])

  const isValidPlacement = (gridX: number, gridZ: number, size: BrickSize): boolean => {
    const { width, depth } = parseBrickSize(size)
    return gridX >= 0 && gridX + width <= BASEPLATE_SIZE &&
           gridZ >= 0 && gridZ + depth <= BASEPLATE_SIZE
  }

  // Add brick via click on the 3D plane
  const addBrickAtPosition = useCallback((gridX: number, gridZ: number) => {
    const colorToUse = pendingDrop?.color || selectedColor
    const sizeToUse = pendingDrop?.size || selectedSize

    if (getRemaining(sizeToUse) <= 0) return
    if (!isValidPlacement(gridX, gridZ, sizeToUse)) return

    const stackLevel = getStackLevel(gridX, gridZ, sizeToUse)

    setBricks((prev) => [
      ...prev,
      {
        id: generateBrickId(),
        color: colorToUse,
        size: sizeToUse,
        gridX,
        gridZ,
        stackLevel,
      },
    ])

    setPendingDrop(null)
  }, [selectedColor, selectedSize, pendingDrop, getRemaining, getStackLevel])

  // HTML5 Drag and Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    const target = e.currentTarget as HTMLElement
    if (!target.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
      setPendingDrop(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      if (data.color && data.size) {
        // Set pending drop - user will click to place
        setPendingDrop({ color: data.color, size: data.size })
      }
    } catch (err) {
      console.error('Invalid drop data')
    }
  }, [])

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
      prev.map((brick) =>
        brick.id === selectedBrickId ? { ...brick, color: newColor } : brick
      )
    )
    setShowColorPicker(false)
  }

  const deleteSelectedBrick = () => {
    if (!selectedBrickId) return
    setBricks((prev) => prev.filter((b) => b.id !== selectedBrickId))
    setSelectedBrickId(null)
    setShowColorPicker(false)
  }

  const handlePaletteClick = (size: BrickSize) => {
    setSelectedSize(size)
    setPendingDrop({ color: selectedColor, size })
  }

  const previewBrick = pendingDrop ? {
    color: pendingDrop.color,
    size: pendingDrop.size,
    gridX: Math.floor(BASEPLATE_SIZE / 2),
    gridZ: Math.floor(BASEPLATE_SIZE / 2),
    stackLevel: getStackLevel(Math.floor(BASEPLATE_SIZE / 2), Math.floor(BASEPLATE_SIZE / 2), pendingDrop.size),
  } : null

  const selectedBrick = bricks.find((b) => b.id === selectedBrickId)

  return (
    <section id="builder" className="py-16 bg-gradient-to-b from-amber-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-black text-amber-900 mb-3">
            Build Your Creation
          </h2>
          <p className="text-amber-700/70 max-w-xl mx-auto">
            Select a color and brick size, then tap the baseplate to place. Rotate the view by dragging!
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-80 bg-white rounded-2xl shadow-xl border border-amber-200 p-6"
          >
            <h3 className="font-bold text-amber-900 text-lg mb-4">Brick Palette</h3>

            <div className="flex items-center gap-3 mb-5 p-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl border border-amber-200">
              <Gift className="w-6 h-6 text-amber-600" />
              <div>
                <p className="text-sm font-bold text-amber-800">+5 bonus bricks</p>
                <p className="text-xs text-amber-600">From community votes!</p>
              </div>
            </div>

            {/* Color selector */}
            <div className="mb-5">
              <label className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 block">
                1. Choose Color
              </label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_COLORS.map((color) => {
                  const c = BRICK_COLORS[color]
                  if (!c) return null
                  return (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-9 h-9 rounded-lg transition-all ${
                        selectedColor === color
                          ? "ring-3 ring-offset-2 ring-amber-500 scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${c.light} 0%, ${c.main} 50%, ${c.dark} 100%)`,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                      title={color}
                    />
                  )
                })}
              </div>
            </div>

            {/* Brick sizes */}
            <div className="mb-5">
              <label className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-3 block">
                2. Select & Tap to Place
              </label>
              <div className="grid grid-cols-3 gap-2">
                {AVAILABLE_SIZES.map((size) => (
                  <PaletteBrick
                    key={size}
                    color={selectedColor}
                    size={size}
                    remaining={getRemaining(size)}
                    onDragStart={() => {}}
                    onClick={() => handlePaletteClick(size)}
                  />
                ))}
              </div>
            </div>

            {/* Pending placement indicator */}
            {pendingDrop && (
              <div className="mb-4 p-3 bg-amber-100 rounded-xl border border-amber-300">
                <p className="text-sm font-semibold text-amber-800">
                  Tap on baseplate to place {pendingDrop.size} {pendingDrop.color} brick
                </p>
                <button
                  onClick={() => setPendingDrop(null)}
                  className="mt-2 text-xs text-amber-600 hover:text-amber-800 underline"
                >
                  Cancel
                </button>
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-amber-200 space-y-2">
              <button
                onClick={() => setBricks((prev) => prev.slice(0, -1))}
                disabled={bricks.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition-colors disabled:opacity-50 font-semibold text-sm"
              >
                <Undo2 className="w-4 h-4" />
                Undo Last
              </button>
              <button
                onClick={() => { setBricks([]); setSelectedBrickId(null); }}
                disabled={bricks.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50 font-semibold text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </motion.div>

          {/* 3D Build Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 bg-white rounded-2xl shadow-xl border border-amber-200 p-5"
          >
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-amber-900">Build Area</h3>
                <span className="text-sm text-amber-700 bg-amber-100 px-3 py-1 rounded-full font-medium">
                  {bricks.length} bricks
                </span>
              </div>

              {selectedBrick && (
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-amber-700 mr-2">
                    Selected: {selectedBrick.size} {selectedBrick.color}
                  </span>
                  <button
                    onClick={() => setShowColorPicker(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors"
                  >
                    <Palette className="w-4 h-4" />
                    Color
                  </button>
                  <button
                    onClick={deleteSelectedBrick}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                  <button
                    onClick={() => { setSelectedBrickId(null); setShowColorPicker(false); }}
                    className="p-1.5 bg-amber-200 rounded-xl hover:bg-amber-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* 3D Canvas with drag/drop wrapper */}
            <div
              className={`relative rounded-2xl overflow-hidden transition-all ${
                isDragOver ? 'ring-4 ring-amber-500' : ''
              }`}
              style={{ height: 450, background: 'linear-gradient(180deg, #FEF3C7 0%, #FDE68A 50%, #D97706 100%)' }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Canvas
                shadows
                camera={{ position: [8, 8, 8], fov: 45 }}
                onPointerMissed={() => {
                  setSelectedBrickId(null)
                  setShowColorPicker(false)
                }}
              >
                <Suspense fallback={null}>
                  <Scene
                    bricks={bricks}
                    previewBrick={null}
                    selectedBrickId={selectedBrickId}
                    onBrickClick={handleBrickClick}
                    onPlaceClick={addBrickAtPosition}
                  />
                </Suspense>
              </Canvas>

              {/* Color picker modal */}
              {showColorPicker && selectedBrick && (
                <>
                  <div className="absolute inset-0 bg-black/30" onClick={() => setShowColorPicker(false)} />
                  <ColorPicker
                    currentColor={selectedBrick.color}
                    onSelect={changeSelectedBrickColor}
                    onClose={() => setShowColorPicker(false)}
                  />
                </>
              )}

              {/* Drag over hint */}
              {isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-amber-500/20">
                  <div className="bg-amber-600 text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-lg">
                    Release to prepare placement
                  </div>
                </div>
              )}

              {/* Pending placement hint */}
              {pendingDrop && !isDragOver && (
                <div className="absolute top-4 inset-x-4 flex justify-center pointer-events-none">
                  <div className="bg-amber-600 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg">
                    Tap on the baseplate to place the {pendingDrop.size} {pendingDrop.color} brick
                  </div>
                </div>
              )}

              {/* Empty state */}
              {bricks.length === 0 && !pendingDrop && !isDragOver && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center bg-white/90 rounded-2xl p-6 shadow-lg border border-amber-200">
                    <p className="text-amber-900 text-lg font-semibold mb-1">Start Building!</p>
                    <p className="text-amber-700/70 text-sm">Select a brick in the palette, then tap on the baseplate</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="mt-5">
              <button
                disabled={bricks.length === 0}
                className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl hover:from-amber-600 hover:to-orange-700 transition-colors disabled:opacity-50 font-bold text-lg shadow-lg"
              >
                <Send className="w-5 h-5" />
                Submit to Today's Challenge
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
