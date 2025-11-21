export const SKIN_TONES = [
  { id: 'light', color: 'oklch(0.85 0.05 60)' },
  { id: 'medium-light', color: 'oklch(0.70 0.08 55)' },
  { id: 'medium', color: 'oklch(0.55 0.10 50)' },
  { id: 'medium-dark', color: 'oklch(0.45 0.08 45)' },
  { id: 'dark', color: 'oklch(0.35 0.06 40)' },
  { id: 'fantasy-blue', color: 'oklch(0.65 0.15 230)' },
  { id: 'fantasy-green', color: 'oklch(0.65 0.15 150)' },
  { id: 'fantasy-purple', color: 'oklch(0.60 0.18 300)' }
]

export const HAIR_STYLES = [
  { id: 'short', name: 'Short' },
  { id: 'medium', name: 'Medium' },
  { id: 'long', name: 'Long' },
  { id: 'braided', name: 'Braided' },
  { id: 'bun', name: 'Bun' },
  { id: 'ponytail', name: 'Ponytail' },
  { id: 'mohawk', name: 'Mohawk' },
  { id: 'bald', name: 'Bald' },
  { id: 'wavy', name: 'Wavy' },
  { id: 'curly', name: 'Curly' }
]

export const HAIR_COLORS = [
  { id: 'black', color: 'oklch(0.20 0 0)' },
  { id: 'brown', color: 'oklch(0.40 0.05 50)' },
  { id: 'blonde', color: 'oklch(0.75 0.10 80)' },
  { id: 'red', color: 'oklch(0.55 0.20 25)' },
  { id: 'white', color: 'oklch(0.90 0 0)' },
  { id: 'gray', color: 'oklch(0.60 0 0)' },
  { id: 'blue', color: 'oklch(0.60 0.20 230)' },
  { id: 'green', color: 'oklch(0.60 0.20 150)' },
  { id: 'purple', color: 'oklch(0.60 0.20 300)' },
  { id: 'pink', color: 'oklch(0.70 0.20 340)' }
]

export const EYE_COLORS = [
  { id: 'brown', color: 'oklch(0.40 0.08 50)' },
  { id: 'blue', color: 'oklch(0.60 0.15 230)' },
  { id: 'green', color: 'oklch(0.60 0.15 150)' },
  { id: 'hazel', color: 'oklch(0.50 0.12 70)' },
  { id: 'gray', color: 'oklch(0.60 0.05 220)' },
  { id: 'amber', color: 'oklch(0.65 0.18 70)' },
  { id: 'red', color: 'oklch(0.55 0.25 20)' },
  { id: 'purple', color: 'oklch(0.60 0.20 300)' }
]

export const BODY_TYPES = [
  { id: 'slim', name: 'Slim' },
  { id: 'average', name: 'Average' },
  { id: 'athletic', name: 'Athletic' },
  { id: 'stocky', name: 'Stocky' }
]

export const OUTFITS = [
  { id: 'casual', name: 'Casual' },
  { id: 'formal', name: 'Formal' },
  { id: 'armor', name: 'Armor' },
  { id: 'robe', name: 'Robe' },
  { id: 'tech-suit', name: 'Tech Suit' },
  { id: 'leather', name: 'Leather' },
  { id: 'tunic', name: 'Tunic' },
  { id: 'cloak', name: 'Cloak' }
]

export const OUTFIT_COLORS = [
  { id: 'red', color: 'oklch(0.55 0.25 25)' },
  { id: 'blue', color: 'oklch(0.55 0.20 230)' },
  { id: 'green', color: 'oklch(0.55 0.20 150)' },
  { id: 'purple', color: 'oklch(0.55 0.20 300)' },
  { id: 'black', color: 'oklch(0.20 0 0)' },
  { id: 'white', color: 'oklch(0.90 0 0)' },
  { id: 'brown', color: 'oklch(0.45 0.08 50)' },
  { id: 'gold', color: 'oklch(0.70 0.15 80)' },
  { id: 'silver', color: 'oklch(0.75 0 0)' },
  { id: 'orange', color: 'oklch(0.65 0.20 50)' }
]

export const ACCESSORIES = [
  { id: 'glasses', name: 'Glasses' },
  { id: 'hat', name: 'Hat' },
  { id: 'scarf', name: 'Scarf' },
  { id: 'necklace', name: 'Necklace' },
  { id: 'earrings', name: 'Earrings' },
  { id: 'crown', name: 'Crown' },
  { id: 'helmet', name: 'Helmet' },
  { id: 'cape', name: 'Cape' },
  { id: 'wings', name: 'Wings' },
  { id: 'mask', name: 'Mask' }
]

export const DEFAULT_AVATAR = {
  skinTone: 'medium',
  hairStyle: 'medium',
  hairColor: 'brown',
  eyeColor: 'brown',
  bodyType: 'average',
  outfit: 'casual',
  outfitColor: 'blue',
  accessories: []
}
