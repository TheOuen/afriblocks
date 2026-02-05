// LEGO brick types and configuration

// Standard LEGO colors
export type BrickColor =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'green'
  | 'orange'
  | 'white'
  | 'black'
  | 'purple'
  | 'pink'
  | 'cyan'
  | 'lime'
  | 'brown';

// Brick sizes (studs width x depth)
export type BrickSize = '1x1' | '1x2' | '2x2' | '2x4' | '1x4' | '2x3';

export interface LegoBrick {
  id: string;
  color: BrickColor;
  size: BrickSize;
  x: number; // Grid position
  y: number; // Height (layer)
  z: number; // Grid position
}

export interface BrickOption {
  size: BrickSize;
  color: BrickColor;
  label: string;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

// Standard LEGO color hex values for rendering
export const BRICK_COLORS: Record<BrickColor, { main: string; dark: string; light: string }> = {
  red: { main: '#C91A09', dark: '#8A1208', light: '#E74C3C' },
  blue: { main: '#0055BF', dark: '#003A82', light: '#3498DB' },
  yellow: { main: '#F2CD37', dark: '#C9A227', light: '#F7DC6F' },
  green: { main: '#237841', dark: '#1A5A31', light: '#27AE60' },
  orange: { main: '#FE8A18', dark: '#C96A12', light: '#FF9F43' },
  white: { main: '#F4F4F4', dark: '#D1D1D1', light: '#FFFFFF' },
  black: { main: '#1B1B1B', dark: '#000000', light: '#333333' },
  purple: { main: '#81007B', dark: '#5C0059', light: '#9B59B6' },
  pink: { main: '#FC97AC', dark: '#E07689', light: '#FECAD1' },
  cyan: { main: '#00BCD4', dark: '#008C9E', light: '#4DD0E1' },
  lime: { main: '#BBE90B', dark: '#8CB008', light: '#D4ED2D' },
  brown: { main: '#583927', dark: '#3D271B', light: '#795548' },
};

// Brick size dimensions (in grid units)
export const BRICK_DIMENSIONS: Record<BrickSize, { width: number; depth: number }> = {
  '1x1': { width: 1, depth: 1 },
  '1x2': { width: 1, depth: 2 },
  '2x2': { width: 2, depth: 2 },
  '2x4': { width: 2, depth: 4 },
  '1x4': { width: 1, depth: 4 },
  '2x3': { width: 2, depth: 3 },
};

// Available brick palette
export const BRICK_PALETTE: BrickOption[] = [
  // 1x1 bricks - all colors
  { size: '1x1', color: 'red', label: 'Red' },
  { size: '1x1', color: 'blue', label: 'Blue' },
  { size: '1x1', color: 'yellow', label: 'Yellow' },
  { size: '1x1', color: 'green', label: 'Green' },
  { size: '1x1', color: 'orange', label: 'Orange' },
  { size: '1x1', color: 'white', label: 'White' },
  { size: '1x1', color: 'black', label: 'Black' },
  { size: '1x1', color: 'purple', label: 'Purple' },
  { size: '1x1', color: 'pink', label: 'Pink' },
  { size: '1x1', color: 'cyan', label: 'Cyan' },
  { size: '1x1', color: 'lime', label: 'Lime' },
  { size: '1x1', color: 'brown', label: 'Brown' },

  // 1x2 bricks
  { size: '1x2', color: 'red', label: 'Red' },
  { size: '1x2', color: 'blue', label: 'Blue' },
  { size: '1x2', color: 'yellow', label: 'Yellow' },
  { size: '1x2', color: 'green', label: 'Green' },
  { size: '1x2', color: 'orange', label: 'Orange' },
  { size: '1x2', color: 'white', label: 'White' },

  // 2x2 bricks
  { size: '2x2', color: 'red', label: 'Red' },
  { size: '2x2', color: 'blue', label: 'Blue' },
  { size: '2x2', color: 'yellow', label: 'Yellow' },
  { size: '2x2', color: 'green', label: 'Green' },
  { size: '2x2', color: 'white', label: 'White' },
  { size: '2x2', color: 'black', label: 'Black' },

  // 2x4 bricks
  { size: '2x4', color: 'red', label: 'Red' },
  { size: '2x4', color: 'blue', label: 'Blue' },
  { size: '2x4', color: 'yellow', label: 'Yellow' },
  { size: '2x4', color: 'green', label: 'Green' },
  { size: '2x4', color: 'white', label: 'White' },

  // 1x4 bricks
  { size: '1x4', color: 'red', label: 'Red' },
  { size: '1x4', color: 'blue', label: 'Blue' },
  { size: '1x4', color: 'yellow', label: 'Yellow' },
  { size: '1x4', color: 'green', label: 'Green' },

  // 2x3 bricks
  { size: '2x3', color: 'red', label: 'Red' },
  { size: '2x3', color: 'blue', label: 'Blue' },
  { size: '2x3', color: 'yellow', label: 'Yellow' },
  { size: '2x3', color: 'green', label: 'Green' },
];

// Standard brick pack (limited pieces for builds)
export const STARTER_PACK = {
  '1x1': 20,
  '1x2': 15,
  '2x2': 12,
  '2x4': 8,
  '1x4': 6,
  '2x3': 6,
};

export const TOTAL_STARTER_BRICKS = Object.values(STARTER_PACK).reduce((a, b) => a + b, 0);

// Generate unique ID for bricks
export function generateBrickId(): string {
  return `brick-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Sample featured projects for voting
export interface FeaturedProject {
  id: string;
  name: string;
  creator: string;
  votes: number;
  bricks: LegoBrick[];
  thumbnail?: string;
  createdAt: Date;
}

// Sample projects data
export const SAMPLE_PROJECTS: FeaturedProject[] = [
  {
    id: 'project-1',
    name: 'Rainbow Tower',
    creator: 'BrickMaster42',
    votes: 142,
    createdAt: new Date('2025-12-01'),
    bricks: [
      { id: '1', color: 'red', size: '2x4', x: 0, y: 0, z: 0 },
      { id: '2', color: 'orange', size: '2x4', x: 0, y: 1, z: 0 },
      { id: '3', color: 'yellow', size: '2x4', x: 0, y: 2, z: 0 },
      { id: '4', color: 'green', size: '2x4', x: 0, y: 3, z: 0 },
      { id: '5', color: 'blue', size: '2x4', x: 0, y: 4, z: 0 },
      { id: '6', color: 'purple', size: '2x4', x: 0, y: 5, z: 0 },
    ],
  },
  {
    id: 'project-2',
    name: 'Mini Castle',
    creator: 'LegoLegend',
    votes: 98,
    createdAt: new Date('2025-12-05'),
    bricks: [
      { id: '1', color: 'white', size: '2x4', x: 0, y: 0, z: 0 },
      { id: '2', color: 'white', size: '2x4', x: 0, y: 0, z: 4 },
      { id: '3', color: 'red', size: '2x2', x: 0, y: 1, z: 0 },
      { id: '4', color: 'blue', size: '2x2', x: 0, y: 1, z: 2 },
      { id: '5', color: 'red', size: '2x2', x: 0, y: 1, z: 4 },
      { id: '6', color: 'brown', size: '2x4', x: 0, y: 2, z: 1 },
    ],
  },
  {
    id: 'project-3',
    name: 'Space Rocket',
    creator: 'CoolBuilder',
    votes: 256,
    createdAt: new Date('2025-12-08'),
    bricks: [
      { id: '1', color: 'white', size: '2x2', x: 0, y: 0, z: 0 },
      { id: '2', color: 'white', size: '2x2', x: 0, y: 1, z: 0 },
      { id: '3', color: 'white', size: '2x2', x: 0, y: 2, z: 0 },
      { id: '4', color: 'red', size: '1x1', x: 0, y: 3, z: 0 },
      { id: '5', color: 'red', size: '1x1', x: 1, y: 3, z: 0 },
      { id: '6', color: 'orange', size: '1x2', x: 0, y: -1, z: 0 },
      { id: '7', color: 'orange', size: '1x2', x: 1, y: -1, z: 0 },
    ],
  },
  {
    id: 'project-4',
    name: 'Flower Garden',
    creator: 'BrickArtist',
    votes: 178,
    createdAt: new Date('2025-12-10'),
    bricks: [
      { id: '1', color: 'green', size: '2x2', x: 0, y: 0, z: 0 },
      { id: '2', color: 'green', size: '2x2', x: 0, y: 1, z: 0 },
      { id: '3', color: 'pink', size: '1x1', x: 0, y: 2, z: 0 },
      { id: '4', color: 'pink', size: '1x1', x: 1, y: 2, z: 0 },
      { id: '5', color: 'yellow', size: '1x2', x: 0, y: 1, z: -1 },
      { id: '6', color: 'yellow', size: '1x2', x: 0, y: 1, z: 2 },
    ],
  },
];
