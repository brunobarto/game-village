export const COLORS = {
  sky: 0xa088b0,
  fog: 0xa088b0,
  ground: 0xc8b8d8,
  path: 0xdcd0e8,
  houseBody: 0xeeeeee,
  houseRoof: 0x9078a8,
  martRoof: 0x4060a0,
  towerBody: 0x504858,
  tree: 0x605070,
  fence: 0x807090,
  playerHat: 0xcc0000,
  playerBody: 0x3366cc,
  npcColors: [0x228822, 0xaa33aa, 0xcc8800, 0x3388aa],
}

export const MAP_SIZE = 60
export const BOUNDS = MAP_SIZE / 2 - 2

export interface BuildingDef {
  id: string
  x: number
  z: number
  w: number
  d: number
  type: 'house' | 'mart' | 'tower'
}

export const BUILDINGS: BuildingDef[] = [
  { id: 'house1', x: -12, z: -12, w: 8, d: 8, type: 'house' },
  { id: 'house2', x: 12, z: -12, w: 8, d: 8, type: 'house' },
  { id: 'mart', x: 16, z: 8, w: 10, d: 8, type: 'mart' },
  { id: 'tower', x: -16, z: 16, w: 12, d: 12, type: 'tower' },
]

export const POIS = [
  { x: 16, z: 13, radius: 4, text: 'POKÉ MART\nAll your item needs!' },
  {
    x: -16,
    z: 23,
    radius: 5,
    text: 'POKÉMON TOWER\nMay the departed souls rest easy.',
  },
  { x: -12, z: -7, radius: 4, text: "Mr. Fuji's House" },
  { x: 12, z: -7, radius: 4, text: 'Lavender Volunteer\nPokémon House' },
  { x: 0, z: 25, radius: 4, text: 'LAVENDER TOWN\nThe Noble Purple Town' },
]
