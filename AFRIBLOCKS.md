# AfriBlocks - Project Documentation

## Overview

**AfriBlocks** is an African-themed LEGO building web platform built with Next.js 15. Users create 3D LEGO builds on an interactive canvas, compete in rotating daily challenges themed around African subjects, vote on community submissions, and winners are entered into draws for real LEGO building sets.

**Live URL:** Single-page application at `/`

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.2.6 |
| UI Library | React | 19 |
| Language | TypeScript | 5.x |
| 3D Engine | Three.js | 0.182.0 |
| 3D React Bindings | @react-three/fiber + drei | 9.4.2 / 10.7.7 |
| Animation | Framer Motion | latest |
| Styling | Tailwind CSS | 4.1.9 |
| Components | Radix UI / shadcn/ui (New York) | various |
| Icons | Lucide React | 0.454.0 |
| Forms | React Hook Form + Zod | 7.60 / 3.25 |
| Package Manager | pnpm | - |

---

## Architecture

```
app/
├── layout.tsx           # Root layout: Inter font, metadata, OG tags
├── page.tsx             # Single-page home: Header → Hero → Challenge → Builder → Footer
└── globals.css          # Tailwind imports, CSS variables (OKLch), custom utilities

components/
├── header.tsx           # Fixed nav with scroll-aware styling, AfriBlocks logo
├── hero-section.tsx     # Landing section: falling bricks animation, African landscape SVG
├── weekly-challenge.tsx # Daily challenge card + countdown + submission voting gallery
├── lego-builder.tsx     # Core 3D builder: palette, canvas, placement logic (848 lines)
├── footer.tsx           # Footer with links, social icons, African pattern
└── ui/                  # 59 shadcn/ui component files

lib/
├── lego-pieces.ts       # Brick types, color definitions, dimensions, starter pack config
└── utils.ts             # cn() helper (clsx + tailwind-merge)

hooks/
├── use-mobile.ts        # Media query hook for mobile detection (768px breakpoint)
└── use-toast.ts         # Toast notification hook
```

---

## Page Flow

The app is a single page with anchor-linked sections:

1. **Header** (`<Header />`) - Fixed top bar, links to `#challenge`, `#builder`, `#gallery`
2. **Hero** (`<HeroSection />`) - Full-viewport landing with animated falling bricks and African scenery
3. **Challenge** (`<WeeklyChallenge />`) - Today's build challenge, countdown timer, voting gallery
4. **Builder** (`<LegoBuilder />`) - Interactive 3D building canvas with brick palette
5. **Footer** (`<Footer />`) - Brand info, links, social media

---

## LEGO Builder - How It Works

### Brick System

**Colors (12):** red, blue, yellow, green, orange, white, black, purple, pink, cyan, lime, brown
Each has `main`, `dark`, `light` hex values for realistic 3D shading.

**Sizes (6):** 1x1, 1x2, 2x2, 2x4, 1x4, 2x3 (width × depth in studs)

**Starter Pack:**

| Size | Count |
|------|-------|
| 1x1  | 20    |
| 1x2  | 15    |
| 2x2  | 12    |
| 2x4  | 8     |
| 1x4  | 6     |
| 2x3  | 6     |
| **Total** | **67** |

### 3D Constants

```
Stud Pitch:     0.8 units
Brick Height:   0.96 units
Plate Height:   0.32 units
Stud Diameter:  0.48 units
Stud Height:    0.16 units
Baseplate:      16×16 studs (green)
```

### Placement Logic

1. **Grid-to-World**: Converts grid coordinates (0-15, 0-15) to Three.js world positions
2. **Stack Calculation**: Checks overlap with existing bricks to find the next available stack level
3. **Bounds Validation**: Ensures brick fits within the 16×16 baseplate

### User Workflow

1. Select a color from the palette (12 color buttons)
2. Click a brick size to activate placement mode
3. Tap on the 3D baseplate to place the brick
4. Click placed bricks to select them (gold highlight)
5. Change color or delete selected bricks
6. Undo last placement or clear all
7. Submit build to the daily challenge

### 3D Rendering

- **Canvas**: react-three/fiber with shadows enabled
- **Camera**: Perspective at `[8, 8, 8]`, 45° FOV
- **Controls**: OrbitControls (rotate, zoom, pan)
- **Lighting**: Ambient (0.5) + Directional (1.2) + secondary directional (0.3)
- **Environment**: "city" preset from drei
- **Shadows**: ContactShadows on ground plane
- **Materials**: MeshStandardMaterial with roughness 0.4, metalness 0.05

---

## Daily Challenge System

7 rotating challenges indexed by day-of-year:

| Challenge | Difficulty | Prize |
|-----------|-----------|-------|
| Build an Elephant | Medium | Set + 500 Bricks |
| Create a Baobab Tree | Easy | Set + 300 Bricks |
| Design a Safari Jeep | Medium | Set + 400 Bricks |
| Build a Lion | Hard | Set + 600 Bricks |
| Create a Traditional Hut | Easy | Set + 350 Bricks |
| Build a Giraffe | Medium | Set + 450 Bricks |
| African Sunset Scene | Hard | Set + 700 Bricks |

Features a countdown timer to midnight, submission gallery with voting (heart toggle), and rank badges for top 3 submissions.

---

## Styling System

- **Color tokens**: OKLch color space via CSS custom properties
- **Spacing**: 8px base scale (8, 16, 24, 32, 40, 48, 64, 80, 96, 120)
- **Typography**: Inter font, scale from 0.75rem to 8rem
- **Border radius**: 0.625rem base with sm/md/lg/xl variants
- **Custom utilities**: `.container-custom` (1320px max), `.glass-panel`, `.grain-texture`
- **Accessibility**: Reduced motion support, high contrast mode, focus-visible outlines
- **Scrollbar**: Custom thin scrollbar (6px)

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| three + @react-three/fiber + drei | 3D LEGO rendering and camera controls |
| framer-motion | Page animations, falling bricks, transitions |
| @radix-ui/* | Accessible UI primitives (59 components) |
| tailwindcss | Utility-first styling |
| lucide-react | Icons throughout the interface |
| recharts | Data visualization (available, not currently used) |
| sonner | Toast notifications |
| date-fns | Date utilities |
| zod + react-hook-form | Form validation (available for future use) |

---

## Development

```bash
pnpm install        # Install dependencies
pnpm dev            # Start dev server (localhost:3000)
pnpm build          # Production build
pnpm start          # Start production server
pnpm lint           # Run ESLint
```

### Config Notes

- `next.config.mjs`: TypeScript build errors ignored, images unoptimized
- `components.json`: shadcn/ui New York style, RSC enabled
- Path alias: `@/*` maps to project root

---

## File Statistics

| File | Lines | Purpose |
|------|-------|---------|
| lego-builder.tsx | 848 | 3D builder (largest component) |
| weekly-challenge.tsx | 416 | Challenge + voting system |
| hero-section.tsx | 318 | Animated landing section |
| lego-pieces.ts | 212 | Brick configuration data |
| footer.tsx | 157 | Footer with links |
| header.tsx | 117 | Navigation header |
| globals.css | 263 | Global styles |
| ui/ (59 files) | ~3000+ | shadcn component library |
