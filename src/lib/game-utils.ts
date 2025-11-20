export function calculateLevel(xp: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000]
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      return i + 1
    }
  }
  return 1
}

export function getXpForNextLevel(currentXp: number): number {
  const thresholds = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000]
  const level = calculateLevel(currentXp)
  return thresholds[level] || thresholds[thresholds.length - 1]
}

export function getLevelTitle(level: number, role: 'teacher' | 'student'): string {
  if (role === 'teacher') {
    const titles = ['Initiate', 'Mentor', 'Master', 'Sage', 'Archmaster', 'Legend', 'Eternal', 'Transcendent']
    return titles[Math.min(level - 1, titles.length - 1)]
  } else {
    const titles = ['Novice', 'Apprentice', 'Adept', 'Expert', 'Master', 'Champion', 'Hero', 'Legend']
    return titles[Math.min(level - 1, titles.length - 1)]
  }
}

export function generateArtifactName(score: number, questName: string, theme: string): string {
  const prefixes = {
    fantasy: ['Enchanted', 'Mystical', 'Ancient', 'Ethereal', 'Radiant'],
    scifi: ['Quantum', 'Neural', 'Encrypted', 'Holographic', 'Plasma'],
    medieval: ['Royal', 'Noble', 'Heraldic', 'Forged', 'Sacred'],
    modern: ['Digital', 'Smart', 'Advanced', 'Innovative', 'Premium']
  }
  
  const suffixes = {
    fantasy: ['Scroll', 'Tome', 'Crystal', 'Rune', 'Amulet'],
    scifi: ['Chip', 'Core', 'Drive', 'Matrix', 'Protocol'],
    medieval: ['Seal', 'Banner', 'Crown', 'Chalice', 'Sigil'],
    modern: ['Badge', 'Certificate', 'Award', 'Token', 'Medal']
  }

  const themeKey = theme as keyof typeof prefixes
  const prefix = prefixes[themeKey][Math.floor(Math.random() * prefixes[themeKey].length)]
  const suffix = suffixes[themeKey][Math.floor(Math.random() * suffixes[themeKey].length)]
  
  const conceptWords = questName.split(' ').filter(w => w.length > 4)
  const concept = conceptWords[Math.floor(Math.random() * conceptWords.length)] || 'Mastery'
  
  return `${prefix} ${suffix} of ${concept}`
}

export function getRarityFromScore(score: number): 'common' | 'rare' | 'epic' | 'legendary' {
  if (score >= 98) return 'legendary'
  if (score >= 95) return 'epic'
  if (score >= 90) return 'rare'
  return 'common'
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'just now'
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
